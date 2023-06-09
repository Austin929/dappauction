import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { createNftAuction, toWei } from '../services/blockchain'
import { setGlobalState, useGlobalState, getGlobalState } from '../store'
import moment from 'moment'


const Collection = () => {
  const [collection] = useGlobalState('collection')
  const [createAuctionModal] = useGlobalState('createAuctionModal')
  const [price, setPrice] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const closeModal = () => {
    setGlobalState('createAuctionModal', 'scale-0')
    setPrice('')
  }

  const handleAuctionPlacement = async (e) => {
    e.preventDefault()
    if (!price) return
    if (!startAt) return
    if (!endAt) return
    if (!name) return
    if (!description) return

    const auctionParams = {
      nftAddress: collection?.nftAddress,
      tokenId: collection?.tokenId,
        price: toWei(price),
        startAt: moment(startAt).unix(),
         endAt: moment(endAt).unix(),
         tokenURI: collection?.tokenURI,
          name: name,
          description: description,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await createNftAuction(auctionParams)
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
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${createAuctionModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#25bd9c] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleAuctionPlacement} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          <div className="flex flex-row justify-center items-center rounded-xl mt-5">
            <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
              <img
                alt="NFT"
                className="h-full w-full object-cover cursor-pointer"
                src={collection?.tokenURI}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="text"
              name="name"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="text"
              name="description"
              placeholder="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>
          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="datetime-local"
              name="startAt"
              placeholder="Start Date"
              onChange={(e) => setStartAt(e.target.value)}
              value={startAt}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="datetime-local"
              name="endAt"
              placeholder="End Date"
              onChange={(e) => setEndAt(e.target.value)}
              value={endAt}
              required
            />
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
            <input
              className="block w-full text-sm
                text-slate-500 bg-transparent border-0
                focus:outline-none focus:ring-0 px-4 py-2"
              type="number"
              name="price"
              step={0.01}
              min={0.01}
              placeholder="Price (Eth)"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <button
            type="submit"
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#25bd9c]
              py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#ffffff]
              hover:border hover:border-[#25bd9c]
              focus:outline-none focus:ring mt-5"
          >
            Auction
          </button>
        </form>
      </div>
    </div>
  )
}

export default Collection
