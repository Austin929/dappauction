import { useEffect } from 'react'
import Empty from '../components/Empty'
import { useGlobalState, setGlobalState } from '../store'
import Artworks from '../components/Artworks'
import { loadCollections } from '../services/blockchain'

const Mint = () => {
  const [collections] = useGlobalState('collections')
  useEffect(async () => {
      await loadCollections()
  },[])
  return (
    <div
      className="flex flex-col md:flex-row w-full justify-between 
        items-center mx-auto" style={{width: 100,height: 200}}>
      <div className="flex flew-row text-5xl mb-4">
            <button
              className="text-white text-sm p-2 bg-green-500 rounded-sm w-auto 
              flex flex-row justify-center items-center shadow-md shadow-gray-700"
              onClick={() => setGlobalState('boxModal', 'scale-100')}
            >
              Mint
            </button>
        </div>
      </div>
  )
}

export default Mint
