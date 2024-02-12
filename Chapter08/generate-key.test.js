// @ts-check
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';

const { default: publicKeyImport } = await import('./public-key.json', {
  assert: { type: 'json' },
});
const { default: privateKeyImport } = await import('./_private-key.json', {
  assert: { type: 'json' },
});

const publicKey = await crypto.subtle.importKey(
  'jwk',
  publicKeyImport,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['encrypt'],
);
const privateKey = await crypto.subtle.importKey(
  'jwk',
  privateKeyImport,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['decrypt'],
);

test('encrypts and decrypts', async () => {
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    new TextEncoder().encode('my-message'),
  );

  const originalText = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    ciphertext,
  );

  assert.equal(new TextDecoder().decode(originalText), 'my-message');
});

test('encrypt to a base64 ciphertext, then decode and decrypt', async () => {
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    new TextEncoder().encode('my-message'),
  );

  const base64Enc = Buffer.from(ciphertext).toString('base64');

  const originalTextBufferParse = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    Buffer.from(base64Enc, 'base64'),
  );

  assert.equal(new TextDecoder().decode(originalTextBufferParse), 'my-message');
});
