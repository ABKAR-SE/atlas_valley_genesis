import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, '../../..');
export const dbPath = path.join(rootDir, 'backend/data/db.json');
export const tokenArtifactPath = path.join(
  rootDir,
  'contracts/artifacts/contracts/ARKVToken.sol/ARKVToken.json'
);
export const coreArtifactPath = path.join(
  rootDir,
  'contracts/artifacts/contracts/AtlasCore.sol/AtlasCore.json'
);
