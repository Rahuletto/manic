#!/bin/bash
# Install local git hooks for Manic workspace

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$REPO_ROOT/.git/hooks"
GITHOOKS_DIR="$REPO_ROOT/.githooks"

echo "Installing git hooks for Manic workspace..."

# Configure git to use .githooks directory
git config core.hooksPath .githooks

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
WORKSPACE_DIRS=("core" "bundler" "providers" "plugins" "create-manic" "tui" "docs" "example-starter" "example-chatbot")
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

# Install hook symlinks from .githooks if directory exists
if [ -d "$GITHOOKS_DIR" ]; then
  for hook in "$GITHOOKS_DIR"/*; do
    hook_name=$(basename "$hook")
    if [ -f "$hook" ]; then
      cp "$hook" "$HOOKS_DIR/$hook_name"
      chmod +x "$HOOKS_DIR/$hook_name"
      echo "✓ Installed hook: $hook_name"
    fi
  done
fi

echo "✓ All git hooks installed and configured"
