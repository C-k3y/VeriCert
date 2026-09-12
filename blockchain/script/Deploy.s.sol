// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.20;

import "forge-std/Script.sol";
import "../src/CertificateNFT.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        CertificateNFT cert = new CertificateNFT();
        console.log("CertificateNFT Deployed At:", address(cert));

        vm.stopBroadcast();
    }
}