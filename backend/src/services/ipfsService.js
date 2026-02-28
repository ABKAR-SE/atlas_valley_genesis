import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { rootDir } from '../config/paths.js';

const ipfsDataDir = path.join(rootDir, 'backend/data/ipfs');

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export async function storeMetadata(metadata) {
  if (!fs.existsSync(ipfsDataDir)) fs.mkdirSync(ipfsDataDir, { recursive: true });

  const canonical = stableStringify(metadata);
  const hash = crypto.createHash('sha256').update(canonical).digest('hex');
  const cid = `ipfs-sim-${hash.slice(0, 46)}`;

  const outputPath = path.join(ipfsDataDir, `${cid}.json`);
  fs.writeFileSync(outputPath, JSON.stringify({ cid, metadata }, null, 2));

  return cid;
}
