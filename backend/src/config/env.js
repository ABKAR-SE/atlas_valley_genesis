import 'dotenv/config';

export const env = {
  port: Number(process.env.BACKEND_PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  encryptionKey: process.env.DATA_ENCRYPTION_KEY || 'dev-key',
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8545',
  privateKey:
    process.env.PRIVATE_KEY ||
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  atlasCoreAddress: process.env.ATLAS_CORE_ADDRESS || '',
  arkvTokenAddress: process.env.ARKV_TOKEN_ADDRESS || ''
};
