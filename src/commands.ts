type PnpmCommand = {
  name: string;
  description: string;
  example: string;
};

export const commands: readonly PnpmCommand[] = [
  {
    name: 'pnpm install',
    description: '安装项目依赖。已有锁文件时，按锁定的版本安装。',
    example: 'pnpm install --frozen-lockfile',
  },
  {
    name: 'pnpm add',
    description: '添加运行时依赖，并更新 package.json 和锁文件。',
    example: 'pnpm add ink react',
  },
  {
    name: 'pnpm add -D',
    description: '添加开发依赖，例如编译器、类型定义或测试工具。',
    example: 'pnpm add -D typescript tsx',
  },
  {
    name: 'pnpm run',
    description: '执行 package.json 中 scripts 定义的脚本。',
    example: 'pnpm run typecheck',
  },
  {
    name: 'pnpm exec',
    description: '在项目环境中执行命令，可以直接使用依赖提供的可执行文件。',
    example: 'pnpm exec tsc --version',
  },
];
