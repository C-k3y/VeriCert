// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/ICertificate.sol";
import "./structs/CertificateStruct.sol";
import "./libraries/Errors.sol";
import "./libraries/Events.sol";

contract CertificateNFT is ERC721, ICertificate {
    address public owner;

    mapping (uint256 => Certificate) private _certificates;
    mapping (string => uint256) public certificateIDs; //certId string => tokenId

    modifier onlyOwner () {
        if(msg.sender != owner) revert Errors.NotOwner();
        _;
    }

    constructor() ERC721("VeriCert", "VCRT") {
        owner = msg.sender;
    }

    // --Soulbound: Block all transfers--
    function transferFrom(address, address, uint256) public pure override {
        revert Errors.TransferNotAllowed();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert Errors.TransferNotAllowed();
    }

    // --Issue--
    function issueCertificate(
        uint256 tokenId,
        uint256 certificateId,
        string memory studentName,
        string memory registrationNumber,
        string memory courseName,
        string memory degree,
        string memory ipfsCID,
        bytes32 pdfHash,
        uint256 issueDate
    ) external onlyOwner{
        if(_certificates[tokenId].issueDate != 0)
            revert Errors.DuplicateCertificate(tokenId);
        
        _mint(owner, tokenId); // Mint NFT to institution (soulbound — no receiver check needed)

        _certificates[tokenId] = Certificate({
            tokenId: tokenId,
            certificateId: certificateId,
            studentName: studentName,
            registrationNumber: registrationNumber,
            courseName: courseName,
            degree: degree,
            ipfsCID: ipfsCID,
            pdfHash: pdfHash,
            revoked: false,
            issueDate: issueDate
        });

        emit Events.CertificateIssued(tokenId, certificateId, studentName, issueDate);
    }

    // --Verify--

    function verifyCertificate(uint256 tokenId) external view returns (bool) {
        if(_certificates[tokenId].issueDate == 0)
           revert Errors.CertificateNotFound(tokenId);
        return !_certificates[tokenId].revoked;
    }

    //--Revoke--
    function revokeCertificate(uint256 tokenId) external onlyOwner{
        if(_certificates[tokenId].issueDate == 0)
           revert Errors.CertificateNotFound(tokenId);
        if(_certificates[tokenId].revoked)
           revert Errors.CertificateAlreadyRevoked(tokenId);

        _certificates[tokenId].revoked = true;
        emit Events.CertificateRevoked(tokenId, _certificates[tokenId].certificateId);
    }

    // Amend (Immutable history pattern)

    // Revoke old certificate; caller then issues a new one
    function amendCertificate(uint256 oldTokenId) external onlyOwner{
        if(_certificates[oldTokenId].issueDate == 0)
           revert Errors.CertificateNotFound(oldTokenId);

        _certificates[oldTokenId].revoked = true;
        emit Events.CertificateRevoked(oldTokenId, _certificates[oldTokenId].certificateId);
        emit Events.CertificateAmended(oldTokenId);
    }

    // --Get--
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        if(_certificates[tokenId].issueDate == 0)
           revert Errors.CertificateNotFound(tokenId);
        return _certificates[tokenId];
    }
}