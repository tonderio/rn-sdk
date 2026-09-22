import { readFileSync } from 'fs';
import { join } from 'path';

// Guards the CI workflow against the misconfiguration classes Datadog Code
// Security flags on GitHub Actions: an unscoped GITHUB_TOKEN, unbounded
// concurrent runs, anonymous jobs, and workflow expressions interpolated
// straight into a shell.
const WORKFLOW = readFileSync(
  join(__dirname, '..', '.github', 'workflows', 'ci.yml'),
  'utf8'
);
const LINES = WORKFLOW.split('\n');

const JOB_INDENT = '  ';
const PROPERTY_INDENT = '    ';

function jobStartIndexes(): number[] {
  const jobsIndex = LINES.indexOf('jobs:');
  const starts: number[] = [];
  for (let i = jobsIndex + 1; i < LINES.length; i += 1) {
    if (/^\S/.test(LINES[i]!)) break;
    if (new RegExp(`^${JOB_INDENT}[\\w-]+:\\s*$`).test(LINES[i]!)) {
      starts.push(i);
    }
  }
  return starts;
}

function jobs(): { id: string; body: string[] }[] {
  const starts = jobStartIndexes();
  return starts.map((start, position) => {
    const end = starts[position + 1] ?? LINES.length;
    return {
      id: LINES[start]!.trim().replace(/:$/, ''),
      body: LINES.slice(start + 1, end),
    };
  });
}

function runBlocks(): string[] {
  const blocks: string[] = [];
  for (let i = 0; i < LINES.length; i += 1) {
    const match = /^(\s+)run:[ ]?(.*)$/.exec(LINES[i]!);
    if (!match) continue;
    const [, indent, inline] = match as unknown as [string, string, string];
    if (!/^[|>]/.test(inline)) {
      blocks.push(inline);
      continue;
    }
    const body: string[] = [];
    for (let j = i + 1; j < LINES.length; j += 1) {
      const line = LINES[j]!;
      if (line.trim() !== '' && !line.startsWith(`${indent} `)) break;
      body.push(line);
    }
    blocks.push(body.join('\n'));
  }
  return blocks;
}

describe('CI workflow hardening', () => {
  it('declares workflow level permissions for GITHUB_TOKEN', () => {
    expect(WORKFLOW).toMatch(/^permissions:\n {2}contents: read$/m);
  });

  it('parses at least the five known jobs', () => {
    expect(jobs().map((job) => job.id)).toEqual([
      'lint',
      'test',
      'build-library',
      'build-android',
      'build-ios',
    ]);
  });

  it.each(jobs())('names job $id', ({ body }) => {
    expect(
      body.some((line) => line.startsWith(`${PROPERTY_INDENT}name:`))
    ).toBe(true);
  });

  it.each(jobs())('bounds concurrency for job $id', ({ body }) => {
    expect(
      body.some((line) => line.startsWith(`${PROPERTY_INDENT}concurrency:`))
    ).toBe(true);
  });

  it('keeps workflow expressions out of every run block', () => {
    const injectable = runBlocks().filter((block) => block.includes('${{'));
    expect(injectable).toEqual([]);
  });
});
