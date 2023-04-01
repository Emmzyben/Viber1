// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Viber {
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

    // sends tip directly to the artist's cryptoAddress
function payArtist(uint256 _songIndex, uint256 _tip) public payable {
    require(_songIndex < songCounter, "Invalid song index provided.");
    require(msg.value >= _tip, "Insufficient funds to pay the tip.");

    Song storage song = songs[_songIndex];
address payable artistAddress = payable(address(uint160(uint256(keccak256(abi.encodePacked(song.cryptoAddress))))));


    artistAddress.transfer(_tip);
}

}
