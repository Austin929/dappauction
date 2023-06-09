import auctionAbi from '../abis/NFTAuction.json'
import auctionAddress from '../abis/contractAddress.json'
import nftAbi from '../abis/NFT.json'
import nftAddress from '../abis/nftContractAddress.json'
import { getGlobalState, setGlobalState } from '../store'
import { ethers } from 'ethers'
import Web3 from 'web3'
import axios from 'axios'

const { ethereum } = window
const AuctionContractAddress = auctionAddress.address
const AuctionContractAbi = auctionAbi.abi
const NftContractAddress = nftAddress.address
const NftContractAbi = nftAbi.abi
let tx

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getAuctionContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(AuctionContractAddress, AuctionContractAbi, signer)
    return contract
  } else {
    return getGlobalState('contract')
  }
}

const getNftContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(NftContractAddress, NftContractAbi, signer)
    return contract
  } else {
    return getGlobalState('nftContract')
  }
}

const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWallectConnected()
      await loadCollections()
      await logOutWithCometChat()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}

const createNftAuction = async (auctionParams) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getAuctionContract()
    const nftContract = await getNftContract()
    await nftContract.approve(AuctionContractAddress, auctionParams.tokenId)
    tx = await contract.createAuctionListing(
      auctionParams,
      {
        from: connectedAccount,
      },
    )
    await tx.wait()
    await loadAuctions()
  } catch (error) {
    reportError(error)
  }
}

const updatePrice = async ({ tokenId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getAuctionContract()
    tx = await contract.changePrice(tokenId, toWei(price), {
      from: connectedAccount,
    })
    await tx.wait()
    await loadAuctions()
  } catch (error) {
    reportError(error)
  }
}

const bidOnNFT = async ({ listingId, price }) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getAuctionContract()
    tx = await contract.bid(listingId, {
      from: connectedAccount,
      value: toWei(price),
    })

    await tx.wait()
    await getBidders(listingId)
    await loadAuction(listingId)
  } catch (error) {
    reportError(error)
  }
}

const withdrawBid = async (listingId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getAuctionContract()
    tx = await contract.withdrawBid(listingId, {
      from: connectedAccount,
    })
    await tx.wait()
    await getBidders(listingId)
  } catch (error) {
    reportError(error)
  }
}

const loadAuctions = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getAuctionContract()
    const auctions = await contract.getAuctionLists()
    setGlobalState('auctions', structuredAuctions(auctions))
    setGlobalState(
      'auction',
      structuredAuctions(auctions).sort(() => 0.5 - Math.random())[0],
    )
  } catch (error) {
    reportError(error)
  }
}

const loadAuction = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getAuctionContract()
    const auction = await contract.listings(id)
    setGlobalState('auction', structuredAuctions([auction])[0])
  } catch (error) {
    reportError(error)
  }
}

const getBidders = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getAuctionContract()
    const bidders = await contract.getBids(id)
    setGlobalState('bidders', structuredBidders(bidders))
  } catch (error) {
    reportError(error)
  }
}

const getBidWinner = async (id) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getAuctionContract()
    const winner  = await contract.highestBidder(id)
    setGlobalState('winner', winner)
  } catch (error) {
    reportError(error)
  }
}

const loadCollections = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getNftContract()
    const ownerTokenIds = await contract.getOwnerTokenIds(connectedAccount)
    let collections = [];
    for (let i = 0; i < ownerTokenIds.length; i++) {
      const tokenId = ownerTokenIds[i];
      let tokenURI = await contract.tokenURI(tokenId);
      tokenURI = await axios.get(tokenURI);
      tokenURI = tokenURI.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
      const nftAddress = NftContractAddress;
      collections.push({
        nftAddress,
        tokenId,
        tokenURI
      })
    }
    setGlobalState('collections', collections)
  } catch (error) {
    reportError(error)
  }
}

const mintNft = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getNftContract()
    tx = await contract.mintToken(
      {
        from: connectedAccount,
      },
    )
    await tx.wait()
    await loadCollections();
  } catch (error) {
    reportError(error)
  }
}

const completeAuction = async (listingId) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getAuctionContract()
    tx = await contract.completeAuction(
      listingId,
      {
        from: connectedAccount,
      },
    )
    await tx.wait()
    await loadAuctions()
  } catch (error) {
    reportError(error)
  }
}
  

const structuredBidders = (bidders) =>
  bidders
    .map((bidder) => ({
      bidder: bidder.bidder.toLowerCase(),
      price: fromWei(bidder.bidPrice),
    }))
    .sort((a, b) => b.price - a.price)

const reportError = (error) => {
  console.log(error.message)
  throw new Error('No ethereum object.')
}

const structuredAuctions = (auctions) =>
  auctions
    .map((auction) => ({
      tokenId: auction.tokenId.toNumber(),
      seller: auction.seller.toLowerCase(),
      tokenURI: auction.tokenURI,
      price: fromWei(auction.price),
      listingId: auction.listingId.toNumber(),
      name: auction.name,
      description: auction.description,
      startAt: Number(auction.startAt + '000'),
      endAt: Number(auction.endAt +   '000'),
      status: auction.status,
    }))
    .reverse()

export {
  isWallectConnected,
  connectWallet,
  createNftAuction,
  loadAuctions,
  loadAuction,
  loadCollections,
  bidOnNFT,
  getBidders,
  getBidWinner,
  withdrawBid,
  updatePrice,
  toWei,
  completeAuction,
  mintNft
}
