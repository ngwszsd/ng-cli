#!/usr/bin/env bash
set -euo pipefail

repo=ngwszsd/ng-cli
cd "$(git rev-parse --show-toplevel)"
if [[ "$(uname -sm)" != "Darwin arm64" ]]; then
  echo '请在 Apple 芯片 Mac 上构建并测试本次发布的二进制。' >&2
  exit 1
fi
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
  echo '请先提交待发布的改动，再运行 pnpm release。' >&2
  exit 1
fi

git fetch origin --tags
tag="v$(node -p 'require("./package.json").version')"
if git show-ref --verify --quiet "refs/tags/$tag"; then
  if [[ "$(git rev-parse "$tag^{commit}")" != "$(git rev-parse HEAD)" ]]; then
    tag=$(pnpm version patch -m 'chore: 发布 %s')
  fi
else
  git tag "$tag"
fi

# 已发布的提交可重复执行。上次中断留下的草稿可继续上传。
state=$(gh release list --repo "$repo" --limit 100 --json tagName,isDraft --jq ".[] | select(.tagName == \"$tag\") | .isDraft")
if [[ "$state" == false ]]; then
  gh release view "$tag" --repo "$repo" --json url --jq .url
  exit 0
fi

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT
mkdir "$stage/source"
git archive "$tag" | tar -xf - -C "$stage/source"
(
  cd "$stage/source"
  pnpm install --frozen-lockfile
  pnpm test
)
archive="ng-cli-$tag-darwin-arm64.tar.gz"
COPYFILE_DISABLE=1 tar -czf "$stage/$archive" -C "$stage/source/release" ng-cli
(cd "$stage" && shasum -a 256 "$archive" > SHA256SUMS)
sed "s/@RELEASE_TAG@/$tag/g" "$stage/source/scripts/install.sh.in" > "$stage/install.sh"

git push --atomic origin HEAD "refs/tags/$tag"
if [[ "$state" != true ]]; then
  cat > "$stage/notes.md" <<'NOTES'
在 Apple 芯片 Mac 上安装或升级：

```bash
curl -fsSL https://github.com/ngwszsd/ng-cli/releases/latest/download/install.sh | bash
```

默认安装到 `~/.local/bin/ng-cli`。运行 `ng-cli` 打开交互界面，或运行 `ng-cli --list` 输出命令列表。

卸载已安装的 CLI 可以运行以下命令。如果安装时设置了 `NG_CLI_INSTALL_DIR`，卸载时请为 Bash 设置相同的目录。

```bash
curl -fsSL https://github.com/ngwszsd/ng-cli/releases/latest/download/uninstall.sh | bash
```
NOTES
  gh release create "$tag" --repo "$repo" --verify-tag --draft --title "ng-cli $tag" --notes-file "$stage/notes.md"
fi
gh release upload "$tag" --repo "$repo" --clobber "$stage/$archive" "$stage/SHA256SUMS" "$stage/install.sh" "$stage/source/scripts/uninstall.sh"
gh release edit "$tag" --repo "$repo" --draft=false
