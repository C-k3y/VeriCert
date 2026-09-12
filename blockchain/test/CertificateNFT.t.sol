//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CertificateNFT.sol";
import "../src/libraries/Errors.sol";

contract CertificateNFTTest is Test{ 
    CertificateNFT cert;
    address owner = address(this);
    address stranger = address(0xBEEF);

    function setUp() public {
        cert = new CertificateNFT();
    }

    // ---Helpers---

    function _issue(uint256 tokenId) internal {
        cert.issueCertificate(
            tokenId, 1001,
            "Alice Chong", "REG-2024-001",
            "Computer Science", "Bsc",
            "QmXyzAbc123", keccak256("pdf-content"),
            block.timestamp
        );
    }

    // ---Tests---

    function test_issueCertificate() public {
        _issue(1);
        assertTrue(cert.verifyCertificate(1));
    }

    function test_DuplicateCertificateReverts() public {
        _issue(1);
        vm.expectRevert(abi.encodeWithSelector(Errors.DuplicateCertificate.selector, 1));
        _issue(1);
    }

    function test_OnlyOwnerCanIssue() public {
        vm.prank(stranger);
        vm.expectRevert(Errors.NotOwner.selector);
        _issue(1);
    }

    function test_RevokeCertificate() public {
        _issue(1);
        cert.revokeCertificate(1);
        assertFalse(cert.verifyCertificate(1));
    }

    function test_RevokeNonExistentReverts () public {
        vm.expectRevert(abi.encodeWithSelector(Errors.CertificateNotFound.selector, 99));
        cert.revokeCertificate(99);
    }

    function test_GetCertificate () public {
        _issue(1);
        vm.expectRevert(Errors.TransferNotAllowed.selector);
        cert.transferFrom(owner, stranger, 1);
        
    }
}