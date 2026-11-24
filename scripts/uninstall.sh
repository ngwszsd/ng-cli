#!/usr/bin/env bash
set -euo pipefail

uninstall_cli() {
  local install_dir=${NG_CLI_INSTALL_DIR:-"$HOME/.local/bin"}
  rm -f -- "$install_dir/ng-cli"
  printf '卸载完成：%s/ng-cli\n' "$install_dir"
}

uninstall_cli
