#!/bin/bash
# Install local git hooks for Manic workspace

REPO_ROOT=$(git rev-parse --show-toplevel)
HOOKS_DIR="$REPO_ROOT/.git/hooks"
GITHOOKS_DIR="$REPO_ROOT/.githooks"

echo "Installing git hooks for Manic workspace..."

# Configure git to use .githooks directory
git config core.hooksPath .githooks

# Pre-commit hook: auto-format and validate
cat > "$HOOKS_DIR/pre-commit" << 'HOOK'
#!/bin/bash
# Pre-commit hook: auto-format code and ensure workspace integrity

set -e

echo "🔄 Running pre-commit formatting & checks..."

REPO_ROOT=$(git rev-parse --show-toplevel)

# Get staged files
STAGED_FILES=$(git diff --cached --name-only)

# Format staged files with oxfmt
if echo "$STAGED_FILES" | grep -E '\.(ts|tsx|js|jsx|json)$' > /dev/null; then
  echo "📝 Auto-formatting staged files..."
  
  # Format files
  FORMATTED_FILES=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx|js|jsx|json)$' | grep -v node_modules | tr '\n' ' ')
  if [ -n "$FORMATTED_FILES" ] && [ -f "$REPO_ROOT/.oxfmt.json" ]; then
    bunx oxfmt --config "$REPO_ROOT/.oxfmt.json" $FORMATTED_FILES 2>/dev/null || true
    
    # Re-stage formatted files
    echo "$STAGED_FILES" | grep -E '\.(ts|tsx|js|jsx|json)$' | grep -v node_modules | xargs git add 2>/dev/null || true
  fi
fi

echo "✓ Workspace integrity checks..."

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

echo "✅ Pre-commit checks passed"
HOOK

chmod +x "$HOOKS_DIR/pre-commit"

# Post-checkout hook: format workspace files after checkout/merge
cat > "$HOOKS_DIR/post-checkout" << 'HOOK'
#!/bin/bash
# Post-checkout hook: auto-format after checkout/merge

REPO_ROOT=$(git rev-parse --show-toplevel)

# Only format on branch changes, not every file checkout
if [ "$3" = "1" ]; then
  echo "🔄 Auto-formatting workspace files after checkout..."
  
  if [ -f "$REPO_ROOT/.oxfmt.json" ]; then
    # Format root config/script files
    bunx oxfmt --config "$REPO_ROOT/.oxfmt.json" \
      "$REPO_ROOT"/.oxlintrc.json \
      "$REPO_ROOT"/.oxfmt.json \
      "$REPO_ROOT"/.gitignore 2>/dev/null || true
    
    echo "✓ Formatting complete"
  fi
fi
HOOK

chmod +x "$HOOKS_DIR/post-checkout"

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
