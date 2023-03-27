import Web3 from 'web3';
import {setGlobalState, getGlobalState } from './Store';
import abi from "../abis/Viber_dapp.json"
const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

 

//gets the contract instance using web3.
const getContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')

  if (connectedAccount) {
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()
    const networkData = abi.networks[networkId]

    if (networkData) {
      const contract = new web3.eth.Contract(abi.abi, networkData.address)
      return contract
    } else {
      return null
    }
  } else {
    return getGlobalState('contract')
  }
}



//This function checks if the user's Ethereum wallet is connected and updates the global state.
const walletConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
      await walletConnected()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0].toLowerCase())
    } else {
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}   

const reportError = (error) => {
  // setAlert(JSON.stringify(error), 'red')
  // throw new Error('No ethereum object.')
}

export {
  getContract,
  walletConnected,
}
