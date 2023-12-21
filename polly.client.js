// @ts-check
import { Polly } from '@pollyjs/core';
import FetchAdapter from '@pollyjs/adapter-fetch';
import RESTPersister from '@pollyjs/persister-rest';

/** @type {import('@pollyjs/core').Polly | undefined | null} */
let polly;

/**
 * @param {string} recordingName
 * @param {'RESET' | 'STOP'} [ACTION]
 */
export function resetClientSidePolly(recordingName, ACTION = 'RESET') {
  if (polly) {
    polly.stop();
  }
  if (ACTION === 'STOP') {
    polly = null;
    return;
  }
  polly = new Polly(recordingName, {
    adapters: [FetchAdapter],
    persister: RESTPersister,
  });
  return polly;
}
