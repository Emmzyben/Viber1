import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import '../components/App.css';
import {getContract} from './web3';
import { walletConnected } from "./web3";
import { useGlobalState } from "./Store";
import { create} from "ipfs-http-client";
import { Buffer } from 'buffer'
import {setGlobalState, getGlobalState } from './Store';
import BigNumber from 'bignumber.js';
const { ethereum } = window
window.web3 = new Web3(ethereum)
window.web3 = new Web3(window.web3.currentProvider)

//initialized an ipfs node using infura.
const auth = 'Basic ' + Buffer.from('2N3HCLyqYPZBgoE268VuFbhb4gd' + ':' + '2348eeac740a001d6a849b64155c48de',).toString('base64');

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  })




  const Home = () => {
  const [connectedAccount]  = useGlobalState("connectedAccount")
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
 

  
    useEffect( ()=> {
      walletConnected()
      getContract()
   },[])
  
   useEffect( ()=> {
    connectWallet()
 },[])
 
//This function connects metamast wallet to the app and calls the getallsongs function 
//to display all the songs on the frontend
const connectWallet = async () => {
  if (!connectedAccount) {
    try {
      if (!ethereum) return alert('Please install Metamask');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setGlobalState('connectedAccount', accounts[0].toLowerCase());

      // Retrieve the updated list of songs from the smart contract
      const contract = await getContract();
      const songs = await contract.methods.getAllSongs().call();
      setSongs(songs);
    } catch (error) {
      reportError(error);
    }
  } else {
    setLoading(true);
    const contract = await getContract();
    const songs = await contract.methods.getAllSongs().call();
    setSongs(songs);
    setLoading(false);
  }
};







//This function gets all the songs stored in the smart contract and displays all the songs on the frontend
const getAllSongs = async () => {
  setLoading(true);
  const contract = await getContract(); //get contract instance
  console.log(contract);
  const songs = await contract.methods.getAllSongs().call();
  setSongs(songs);
  setLoading(false);
};



 //this function takes the song index as an argument and calls payartist function
 const payArtist = async (index) => {
  const account = getGlobalState('connectedAccount');
  const contract = await getContract();
  const paymentAmount = prompt(`Please enter tip amount here to confirm payment:`);
  const tip = new BigNumber(paymentAmount).multipliedBy('1000000000000000000').toFixed(0); // converts the tip amount to a bignumber and also to converts it to wei.

  try {
    const cryptoAddress = await contract.methods.getSongCryptoAddress(index).call();
    await contract.methods.PayArtist(cryptoAddress, tip).send({
      from: account,
      value: tip
    });
    alert("Payment successful!.Thanks for the tip");
  } catch (error) {
    alert("Transaction failed.");
    console.error(error);
  }
}





  
  
//this function posts a song to  the postsongs method of the smart contract
  const postSong = async ({ artistName, songTitle, cryptoAddress, ipfsHash }) => {
    try {
        const contract = await getContract();
        console.log(contract);
        const account = getGlobalState('connectedAccount');
        const upload = await contract.methods.postSong(artistName, songTitle, cryptoAddress, ipfsHash).send({ from: account });
        console.log(upload);
        await getAllSongs(); // Call getAllSongs after successful upload
    } catch (error) {
        alert("upload unsuccessful");
    }
};

  
    
      
    
  //this function handles the submited data. it gets the data from the form and sends the attached file to ipfs
  //then retrieves the cid which it passess together with the other details to the postsong method
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[3].files;
  
    if (!files || files.length === 0) { //checks if at least one file has been selected
      return alert("No files selected");
    }
  
    const file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const fileContent = reader.result;
      const created = await ipfs.add(file);
      const cid = created.cid;
      const path = created.path;
      const URI = `https://ipfs.io/ipfs/${created.cid}`
      const upload = {URI, fileContent}
      console.log(upload)
      await postSong({
        artistName: form["Artist_name"].value,
        songTitle: form["Song_title"].value,
        cryptoAddress: form["crypto_address"].value,
        ipfsHash: URI
      });
      form.reset(); //clears the form
    };
  };
  
  
  
    
  


    return (
//the frontend code
<>
<div className="App">
 
    <header>
  <h2 id="label">VIBER MUSIC SHARING DAPP</h2>
  <button id="home" onClick={connectWallet}>connect wallet</button>
<div id='topper'>
{connectedAccount ? (<div >
    {connectedAccount}</div>
) : (<div  >
   
</div>)}
</div>
<p>Share your music to the world and get paid</p>
<button type="button" id="topz" onClick={() => {
  var smallscreen = document.getElementById('smallscreen');
  if (smallscreen.style.display === 'none') {
    smallscreen.style.display = 'block';
  } else {
    smallscreen.style.display = 'none';
  }
}}>upload song</button>

<form onSubmit={handleSubmit} id="smallscreen" >
   <div id="inside">
        <div>
          <label htmlFor="Artist_name">Artist name:</label><br />
          <input type="text" id="Artist name" name="Artist_name" required/>
        </div>
        <div>
          <label htmlFor="Song_title">Song title:</label><br />
          <input type="text" id="Song title" name="Song_title" required />
        </div>

        <div>
          <label htmlFor="crypto_address">crypto address:</label><br />
          <input type="text" id="crypto address" name="crypto_address" required />
        </div>
      
        <div>
          <label htmlFor="audio">upload audio:</label><br />
          <input type="file" id="audio" name="files"  required />
        </div>
        <div>
          <input type="submit" value="Submit" id="submit" />
        </div>
        </div>
      </form>

</header>
<nav>
  <h2>About Viber</h2>
  <p>Viber is a music sharing platform where artists can upload and shares their songs and get tipped for good music</p>
  <p>With viber artists music records are stored in the blockchain giving the artists authenticity and full ownership rights of their work</p>
  <p>To upload their song, artists can fill the upload form with the required details including their ethereum wallet address to receive payments</p>
  <p>listeners can support the artist by tipping them with Crypto</p>
 <p>Attach your song and upload it, let the audience feel the vibe!</p>
 <h2 style={{ color: "red" }}>Pls connect your metamask wallet to access the songs!</h2>
</nav>

<section>
  
    <h3 style={{ color: "white" }}>Post your music</h3>
    <h4 style={{ color: "rgb(226, 79, 79)" }}>
      Share your music with the community!
    </h4>
 
 <form onSubmit={handleSubmit} >
         <h3>Upload song</h3>
        <div>
          <label htmlFor="Artist_name">Artist name:</label><br />
          <input type="text" id="Artist name" name="Artist_name" required/>
        </div>
        <div>
          <label htmlFor="Song_title">Song title:</label><br />
          <input type="text" id="Song title" name="Song_title" required />
        </div>
      
        <div>
          <label htmlFor="crypto_address">crypto address:</label><br />
          <input type="text" id="crypto address" name="crypto_address" required />
        </div>
      
        <div>
          <label htmlFor="audio">upload audio:</label><br />
          <input type="file" id="audio" name="files"  required />
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
</section>
<article>

<div id="phonescreen">
  {loading ? (
    <div>Loading...</div>
  ) : (
    <>
      {songs && songs.length > 0 ? (
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <div id="view">
                <h2>{song.artistName} - {song.songTitle}</h2>
                <p>Song index: {index}</p>
                <p>Crypto address: {song.cryptoAddress}</p>
                  <div >
                    <a id="play" href={song.ipfsHash} target="_blank" rel="noopener noreferrer">
                     play song
                    </a>
                  </div>
                  <div>
                    <p>Do you like the song? pls leave a tip</p>
                    <button type="submit" onClick={() => payArtist(index)}>
                     tip
                    </button>
                  </div>
              
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No songs available</div>
      )}
    </>
  )}
</div>




</article>
  </div>
</>
  );
}

export default Home
