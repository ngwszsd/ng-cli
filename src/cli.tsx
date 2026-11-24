#!/usr/bin/env node
import {parseArgs} from 'node:util';
import {commands} from './commands.js';

const help = [
  '用法：ng-cli [--list | --help]',
  '',
  '默认打开 pnpm 命令速查。用 ↑ 和 ↓ 选择命令，按 q 或 Esc 退出。',
  '  --list      输出所有命令和示例，适合管道和脚本',
  '  -h, --help  查看帮助',
].join('\n');

async function main() {
  const {values} = parseArgs({
    options: {
      list: {type: 'boolean'},
      help: {type: 'boolean', short: 'h'},
    },
  });

  if (values.help) {
    console.log(help);
    return;
  }

  if (values.list || !process.stdin.isTTY || !process.stdout.isTTY) {
    for (const command of commands) {
      console.log(`${command.name}\n  ${command.description}\n  $ ${command.example}`);
    }
    return;
  }

  const {render} = await import('ink');
  const {App} = await import('./App.js');
  await render(<App />).waitUntilExit();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
