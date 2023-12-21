'use strict';

import test, { describe } from 'node:test';
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const resolveFileRelativePath = (p = '.') =>
  path.join(new URL(import.meta.url).pathname, '..', p);

const allChapterSamples = readdirSync(resolveFileRelativePath(), {
  withFileTypes: true,
})
  .filter((f) => f.isDirectory)
  .map((f) => f.name);

const { positionals } = parseArgs({ allowPositionals: true });
const samplesToRun =
  positionals.length > 0
    ? allChapterSamples.filter((directory) =>
        positionals.some((p) => directory.includes(p)),
      )
    : allChapterSamples;

describe('Code Samples Runner', { concurrency: 4 }, () => {
  // turn console.assert errors into thrown errors
  global.console.assert = (...args) => {
    if (args[0] === false) {
      const err = new Error('Assertion failed');
      err.callArguments = args;
      throw err;
    }
  };

  for (const sample of allChapterSamples) {
    const sampleModulePath = `./${sample}/${sample}.js`;
    const resolvedSampleModulePath = resolveFileRelativePath(sampleModulePath);
    if (!existsSync(resolvedSampleModulePath)) {
      continue;
    }

    test(sample, { skip: !samplesToRun.includes(sample) }, async () => {
      await import(sampleModulePath);
    });
  }
});
