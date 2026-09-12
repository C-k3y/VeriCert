// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Events {
    event CertificateIssued(
        uint256 indexed tokenId,
        uint256 indexed certificateId,
        string studentName,
        uint256 issueDate
    );

    event CertificateRevoked(
        uint256 indexed tokenId,
        uint256 indexed certificateId
    );

    event CertificateAmended(uint256 indexed tokenId);
}