#!/usr/bin/env bash
set -euo pipefail

# Skip in environments without a git checkout (e.g. Vercel build sandbox).
if [ ! -d ".git" ]; then
  exit 0
fi

mkdir -p ".git/hooks"
cat > ".git/hooks/pre-commit" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
bash scripts/stage-submodule-pointers.sh
EOF

chmod +x ".git/hooks/pre-commit"
