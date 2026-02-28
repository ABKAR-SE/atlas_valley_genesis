import fs from 'fs';
import { ethers } from 'ethers';
import { env } from '../config/env.js';
import { coreArtifactPath, tokenArtifactPath } from '../config/paths.js';

const coreAbi = [
  'function setAvatarHash(address user, bytes32 metadataHash)',
  'function storeBiometricHash(address user, bytes32 biometricHash)',
  'function grantRewards(address user, uint256 amount, string reason)',
  'function totalRewards(address user) view returns(uint256)'
];
const tokenAbi = ['function balanceOf(address user) view returns(uint256)'];

const provider = new ethers.JsonRpcProvider(env.rpcUrl);
const signer = new ethers.Wallet(env.privateKey, provider);

async function deployIfMissing() {
  if (env.atlasCoreAddress && env.arkvTokenAddress) {
    return { coreAddress: env.atlasCoreAddress, tokenAddress: env.arkvTokenAddress };
  }
  if (!fs.existsSync(tokenArtifactPath) || !fs.existsSync(coreArtifactPath)) {
    return { coreAddress: '', tokenAddress: '' };
  }

  const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, 'utf8'));
  const coreArtifact = JSON.parse(fs.readFileSync(coreArtifactPath, 'utf8'));

  const tokenFactory = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, signer);
  const token = await tokenFactory.deploy(signer.address);
  await token.waitForDeployment();

  const coreFactory = new ethers.ContractFactory(coreArtifact.abi, coreArtifact.bytecode, signer);
  const core = await coreFactory.deploy(await token.getAddress(), signer.address);
  await core.waitForDeployment();

  await token.transferOwnership(await core.getAddress());
  return { coreAddress: await core.getAddress(), tokenAddress: await token.getAddress() };
}

export async function initBlockchain() {
  const addresses = await deployIfMissing();
  return {
    provider,
    signer,
    atlasCore: addresses.coreAddress
      ? new ethers.Contract(addresses.coreAddress, coreAbi, signer)
      : null,
    arkvToken: addresses.tokenAddress
      ? new ethers.Contract(addresses.tokenAddress, tokenAbi, provider)
      : null
  };
}

export const toHash = (payload) => ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(payload)));
export const toEth = (raw) => ethers.formatEther(raw);
