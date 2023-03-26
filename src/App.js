import { useEffect } from "react"
import { getContract, walletConnected } from "./components/web3"
import Home from "./components/Home"


const App = () => {
  useEffect( ()=> {
     walletConnected()
     getContract()
     

  },[])
  return (
    <div>

    <Home/>

    </div>
  )
}

export default App