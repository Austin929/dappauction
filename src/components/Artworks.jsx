import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { buyNFTItem } from '../services/blockchain'
import { setGlobalState, getGlobalState } from '../store'
import Countdown from './Countdown'

const Artworks = ({ collections }) => {
  return (
    <div className="w-4/5 py-10 mx-auto justify-center">
      <p className="text-xl uppercase text-white mb-4">
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6
        md:gap-4 lg:gap-3 py-2.5 text-white font-mono px-1"
      >
        {
        collections.map((collection, i) => (
          <Collection key={i} collection={collection} />
        ))
        }
      </div>
    </div>
  )
}

const Collection = ({ collection }) => {
  const createAuction = () => {
    setGlobalState('collection', collection)
    setGlobalState('createAuctionModal', 'scale-100')
  }

  return (
    <div
      className="full overflow-hidden bg-gray-800 rounded-md shadow-xl 
    shadow-black md:w-6/4 md:mt-0 font-sans my-4"
    >
      <img
          src={collection.tokenURI}
          alt={collection.tokenId}
          className="object-cover w-full h-60"
        />
      <button
          className="bg-green-500 w-full h-[40px] p-2 text-center
          font-bold font-mono"
          onClick={createAuction}
        >
          Auction
        </button>
    </div>
  )
}

export default Artworks
