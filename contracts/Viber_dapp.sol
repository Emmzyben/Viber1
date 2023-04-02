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
    
    function postSong(string memory _artistName, string memory _songTitle, string memory _cryptoAddress, string memory _ipfsHash) public {
        songs[songCounter] = Song(_artistName, _songTitle, _cryptoAddress, _ipfsHash);
        songCounter++;
    }

    function getAllSongs() public view returns (Song[] memory) {
        Song[] memory allSongs = new Song[](songCounter);
        for (uint256 i = 0; i < songCounter; i++) {
            allSongs[i] = songs[songCounter - 1 - i];
        }
        return allSongs;
    }

    function getSongCryptoAddress(uint256 _songIndex) public view returns (string memory) {
        require(_songIndex < songCounter, "Invalid song index provided.");
        return songs[_songIndex].cryptoAddress;
    }
    
    
    function PayArtist(address payable _cryptoAddress, uint256 _tip) public payable {
    require(msg.value >= _tip, "Insufficient funds to send tip");
    _cryptoAddress.transfer(_tip);
}

}
