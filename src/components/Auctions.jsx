import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { completeAuction,getBidWinner } from '../services/blockchain'
import { setGlobalState, getGlobalState } from '../store'
import Countdown from './Countdown'
import { useEffect } from 'react'

const Auctions = ({ auctions }) => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {auctions.map((auction, i) => (
          <Auction key={i} auction={auction} />
        ))
        }
      </div>
    </div>
  )
}

const Auction = ({ auction }) => {
  console.log(auction.startAt + "000" < Date.now())
  console.log(auction.endAt + "000" < Date.now())
  console.log(auction.endAt,auction.startAt,Date.now())
  const bid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidBox', 'scale-100')
  }

  const handleCompletePlacement = async (e) => {
    e.preventDefault()
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await completeAuction(auction.listingId)
          .then(() => {
            resolve()
            closeModal()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Bid placed successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div
      className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
    shadow-black md:w-6/4 md:mt-0 font-sans my-4"
    >
      <Link to={'/nft/' + auction.listingId}>
      <img
          src={auction.tokenURI}
          alt={auction.tokenId}
          className="object-cover w-full h-60"
        />
        </Link>
        <div
        className="shadow-lg shadow-gray-400 border-4 border-[#ffffff36] 
      flex flex-row justify-between items-center text-gray-300 px-2"
      >
        <div className="flex flex-col items-start py-2 px-1">
          <span>Current Bid</span>
          <div className="font-bold text-center">{auction.price} ETH</div>
        </div>
        <div className="flex flex-col items-start py-2 px-1">
          <span>Auction End</span>
          <div className="font-bold text-center">
            {auction.status == 1 && auction.startAt < Date.now() ? (
              <Countdown timestamp={auction.endAt} />
            ) : (
              '00:00:00'
            )}
          </div>
        </div>
      </div>
      {auction.endAt < Date.now() ? (
        auction.seller == getGlobalState('connectedAccount') ? (
          <button
          className="bg-green-500 w-full h-[40px] p-2 text-center
          font-bold font-mono"
          onClick={handleCompletePlacement}
        >
          complete
        </button>
        ):  
        <button
        className="bg-green-500 w-full h-[40px] p-2 text-center
        font-bold font-mono"
      >
        Over
      </button>): (
        auction.startAt < Date.now() ? (
          <button
          className="bg-green-500 w-full h-[40px] p-2 text-center
          font-bold font-mono"
          onClick={bid}
        >
          bid
        </button>
        ): <button
        className="bg-green-500 w-full h-[40px] p-2 text-center
        font-bold font-mono"
      >
        wait
      </button>)
      }
      
    </div>
  )
}

export default Auctions
