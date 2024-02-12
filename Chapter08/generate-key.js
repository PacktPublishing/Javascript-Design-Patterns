// @ts-check
import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const { publicKey, privateKey } = await crypto.subtle.generateKey(
  {
    name: 'RSA-OAEP',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['encrypt', 'decrypt'],
);

const publicKeyExport = await crypto.subtle.exportKey('jwk', publicKey);
const privateKeyExport = await crypto.subtle.exportKey('jwk', privateKey);
fs.writeFile(
  'public-key.json',
  JSON.stringify(publicKeyExport, null, 2),
  'utf-8',
);
fs.writeFile(
  '_private-key.json',
  JSON.stringify(privateKeyExport, null, 2),
  'utf-8',
);
