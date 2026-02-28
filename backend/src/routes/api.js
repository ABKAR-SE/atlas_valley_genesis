import express from 'express';
import { ethers } from 'ethers';
import { auth, signAuthToken } from '../middleware/auth.js';
import { createNonce, encryptJson } from '../services/cryptoService.js';
import { storeMetadata } from '../services/ipfsService.js';
import { toEth, toHash } from '../services/blockchainService.js';

export function createApiRouter({ db, io, nonces, socketsByUser, atlasCore, arkvToken }) {
  const router = express.Router();

  router.get('/health', (_, res) => res.json({ ok: true }));

  router.post('/auth/nonce', (req, res) => {
    const { address } = req.body;
    if (!address) return res.status(400).json({ error: 'address required' });

    const nonce = createNonce();
    nonces.set(address.toLowerCase(), nonce);
    res.json({ nonce, message: `Atlas Valley login nonce: ${nonce}` });
  });

  router.post('/auth/verify', async (req, res) => {
    const { address, signature } = req.body;
    const nonce = nonces.get(address?.toLowerCase());
    if (!nonce) return res.status(400).json({ error: 'nonce not found' });

    const message = `Atlas Valley login nonce: ${nonce}`;
    const recovered = ethers.verifyMessage(message, signature);
    if (recovered.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'signature mismatch' });
    }

    if (!db.data.users[address]) {
      db.data.users[address] = { profile: null, biometrics: [], reputation: 0 };
    }
    await db.write();
    nonces.delete(address.toLowerCase());

    res.json({ token: signAuthToken(address) });
  });

  router.get('/profile', auth, (req, res) => {
    res.json(db.data.users[req.user.address] || {});
  });

  router.post('/avatar', auth, async (req, res) => {
    const metadata = {
      name: req.body.name,
      bio: req.body.bio,
      attributes: req.body.attributes,
      owner: req.user.address,
      updatedAt: new Date().toISOString()
    };

    const cid = await storeMetadata(metadata);
    const metadataHash = toHash(metadata);

    db.data.users[req.user.address].profile = { ...metadata, cid, metadataHash };
    db.data.activityFeed.unshift({ type: 'avatar', user: req.user.address, timestamp: Date.now() });
    await db.write();

    if (atlasCore) await atlasCore.setAvatarHash(req.user.address, metadataHash);
    io.emit('activity', { type: 'avatarUpdated', user: req.user.address, cid });

    res.json({ cid, metadataHash });
  });

  router.post('/biometrics', auth, async (req, res) => {
    const payload = {
      heartRate: req.body.heartRate,
      activityLevel: req.body.activityLevel,
      sleepHours: req.body.sleepHours,
      healthScore: req.body.healthScore,
      recordedAt: new Date().toISOString()
    };

    const biometricHash = toHash(payload);
    const encrypted = encryptJson(payload);
    db.data.users[req.user.address].biometrics.push({ encrypted, biometricHash, recordedAt: Date.now() });

    const reward = BigInt(Math.max(1, Number(payload.activityLevel || 1))) * 10n ** 18n;
    db.data.users[req.user.address].reputation += Number(payload.healthScore || 1);
    db.data.activityFeed.unshift({ type: 'biometric', user: req.user.address, timestamp: Date.now() });
    await db.write();

    if (atlasCore) {
      await atlasCore.storeBiometricHash(req.user.address, biometricHash);
      await atlasCore.grantRewards(req.user.address, reward, 'Biometric participation mining');
    }

    io.emit('activity', { type: 'biometricLogged', user: req.user.address, hash: biometricHash });
    res.json({ biometricHash, reward: reward.toString() });
  });

  router.get('/ecosystem', auth, async (_, res) => {
    const users = Object.entries(db.data.users).map(([address, user]) => ({
      address,
      reputation: user.reputation,
      avatar: user.profile?.name || 'Unnamed',
      online: socketsByUser.has(address.toLowerCase())
    }));

    const rewards = {};
    for (const address of Object.keys(db.data.users)) {
      rewards[address] = arkvToken ? toEth(await arkvToken.balanceOf(address)) : '0';
    }

    res.json({ users, tasks: db.data.tasks, feed: db.data.activityFeed.slice(0, 20), rewards });
  });

  router.get('/wallet/:address', async (req, res) => {
    if (!arkvToken || !atlasCore) return res.json({ balance: '0', totalRewards: '0' });

    const balance = await arkvToken.balanceOf(req.params.address);
    const totalRewards = await atlasCore.totalRewards(req.params.address);
    res.json({ balance: toEth(balance), totalRewards: toEth(totalRewards) });
  });

  return router;
}
