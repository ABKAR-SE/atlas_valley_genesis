import crypto from 'crypto';
import { env } from '../config/env.js';

const key = crypto.createHash('sha256').update(env.encryptionKey).digest();

export function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function createNonce() {
  return crypto.randomBytes(12).toString('hex');
}
