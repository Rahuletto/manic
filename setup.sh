#!/bin/bash
set -e

WORKSPACE_ROOT=$(pwd)
MANIC_ORG="manic-js"

echo "🚀 Setting up Manic workspace..."
echo ""

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
  "example-starter:example-starter"
  "example-chatbot:example-chatbot"
)

# Special case: demo from Rahuletto/manic (already cloned as submodule init, or skip if exists)
if [ ! -d "demo" ]; then
  echo "📦 Cloning demo (Rahuletto/manic)..."
  git clone https://github.com/Rahuletto/manic demo
fi

# Clone all other repos
for repo_pair in "${REPOS[@]}"; do
  IFS=':' read -r repo_name target_dir <<< "$repo_pair"
  
  if [ -d "$target_dir" ]; then
    echo "✓ $target_dir already exists, skipping"
    continue
  fi
  
  mkdir -p "$(dirname "$target_dir")"
  echo "📦 Cloning $MANIC_ORG/$repo_name → $target_dir"
  git clone "https://github.com/$MANIC_ORG/$repo_name.git" "$target_dir"
done

echo ""
echo "✅ All repos cloned successfully!"
echo ""
echo "Next steps:"
echo "  1. bun install       # Install and link workspaces"
echo "  2. bun run dev       # Start demo dev server"
echo ""
echo "For more info, see DEVELOPMENT.md"
