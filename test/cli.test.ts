import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';

const entry = fileURLToPath(new URL('../dist/cli.js', import.meta.url));

function run(...args: string[]) {
  return spawnSync(process.execPath, [entry, ...args], {encoding: 'utf8'});
}

test('帮助中包含命令用法', () => {
  const result = run('-h');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /用法：ng-cli/);
});

test('列表包含命令和示例，输出到管道时自动使用列表', () => {
  const list = run('--list');
  const piped = run();
  assert.equal(list.status, 0);
  assert.equal(piped.status, 0);
  assert.match(list.stdout, /pnpm add -D typescript tsx/);
  assert.equal(piped.stdout, list.stdout);
});

test('未知参数通过标准错误和非零退出码报告', () => {
  const result = run('--unknown');
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--unknown/);
  assert.equal(result.stdout, '');
});
