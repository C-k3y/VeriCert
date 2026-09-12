// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Errors {
    error NotOwner();
    error CertificateNotFound(uint256 tokenId);
    error CertificateAlreadyRevoked(uint256 tokenId);
    error DuplicateCertificate(uint256 tokenId);
    error TransferNotAllowed(); // For soulbound enforcement
}