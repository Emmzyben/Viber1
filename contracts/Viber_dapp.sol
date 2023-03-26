// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Viber_dapp {
    
    struct Song {
        string artistName;
        string songTitle;
        string cryptoAddress;
        string ipfsHash;
    }
    
    mapping (uint256 => Song) public songs;
    uint256 public songCounter;
    //takes in the parameters and posts a song
    function postSong(string memory _artistName, string memory _songTitle, string memory _cryptoAddress, string memory _ipfsHash) public {
        songs[songCounter] = Song(_artistName, _songTitle, _cryptoAddress, _ipfsHash);
        songCounter++;
    }

    //gets all the songs that have been uploaded
    function getAllSongs() public view returns (Song[] memory) {
        Song[] memory allSongs = new Song[](songCounter);
        for (uint256 i = 0; i < songCounter; i++) {
            allSongs[i] = songs[i];
        }
        return allSongs;
    }
    // this helper function to the payArtist function converts the crypto address provided from a string to an address type capable of engaging in a transaction
  function stringToAddress(string memory _address) private pure returns (address) {
    bytes memory _addressBytes = bytes(_address);
    require(_addressBytes.length == 42, "Invalid address length");

    bytes memory _bytes = new bytes(20);
    for (uint i = 0; i < 20; i++) {
        _bytes[i] = _addressBytes[i + 2];
    }

    bytes memory emptyBytes = new bytes(4);
    return address(uint160(uint256(keccak256(abi.encodePacked(emptyBytes, _bytes)))));
}
//this function takes in the index of a song, fetches the download fee and crypto address associated with the song
// and transfers the ammount sent to the crypto address.
function payArtist(uint256 _songIndex, uint256 _tip) public payable {
    require(_songIndex < songCounter, "Invalid song index provided.");
    require(msg.value >= _tip, "Insufficient funds to pay the tip.");
    
    Song storage song = songs[_songIndex];
    address payable artistAddress = payable(stringToAddress(song.cryptoAddress));
    artistAddress.transfer(msg.value);
}


}