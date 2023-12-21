// @ts-check
import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import FetchAdapter from '@pollyjs/adapter-fetch';

export const captureError = (cb) => {
  try {
    cb();
  } catch (e) {
    return e;
  }
};

/**
 * @param {string} recordingName
 * @param {Function | ((...args: any[]) => Promise<any>)} functionToRun
 * @param {Partial<import('@pollyjs/core').PollyConfig>} pollyArgs
 * @returns {Promise<any>}
 */
export async function runWithHttpRecording(
  recordingName,
  functionToRun = () => {},
  pollyArgs = {},
) {
  const polly = new Polly(recordingName, {
    adapters: [FetchAdapter],
    persister: FSPersister,
    logLevel: 'error',
    ...pollyArgs,
  });
  try {
    const output = await functionToRun();
    return output;
  } catch (e) {
    console.error('runWithHttpRecording Error', e);
  } finally {
    await polly.stop();
  }
}
