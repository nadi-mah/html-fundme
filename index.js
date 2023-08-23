import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick=connect
fundButton.onclick=fund
balanceButton.onclick=getBalace
withdrawButton.onclick=withdraw
async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      console.log(accounts)
    } else {
      connectButton.innerHTML = "Please install MetaMask"
    }
  }

  async function fund(){
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //provider / connect to the blockchain
        //signer / wallet / someone wth gas
        //contract that we are intracting with
        //ABI and Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done!")
        }catch(error){
            console.log(error)
        }
    }

  }


async function getBalace(){
    if (typeof window.ethereum !== "undefined"){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance =await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }

}

function listenForTransactionMine(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject)=>{
        provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations.`)
        resolve()
        })
    })
    
}
async function withdraw(){
    if (typeof window.ethereum !== "undefined"){
        console.log("withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try{
            const transactionResponse =await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)

        }catch(error){
            console.log(error)
        }
    }

}