#!/bin/bash
# Install local git hooks for Manic workspace

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "Installing git hooks for Manic workspace..."

# Pre-commit hook: format check
cat > "$HOOKS_DIR/pre-commit" << 'HOOK'
#!/bin/bash
# Pre-commit hook: ensure workspace integrity

set -e

echo "Running pre-commit checks..."

# Check if bun.lock exists (should be local only)
if git diff --cached --name-only | grep -q "^bun.lock$"; then
  echo "❌ Error: bun.lock should not be committed"
  echo "   (It's local-only, each repo has its own)"
  exit 1
fi

# Check if workspace directories are accidentally added
WORKSPACE_DIRS=("core" "bundler" "providers" "plugins" "create-manic" "tui" "docs" "demo" "example-starter" "example-chatbot")
for dir in "${WORKSPACE_DIRS[@]}"; do
  if git diff --cached --name-only | grep -q "^$dir/"; then
    echo "❌ Error: Workspace directory '$dir' staged"
    echo "   Each repo is independent; push from within its directory"
    exit 1
  fi
done

echo "✓ Pre-commit checks passed"
HOOK

chmod +x "$HOOKS_DIR/pre-commit"

echo "✓ Git hooks installed"
