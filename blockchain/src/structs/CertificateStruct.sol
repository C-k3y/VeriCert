// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Certificate{
    uint256 tokenId;
    uint256 certificateId;
    string studentName;
    string registrationNumber;
    string courseName;
    string degree;
    string ipfsCID;
    bytes32 pdfHash;
    bool revoked;
    uint256 issueDate;
}