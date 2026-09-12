// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../structs/CertificateStruct.sol";

interface ICertificate {
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
    ) external;

    function verifyCertificate(uint256 tokenId) external view returns (bool);
    function revokeCertificate(uint256 tokenId) external;
    function getCertificate(uint256 tokenId) external view returns (Certificate memory);
}