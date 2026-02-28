const fs = require('fs');
const path = require('path');
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const Token = await ethers.getContractFactory('ARKVToken');
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();

  const Core = await ethers.getContractFactory('AtlasCore');
  const core = await Core.deploy(await token.getAddress(), deployer.address);
  await core.waitForDeployment();

  await token.transferOwnership(await core.getAddress());

  const addresses = {
    ARKV_TOKEN_ADDRESS: await token.getAddress(),
    ATLAS_CORE_ADDRESS: await core.getAddress()
  };

  console.log('Deployed:', addresses);

  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    for (const [key, value] of Object.entries(addresses)) {
      const re = new RegExp(`^${key}=.*$`, 'm');
      if (re.test(env)) env = env.replace(re, `${key}=${value}`);
      else env += `\n${key}=${value}`;

      const viteKey = `VITE_${key}`;
      const viteRe = new RegExp(`^${viteKey}=.*$`, 'm');
      if (viteRe.test(env)) env = env.replace(viteRe, `${viteKey}=${value}`);
      else env += `\n${viteKey}=${value}`;
    }
    fs.writeFileSync(envPath, env);
    console.log('.env updated with contract addresses');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
