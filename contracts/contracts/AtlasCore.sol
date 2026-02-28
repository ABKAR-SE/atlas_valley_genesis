// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ARKVToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AtlasCore is Ownable {
    ARKVToken public immutable token;

    mapping(address => bytes32) public avatarMetadataHash;
    mapping(address => uint256) public totalRewards;
    mapping(address => bytes32[]) public biometricHashes;

    event AvatarUpdated(address indexed user, bytes32 metadataHash);
    event BiometricProofStored(address indexed user, bytes32 biometricHash);
    event RewardsGranted(address indexed user, uint256 amount, string reason);

    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        token = ARKVToken(tokenAddress);
    }

    function setAvatarHash(address user, bytes32 metadataHash) external onlyOwner {
        avatarMetadataHash[user] = metadataHash;
        emit AvatarUpdated(user, metadataHash);
    }

    function storeBiometricHash(address user, bytes32 biometricHash) external onlyOwner {
        biometricHashes[user].push(biometricHash);
        emit BiometricProofStored(user, biometricHash);
    }

    function grantRewards(address user, uint256 amount, string calldata reason) external onlyOwner {
        totalRewards[user] += amount;
        token.mint(user, amount);
        emit RewardsGranted(user, amount, reason);
    }
}
