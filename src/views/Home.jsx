import Auctions from '../components/Auctions'
import Empty from '../components/Empty'
import Hero from '../components/Hero'
import { useGlobalState } from '../store'

const Home = () => {
  const [auctions] = useGlobalState('auctions')
  return (
    <div>
      <Hero />
      {auctions.length > 0 ? <Auctions auctions={auctions} /> : <Empty />}
    </div>
  )
}

export default Home
