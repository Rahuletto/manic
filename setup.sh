#!/bin/bash
set -e

WORKSPACE_ROOT=$(pwd)
MANIC_ORG="manic-js"

# Detect protocol (SSH vs HTTPS) from current git config
GIT_PROTO="https"
if git config --get url."git@github.com:".insteadof > /dev/null 2>&1; then
  GIT_PROTO="ssh"
fi

# Build base URL
if [ "$GIT_PROTO" = "ssh" ]; then
  BASE_URL="git@github.com:"
else
  BASE_URL="https://github.com/"
fi

echo "🚀 Setting up Manic workspace..."
echo "   Using protocol: $GIT_PROTO"
echo ""

# Migrate legacy top-level example clones into examples/*
if [ -d example-starter ] && [ ! -d examples/starter ]; then
  echo "📦 Moving example-starter → examples/starter"
  mkdir -p examples
  mv example-starter examples/starter
fi
if [ -d example-chatbot ] && [ ! -d examples/chatbot ]; then
  echo "📦 Moving example-chatbot → examples/chatbot"
  mkdir -p examples
  mv example-chatbot examples/chatbot
fi

# Clone all repos from manic-js organization
REPOS=(
  "core:core"
  "bundler:bundler"
  "providers:providers"
  "create-manic:create-manic"
  "tui:tui"
  "plugin-tailwind:plugins/tailwind"
  "plugin-unocss:plugins/unocss"
  "plugin-mdx:plugins/mdx"
  "plugin-mcp:plugins/mcp"
  "plugin-seo:plugins/seo"
  "plugin-sitemap:plugins/sitemap"
  "plugin-api-docs:plugins/api-docs"
  "docs:docs"
  "example-starter:examples/starter"
  "example-chatbot:examples/chatbot"
)

# Clone all repos
for repo_pair in "${REPOS[@]}"; do
  IFS=':' read -r repo_name target_dir <<< "$repo_pair"
  
  if [ -d "$target_dir" ]; then
    echo "✓ $target_dir already exists, skipping"
    continue
  fi
  
  mkdir -p "$(dirname "$target_dir")"
  
  # Build repo URL
  if [ "$GIT_PROTO" = "ssh" ]; then
    REPO_URL="${BASE_URL}${MANIC_ORG}/${repo_name}.git"
  else
    REPO_URL="${BASE_URL}${MANIC_ORG}/${repo_name}.git"
  fi
  
  echo "📦 Cloning $MANIC_ORG/$repo_name → $target_dir"
  git clone "$REPO_URL" "$target_dir"
done

echo ""
echo "✅ All repos cloned successfully!"
echo ""
echo "Demo app is included in Rahuletto/manic (this repository)"
echo "It's not cloned separately since it's the workspace root."
echo ""
echo "The docs/ clone is for local use only — source of truth is manic-js/docs (own repo & Vercel)."
echo ""
echo "Next steps:"
echo "  1. bun install       # Install and link workspaces"
echo "  2. bun run dev       # Start demo dev server"
echo ""
echo "For more info, see DEVELOPMENT.md"
