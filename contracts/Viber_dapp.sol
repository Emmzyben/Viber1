// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract viber {
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

    //gets all the songs that have been uploaded in reverse order
   function getAllSongs() public view returns (Song[] memory) {
    Song[] memory allSongs = new Song[](songCounter);
    uint256 j = 0;
    for (uint256 i = songCounter - 1; i >= 0; i--) {
        allSongs[j] = songs[i];
        j++;
    }
    return allSongs;
}



//gets the address associated with the song
  function getCryptoAddress(uint256 _songIndex) public view returns (string memory) {
    require(_songIndex < songCounter, "Invalid song index provided.");

    Song storage song = songs[_songIndex];
    return song.cryptoAddress;
}

}
