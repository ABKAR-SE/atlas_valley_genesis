const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Atlas contracts', function () {
  it('mints rewards through AtlasCore', async function () {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('ARKVToken');
    const token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const Core = await ethers.getContractFactory('AtlasCore');
    const core = await Core.deploy(await token.getAddress(), owner.address);
    await core.waitForDeployment();

    await token.transferOwnership(await core.getAddress());
    await core.grantRewards(user.address, ethers.parseEther('10'), 'test');

    expect(await token.balanceOf(user.address)).to.equal(ethers.parseEther('10'));
  });
});
