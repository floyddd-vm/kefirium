// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TestKefirium is ERC721, ERC721Pausable, AccessControl {
    bytes32 public constant WHITE_LIST_ROLE = keccak256("WHITE_LIST_ROLE");
    string public baseURI;

    constructor(string memory __baseURI, address _admin)
        ERC721("Test kefirium", "TKFRM")
    {
        baseURI = __baseURI;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(WHITE_LIST_ROLE, _admin);
    }

    //
    // Modifier
    //

    modifier isPaid {
        if(msg.value < 0.01 ether){
            revert("Mint costs 0.01 eth");
        }
        _;        
    }

    //
    // Public
    //

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }


    function safeMintPrivileged(address to, uint256 tokenId) external onlyRole(WHITE_LIST_ROLE) {
        _safeMint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId) external payable isPaid(){
        _safeMint(to, tokenId);
    }

    function mintPac(uint256[] calldata tokenId) external onlyRole(DEFAULT_ADMIN_ROLE){
        for(uint i = 0; i < tokenId.length; i++) {
            _safeMint(msg.sender, tokenId[i]);
        }
    }

    function withdrawETH() external onlyRole(DEFAULT_ADMIN_ROLE){
        payable(msg.sender).transfer(address(this).balance);
    }

    //
    // Internal
    //

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}