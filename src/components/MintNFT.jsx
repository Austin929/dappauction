import { toast } from 'react-toastify'
import { FaTimes } from 'react-icons/fa'
import { setGlobalState, useGlobalState } from '../store'
import { mintNft } from '../services/blockchain'

const MintNft = () => {
  const [boxModal] = useGlobalState('boxModal')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await mintNft()
          .then(() => {
            resolve()
            closeModal()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Minting & saving data to chain...',
        success: 'Minting completed, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }


  const closeModal = () => {
    setGlobalState('boxModal', 'scale-0')
    resetForm()
  }


  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
        justify-center bg-black bg-opacity-50 transform
        transition-transform duration-300 ${boxModal}`}
    >
      <div className="bg-[#151c25] shadow-xl shadow-[#25bd9c] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-gray-400 italic">MINT NFT</p>
            <button
              type="button"
              onClick={closeModal}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes className="text-gray-400" />
            </button>
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
            Mint Now
          </button>
        </form>
      </div>
    </div>
  )
}

export default MintNft
