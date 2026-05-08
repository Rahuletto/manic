#!/usr/bin/env bash
set -euo pipefail

# Stage all tracked submodule gitlinks so pointer bumps are not missed in commits.
while IFS= read -r path; do
  if [ -n "$path" ]; then
    git add "$path"
  fi
done < <(git config --file .gitmodules --get-regexp path | awk '{print $2}')
