//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./ERC2981ContractWideRoyalties.sol";

contract Token is ERC721URIStorage, Ownable, ERC2981ContractWideRoyalties {
    string public baseURI;
    uint256 public circulatingSupply = 0;
    uint256 public startTime;
    bool public paused;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        uint256 _startTime
    ) ERC721(_name, _symbol) {
        baseURI = _baseUri;
        startTime = _startTime;
    }

    /// @inheritdoc	ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC2981Base)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// @notice Allows to set the royalties on the contract
    /// @dev This function in a real contract should be protected with a onlyOwner (or equivalent) modifier
    /// @param recipient the royalties recipient
    /// @param value royalties value (between 0 and 10000)
    function setRoyalties(address recipient, uint256 value) public {
        _setRoyalties(recipient, value);
    }

    function mint() external {
        require(block.timestamp >= startTime, "Minting has not start");
        require(paused == false, "Contract Paused");
        require(balanceOf(msg.sender) == 0, "You have already minted");
        _mint(msg.sender, circulatingSupply);
        circulatingSupply++;
    }

    function setPause(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI)
        external
        onlyOwner
    {
        _setTokenURI(tokenId, tokenURI);
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }
}
