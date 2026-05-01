---
title: Verify docs against packages plugins
author: marban
threadId: T-019dae2e-2650-772d-b54f-9ff0ee1add04
created: 2026-04-21T03:55:53.916Z
agentMode: smart
---

# Verify docs against packages plugins

## User

<attached_files>

</attached_files>

go check @docs/content and verify with @packages and @plugins and see. if the package or plugin dont have something that docs mentioned, lets try to implement it, if its not feasible, edit the docs. go plugin by plugin section by section okay? think hard

## Assistant

Let me start by exploring the docs content and the actual packages/plugins to do a thorough audit.

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages"
}
```

## User

**Tool Result:** `toolu_vrtx_01VmrKew3XfYndPMVs7N62n3`

```
{
  "content": "docs/\n.DS_Store",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content",
  "directoryEntries": [
    "docs/",
    ".DS_Store"
  ]
}
```

**Tool Result:** `toolu_vrtx_01U7UC3EyEDBTGnhkoWHqDr2`

```
{
  "content": "api-docs/\nmcp/\nmdx/\nseo/\nsitemap/\ntailwind/\nunocss/\n.DS_Store",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins",
  "directoryEntries": [
    "api-docs/",
    "mcp/",
    "mdx/",
    "seo/",
    "sitemap/",
    "tailwind/",
    "unocss/",
    ".DS_Store"
  ]
}
```

**Tool Result:** `toolu_vrtx_01ET7H59wxAPcoXHAXuFyUWY`

```
{
  "content": "create-manic/\nmanic/\nproviders/\n.DS_Store",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages",
  "directoryEntries": [
    "create-manic/",
    "manic/",
    "providers/",
    ".DS_Store"
  ]
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs"
}
```

## User

**Tool Result:** `toolu_vrtx_018NcmTLbRhX9aF5duFEVHiY`

```
{
  "content": "api/\ncli/\ncore/\nframework/\n.DS_Store\nmeta.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs",
  "directoryEntries": [
    "api/",
    "cli/",
    "core/",
    "framework/",
    ".DS_Store",
    "meta.json"
  ]
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/api"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/cli"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/core"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework"
}
```

## User

**Tool Result:** `toolu_vrtx_01EZojCSXafppW9CXLeBGM84`

```
{
  "content": "client.mdx\nconfig.mdx\nenv.mdx\nerror-handling.mdx\nindex.mdx\nlink.mdx\nmeta.json\nnavigate.mdx\nplugins.mdx\nrouter.mdx\nrpc-client.mdx\nserver.mdx\ntheme.mdx\nuse-query-params.mdx\nuse-router.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/api",
  "directoryEntries": [
    "client.mdx",
    "config.mdx",
    "env.mdx",
    "error-handling.mdx",
    "index.mdx",
    "link.mdx",
    "meta.json",
    "navigate.mdx",
    "plugins.mdx",
    "router.mdx",
    "rpc-client.mdx",
    "server.mdx",
    "theme.mdx",
    "use-query-params.mdx",
    "use-router.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_01229Va5zPQGEGsTxkWNdjva`

```
{
  "content": "build.mdx\ndev.mdx\nindex.mdx\nlint-fmt.mdx\nmeta.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/cli",
  "directoryEntries": [
    "build.mdx",
    "dev.mdx",
    "index.mdx",
    "lint-fmt.mdx",
    "meta.json"
  ]
}
```

**Tool Result:** `toolu_vrtx_01DFXhQYGfNsaHhQx3PMbEyh`

```
{
  "content": "architecture.mdx\nbuild-pipeline.mdx\ndiscovery-engine.mdx\nindex.mdx\nmeta.json\noxc-toolchain.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/core",
  "directoryEntries": [
    "architecture.mdx",
    "build-pipeline.mdx",
    "discovery-engine.mdx",
    "index.mdx",
    "meta.json",
    "oxc-toolchain.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_01C5hhZzT5SFZiqwXnwSfWyW`

```
{
  "content": "advanced/\ndeployment/\nforms/\nplugins/\nrouting/\nserver/\ntroubleshooting/\nbenchmarks.mdx\ngetting-started.mdx\nindex.mdx\nmeta.json\nproject-structure.mdx\nquick-start.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework",
  "directoryEntries": [
    "advanced/",
    "deployment/",
    "forms/",
    "plugins/",
    "routing/",
    "server/",
    "troubleshooting/",
    "benchmarks.mdx",
    "getting-started.mdx",
    "index.mdx",
    "meta.json",
    "project-structure.mdx",
    "quick-start.mdx"
  ]
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/advanced"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/deployment"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/forms"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/routing"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/server"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/troubleshooting"
}
```

## User

**Tool Result:** `toolu_vrtx_01CzxT5X78LAEJ4JKuc4xvmP`

```
{
  "content": "api-docs.mdx\nindex.mdx\nmcp.mdx\nmdx.mdx\nmeta.json\nseo.mdx\nsitemap.mdx\ntailwind.mdx\nunocss.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins",
  "directoryEntries": [
    "api-docs.mdx",
    "index.mdx",
    "mcp.mdx",
    "mdx.mdx",
    "meta.json",
    "seo.mdx",
    "sitemap.mdx",
    "tailwind.mdx",
    "unocss.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_01VmCN6PrRDFa1x8VwpFYtXC`

```
{
  "content": "build-optimization.mdx\nenvironment-variables.mdx\nerror-handling.mdx\nexamples.mdx\nindex.mdx\nmanic-internals.mdx\nmeta.json\nplugin-development.mdx\nplugins.mdx\nstate-management.mdx\ntesting.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/advanced",
  "directoryEntries": [
    "build-optimization.mdx",
    "environment-variables.mdx",
    "error-handling.mdx",
    "examples.mdx",
    "index.mdx",
    "manic-internals.mdx",
    "meta.json",
    "plugin-development.mdx",
    "plugins.mdx",
    "state-management.mdx",
    "testing.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_01GkYZGDDXtcn7EhBvHe8pzH`

```
{
  "content": "cloudflare.mdx\nindex.mdx\nmeta.json\nself-hosting.mdx\nvercel.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/deployment",
  "directoryEntries": [
    "cloudflare.mdx",
    "index.mdx",
    "meta.json",
    "self-hosting.mdx",
    "vercel.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_012kv2yS1J9KWAaL82b5jbAy`

```
{
  "content": "authentication.mdx\nindex.mdx\nmeta.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/forms",
  "directoryEntries": [
    "authentication.mdx",
    "index.mdx",
    "meta.json"
  ]
}
```

**Tool Result:** `toolu_vrtx_01N7tYTKhLfWjmU4xrkPTmRj`

```
{
  "content": "dynamic-routes.mdx\nindex.mdx\nmeta.json\nview-transitions.mdx",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/routing",
  "directoryEntries": [
    "dynamic-routes.mdx",
    "index.mdx",
    "meta.json",
    "view-transitions.mdx"
  ]
}
```

**Tool Result:** `toolu_vrtx_01B9KpEDJw6PKVbpxpWZshpv`

```
{
  "content": "data-fetching.mdx\nindex.mdx\nmeta.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/server",
  "directoryEntries": [
    "data-fetching.mdx",
    "index.mdx",
    "meta.json"
  ]
}
```

**Tool Result:** `toolu_vrtx_01NrpAeMbgj5i4JRCTuapMpi`

```
{
  "content": "build-errors.mdx\ndeployment-errors.mdx\nindex.mdx\nmeta.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/troubleshooting",
  "directoryEntries": [
    "build-errors.mdx",
    "deployment-errors.mdx",
    "index.mdx",
    "meta.json"
  ]
}
```

## Assistant

Now let me read all the plugin docs and actual plugin implementations. I'll start with the plugin docs and source files in parallel:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/tailwind.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/unocss.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mdx.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/seo.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/sitemap.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mcp.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/api-docs.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/index.mdx"
}
```

## User

**Tool Result:** `toolu_vrtx_012huZBYT5h6G16LTtUSHdTo`

```
{
  "content": "1: ---\n2: title: Tailwind CSS\n3: description: Tailwind CSS v4 integration for Manic.\n4: ---\n5: \n6: # Tailwind CSS\n7: \n8: Integrates Tailwind CSS v4 with zero configuration. Uses `bun-plugin-tailwind` under the hood.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/tailwind\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/tailwind\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { tailwind } from '@manicjs/tailwind';\n30: \n31: export default defineConfig({\n32:   plugins: [tailwind()],\n33: });\n34: ```\n35: \n36: ### 3. Add CSS\n37: \n38: ```css\n39: /* app/app.css */\n40: @import \"tailwindcss\";\n41: ```\n42: \n43: That's it! Tailwind is now integrated.\n44: \n45: ## Options\n46: \n47: <TypeTable\n48:   type={{\n49:     content: {\n50:       type: 'string | string[]',\n51:       default: '[\"app/**/*.tsx\", \"app/**/*.css\"]',\n52:       description: 'Files to scan for classes',\n53:     },\n54:     darkMode: {\n55:       type: \"'selector' | 'class'\",\n56:       default: \"'selector'\",\n57:       description: 'How to enable dark mode',\n58:     },\n59:     safelist: {\n60:       type: 'string[]',\n61:       description: 'Classes to always include',\n62:     },\n63:   }}\n64: />\n65: \n66: ## Example Configuration\n67: \n68: ```ts\n69: import { defineConfig } from 'manicjs/config';\n70: import { tailwind } from '@manicjs/tailwind';\n71: \n72: export default defineConfig({\n73:   plugins: [\n74:     tailwind({\n75:       content: ['app/**/*.{tsx,css}'],\n76:       darkMode: 'selector',\n77:       safelist: ['bg-primary', 'text-primary'],\n78:     }),\n79:   ],\n80: });\n81: ```\n82: \n83: ## Dark Mode\n84: \n85: This plugin uses Tailwind's selector-based dark mode:\n86: \n87: ```css\n88: /* app/app.css */\n89: @import \"tailwindcss\";\n90: \n91: @custom-variant dark (&:where(.dark, .dark *));\n92: ```\n93: \n94: Then set the `dark` class on your root element:\n95: \n96: ```tsx\n97: import { useTheme } from 'manicjs';\n98: \n99: export default function App() {\n100:   const { isDark } = useTheme();\n101:   \n102:   return (\n103:     <html className={isDark ? 'dark' : ''}>\n104:       {/* Your app */}\n105:     </html>\n106:   );\n107: }\n108: ```\n109: \n110: ## Using with Theme\n111: \n112: The plugin works with Manic's theme system:\n113: \n114: ```tsx\n115: function MyComponent() {\n116:   const { isDark } = useTheme();\n117:   \n118:   return (\n119:     <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>\n120:       Content\n121:     </div>\n122:   );\n123: }\n124: ```\n125: \n126: ## CSS Functions\n127: \n128: All Tailwind CSS v4 functions are supported:\n129: \n130: ```css\n131: /* theme() */\n132: color: theme('colors.primary');\n133: \n134: /* layers */\n135: @layer utilities {\n136:   .my-utility {\n137:     /* custom styles */\n138:   }\n139: }\n140: \n141: /* apply */\n142: @apply flex gap-4;\n143: ```\n144: \n145: ## JIT Mode\n146: \n147: Always-on Just-In-Time compilation is enabled by default:\n148: \n149: ```css\n150: /* These classes are generated on-demand */\n151: .flex { display: flex; }\n152: .grid { display: grid; }\n153: .shadow-lg { --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }\n154: ```\n155: \n156: ## See Also\n157: \n158: - [Theme API](/docs/api/theme) - Dark mode integration\n159: - [UnoCSS](/docs/framework/unocss) - Alternative styling plugin\n160: - [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/upgrade-guide)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/tailwind.mdx"
}
```

**Tool Result:** `toolu_vrtx_014zSdoLGNcCBNZa1RF94b8q`

```
{
  "content": "1: ---\n2: title: UnoCSS\n3: description: UnoCSS integration for atomic CSS styling.\n4: ---\n5: \n6: # UnoCSS\n7: \n8: Integrates UnoCSS for atomic CSS styling in Manic. An alternative to Tailwind CSS with more flexibility.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/unocss\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/unocss\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { unocss } from '@manicjs/unocss';\n30: \n31: export default defineConfig({\n32:   plugins: [unocss()],\n33: });\n34: ```\n35: \n36: ### 3. Add Presets (Optional)\n37: \n38: ```ts\n39: import { presetUno, presetAttributify } from 'unocss';\n40: \n41: export default defineConfig({\n42:   plugins: [\n43:     unocss({\n44:       presets: [\n45:         presetUno(),\n46:         presetAttributify(),\n47:       ],\n48:     }),\n49:   ],\n50: });\n51: ```\n52: \n53: ## Options\n54: \n55: <TypeTable\n56:   type={{\n57:     presets: {\n58:       type: 'Preset[]',\n59:       description: 'UnoCSS presets to use',\n60:     },\n61:     rules: {\n62:       type: 'CustomRule[]',\n63:       description: 'Custom CSS rules',\n64:     },\n65:     shortcuts: {\n66:       type: 'Shortcut[]',\n67:       description: 'Shortcut mappings',\n68:     },\n69:     theme: {\n70:       type: 'ThemeConfig',\n71:       description: 'Custom theme values',\n72:     },\n73:   }}\n74: />\n75: \n76: ## UnoCSS Presets\n77: \n78: ### Core Presets\n79: \n80: ```ts\n81: import { presetUno, presetIcons, presetWebFonts } from 'unocss';\n82: \n83: export default defineConfig({\n84:   plugins: [\n85:     unocss({\n86:       presets: [\n87:         presetUno(),           // Core utilities\n88:         presetIcons(),         // Icon set\n89:         presetWebFonts(),     // Google Fonts\n90:       ],\n91:     }),\n92:   ],\n93: });\n94: ```\n95: \n96: ### Attributify Mode\n97: \n98: ```ts\n99: import { presetAttributify } from 'unocss';\n100: \n101: export default defineConfig({\n102:   plugins: [\n103:     unocss({\n104:       presets: [\n105:         presetAttributify({\n106:           /* attributify options */\n107:         }),\n108:       ],\n109:     }),\n110:   ],\n111: });\n112: ```\n113: \n114: Then use in HTML:\n115: \n116: ```tsx\n117: <div class=\"flex gap-2\" />\n118: <div flex gap-2 />       {/* attributify */}\n119: <div bg-red-500 />        {/* color shortcuts */}\n120: ```\n121: \n122: ## Custom Rules\n123: \n124: ```ts\n125: export default defineConfig({\n126:   plugins: [\n127:     unocss({\n128:       rules: [\n129:         [/^text-(.*)$/, ([c]) => ({ color: c })],\n130:         ['custom-shadow', { 'box-shadow': '0 4px 6px rgba(0,0,0,0.1)' }],\n131:       ],\n132:     }),\n133:   ],\n134: });\n135: ```\n136: \n137: ## Shortcuts\n138: \n139: Define reusable class combinations:\n140: \n141: ```ts\n142: export default defineConfig({\n143:   plugins: [\n144:     unocss({\n145:       shortcuts: [\n146:         ['btn', 'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600'],\n147:         ['input-field', 'w-full px-3 py-2 border border-gray-300 rounded'],\n148:       ],\n149:     }),\n150:   ],\n151: });\n152: ```\n153: \n154: Usage:\n155: \n156: ```tsx\n157: <button class=\"btn\">Click</button>\n158: <input class=\"input-field\" />\n159: ```\n160: \n161: ## Icon Sets\n162: \n163: Use UnoCSS icon presets:\n164: \n165: ```ts\n166: import { presetIcons } from 'unocss';\n167: \n168: export default defineConfig({\n169:   plugins: [\n170:     unocss({\n171:       presets: [\n172:         presetIcons({\n173:           scale: 1.2,\n174:           cdn: 'https://esm.sh/',\n175:         }),\n176:       ],\n177:     }),\n178:   ],\n179: });\n180: ```\n181: \n182: ```tsx\n183: <i class=\"i-carbon-sun text-xl\" />\n184: <i class=\"i-carbon-moon text-xl\" />\n185: ```\n186: \n187: ## Theme Integration\n188: \n189: ```ts\n190: export default defineConfig({\n191:   plugins: [\n192:     unocss({\n193:       theme: {\n194:         colors: {\n195:           primary: '#3b82f6',\n196:           secondary: '#8b5cf6',\n197:         },\n198:       },\n199:     }),\n200:   ],\n201: });\n202: ```\n203: \n204: ## Vs Tailwind CSS\n205: \n206: | Feature | UnoCSS | Tailwind CSS |\n207: |---------|--------|-------------|\n208: | Bundle size | Smaller (atomic only) | Full framework |\n209: | Customization | More flexible | Fixed methodology |\n210: | Icon system | Built-in | Requires plugin |\n211: | Attributify mode | Native | No |\n212: | Virtual modules | Yes | No |\n213: \n214: ## See Also\n215: \n216: - [Tailwind CSS](/docs/framework/tailwind) - Alternative styling\n217: - [UnoCSS Docs](https://uno.antfu.me)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/unocss.mdx"
}
```

**Tool Result:** `toolu_vrtx_01JPd83CEA7MVbLXaRX66jQp`

```
{
  "content": "1: ---\n2: title: MDX\n3: description: Markdown with JSX components in Manic.\n4: ---\n5: \n6: # MDX\n7: \n8: Integrates MDX (Markdown with JSX) support for rich content pages in Manic.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/mdx\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/mdx\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { mdx } from '@manicjs/mdx';\n30: \n31: export default defineConfig({\n32:   plugins: [mdx()],\n33: });\n34: ```\n35: \n36: ### 3. Create MDX Content\n37: \n38: ```mdx\n39: # Hello World\n40: \n41: This is **Markdown** with React components.\n42: \n43: <Counter initial={5} />\n44: ```\n45: \n46: ## Options\n47: \n48: <TypeTable\n49:   type={{\n50:     gfm: {\n51:       type: 'boolean',\n52:       default: 'true',\n53:       description: 'Enable GitHub Flavored Markdown',\n54:     },\n55:     remarkPlugins: {\n56:       type: 'Plugin[]',\n57:       description: 'Remark plugins to add',\n58:     },\n59:     rehypePlugins: {\n60:       type: 'Plugin[]',\n61:       description: 'Rehype plugins to add',\n62:     },\n63:     frontmatter: {\n64:       type: 'boolean',\n65:       default: 'true',\n66:       description: 'Parse YAML frontmatter',\n67:     },\n68:     toc: {\n69:       type: 'boolean',\n70:       default: 'false',\n71:       description: 'Extract table of contents',\n72:     },\n73:   }}\n74: />\n75: \n76: ## GFM Support\n77: \n78: Enabled by default:\n79: \n80: | Feature | Support |\n81: |---------|---------|\n82: | Tables | ✓ |\n83: | Task lists | ✓ |\n84: | Strikethrough | ✓ |\n85: | Autolinks | ✓ |\n86: | Footnotes | ✓ |\n87: \n88: ## Frontmatter\n89: \n90: Add metadata at the top of your MDX files:\n91: \n92: ```mdx\n93: ---\n94: title: My Post\n95: date: 2024-01-15\n96: author: John Doe\n97: tags: [react, manic]\n98: ---\n99: \n100: # {frontmatter.title}\n101: \n102: Written by {frontmatter.author}\n103: ```\n104: \n105: ## Using Components\n106: \n107: Import and use React components in MDX:\n108: \n109: ```mdx\n110: import { Callout } from '~/components/Callout';\n111: \n112: # Installation\n113: \n114: <Callout type=\"info\">\n115:   Follow these steps to install...\n116: </Callout>\n117: ```\n118: \n119: ## Custom Components\n120: \n121: Pass custom components to MDX pages:\n122: \n123: ```tsx\n124: // app/routes/blog/[slug].tsx\n125: import { getPost } from '~/lib/posts';\n126: \n127: export default function BlogPost({ slug }) {\n128:   const post = await getPost(slug);\n129:   \n130:   return (\n131:     <article>\n132:       <MDX source={post.content} components={post.components} />\n133:     </article>\n134:   );\n135: }\n136: ```\n137: \n138: ## Table of Contents\n139: \n140: Enable TOC extraction:\n141: \n142: ```ts\n143: // manic.config.ts\n144: import { defineConfig } from 'manicjs/config';\n145: import { mdx } from '@manicjs/mdx';\n146: \n147: export default defineConfig({\n148:   plugins: [\n149:     mdx({\n150:       toc: true,\n151:     }),\n152:   ],\n153: });\n154: ```\n155: \n156: Access in your page:\n157: \n158: ```tsx\n159: import { toc } from '~/toc';\n160: \n161: console.log(toc.headings);\n162: // [{ depth: 1, title: 'Introduction', id: 'introduction' }, ...]\n163: ```\n164: \n165: ## Syntax Highlighting\n166: \n167: Code blocks use Shiki by default:\n168: \n169: ````mdx\n170: ```ts\n171: const greeting = 'Hello';\n172: console.log(greeting);\n173: ```\n174: ````\n175: \n176: ## Custom Remark/Rehype\n177: \n178: Add remark/rehype plugins:\n179: \n180: ```ts\n181: import { defineConfig } from 'manicjs/config';\n182: import { mdx } from '@manicjs/mdx';\n183: import remarkGfm from 'remark-gfm';\n184: import rehypeSlug from 'rehype-slug';\n185: \n186: export default defineConfig({\n187:   plugins: [\n188:     mdx({\n189:       remarkPlugins: [remarkGfm],\n190:       rehypePlugins: [rehypeSlug],\n191:     }),\n192:   ],\n193: });\n194: ```\n195: \n196: ## MDX File Structure\n197: \n198: ```\n199: app/\n200: ├── routes/\n201: │   ├── blog/\n202: │   │   ├── index.tsx       # Blog listing\n203: │   │   └── [slug].tsx     # Blog post\n204: │   └── content/\n205: │       └── posts/\n206: │           ├── getting-started.mdx\n207: │           └── advanced.mdx\n208: ```\n209: \n210: ## See Also\n211: \n212: - [SEO](/docs/framework/seo) - Meta tags for content\n213: - [Sitemap](/docs/framework/sitemap) - Auto-generate sitemap\n214: - [MDX Docs](https://mdxjs.com)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mdx.mdx"
}
```

**Tool Result:** `toolu_vrtx_01RjWjiaZxbHDhcgq9qzkUJA`

```
{
  "content": "1: ---\n2: title: SEO\n3: description: SEO meta tags, Open Graph, and social cards.\n4: ---\n5: \n6: # SEO\n7: \n8: Automatic SEO optimization with meta tags, Open Graph, and Twitter cards.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/seo\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/seo\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { seo } from '@manicjs/seo';\n30: \n31: export default defineConfig({\n32:   plugins: [\n33:     seo({\n34:       title: 'My App',\n35:       description: 'Build amazing apps with Manic',\n36:       siteUrl: 'https://example.com',\n37:     }),\n38:   ],\n39: });\n40: ```\n41: \n42: ## Options\n43: \n44: <TypeTable\n45:   type={{\n46:     title: {\n47:       type: 'string',\n48:       description: 'Site title (used as template)',\n49:     },\n50:     titleTemplate: {\n51:       type: 'string',\n52:       default: '%s | {title}',\n53:       description: 'Template for page titles',\n54:     },\n55:     description: {\n56:       type: 'string',\n57:       description: 'Default meta description',\n58:     },\n59:     siteName: {\n60:       type: 'string',\n61:       description: 'Site name for Open Graph',\n62:     },\n63:     siteUrl: {\n64:       type: 'string',\n65:       description: 'Canonical URL',\n66:     },\n67:     twitter: {\n68:       type: 'TwitterCard',\n69:       description: 'Twitter card settings',\n70:     },\n71:     openGraph: {\n72:       type: 'OpenGraphConfig',\n73:       description: 'Open Graph settings',\n74:     },\n75:   }}\n76: />\n77: \n78: ### TwitterCard\n79: \n80: <TypeTable\n81:   type={{\n82:     site: {\n83:       type: 'string',\n84:       description: '@username for Twitter',\n85:     },\n86:     creator: {\n87:       type: 'string',\n88:       description: '@username of content creator',\n89:     },\n90:     cardType: {\n91:       type: \"'summary' | 'summary_large_image'\",\n92:       default: \"'summary_large_image'\",\n93:       description: 'Card type',\n94:     },\n95:   }}\n96: />\n97: \n98: ### OpenGraphConfig\n99: \n100: <TypeTable\n101:   type={{\n102:     locale: {\n103:       type: 'string',\n104:       default: \"'en_US'\",\n105:       description: 'Locale for OG tags',\n106:     },\n107:     type: {\n108:       type: \"'website' | 'article'\",\n109:       default: \"'website'\",\n110:       description: 'OG type',\n111:     },\n112:     fallbackImage: {\n113:       type: 'string',\n114:       description: 'Default OG image path',\n115:     },\n116:   }}\n117: />\n118: \n119: ## Per-Page SEO\n120: \n121: Set SEO data for individual pages:\n122: \n123: ```tsx\n124: // app/routes/about.tsx\n125: import { Metadata } from 'manicjs/seo';\n126: \n127: export const metadata: Metadata = {\n128:   title: 'About Us',\n129:   description: 'Learn more about our company',\n130:   ogImage: '/images/about-og.png',\n131: };\n132: \n133: export default function About() {\n134:   return <div>About page</div>;\n135: }\n136: ```\n137: \n138: ## Automatic Meta Tags\n139: \n140: The plugin automatically generates:\n141: \n142: ```html\n143: <title>Page Title | Site Name</title>\n144: <meta name=\"description\" content=\"...\" />\n145: \n146: <!-- Open Graph -->\n147: <meta property=\"og:type\" content=\"website\" />\n148: <meta property=\"og:title\" content=\"...\" />\n149: <meta property=\"og:description\" content=\"...\" />\n150: <meta property=\"og:image\" content=\"...\" />\n151: <meta property=\"og:url\" content=\"...\" />\n152: \n153: <!-- Twitter Card -->\n154: <meta name=\"twitter:card\" content=\"summary_large_image\" />\n155: <meta name=\"twitter:title\" content=\"...\" />\n156: <meta name=\"twitter:description\" content=\"...\" />\n157: <meta name=\"twitter:image\" content=\"...\" />\n158: ```\n159: \n160: ## Robots & Canonical\n161: \n162: ```ts\n163: import { defineConfig } from 'manicjs/config';\n164: import { seo } from '@manicjs/seo';\n165: \n166: export default defineConfig({\n167:   plugins: [\n168:     seo({\n169:       title: 'My App',\n170:       robots: {\n171:         index: true,\n172:         follow: true,\n173:       },\n174:       canonical: true,      // Auto-generate canonical URLs\n175:     }),\n176:   ],\n177: });\n178: ```\n179: \n180: ## JSON-LD Structured Data\n181: \n182: ```tsx\n183: import { JsonLd } from 'manicjs/seo';\n184: \n185: function OrganizationSchema() {\n186:   return (\n187:     <JsonLd>\n188:       {{\n189:         '@context': 'https://schema.org',\n190:         '@type': 'Organization',\n191:         name: 'My Company',\n192:         url: 'https://example.com',\n193:         logo: 'https://example.com/logo.png',\n194:       }}\n195:     </JsonLd>\n196:   );\n197: }\n198: ```\n199: \n200: ## Dynamic OG Images\n201: \n202: Generate Open Graph images dynamically:\n203: \n204: ```ts\n205: // manic.config.ts\n206: import { defineConfig } from 'manicjs/config';\n207: import { seo } from '@manicjs/seo';\n208: \n209: export default defineConfig({\n210:   plugins: [\n211:     seo({\n212:       ogImage: {\n213:         route: '/og',  // Custom OG image route\n214:         defaults: {\n215:           title: 'My App',\n216:           theme: '#000000',\n217:         },\n218:       },\n219:     }),\n220:   ],\n221: });\n222: ```\n223: \n224: ## See Also\n225: \n226: - [MDX](/docs/framework/mdx) - Content for SEO pages\n227: - [Sitemap](/docs/framework/sitemap) - Search engine indexing\n228: - [manicjs/seo Package](https://github.com/manicjs/seo)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/seo.mdx"
}
```

**Tool Result:** `toolu_vrtx_01TNQePCvooagarV9P5uk9v4`

```
{
  "content": "1: ---\n2: title: Sitemap\n3: description: Auto-generate sitemap.xml for search engines.\n4: ---\n5: \n6: # Sitemap\n7: \n8: Automatically generates `sitemap.xml` for search engine indexing.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/sitemap\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/sitemap\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { sitemap } from '@manicjs/sitemap';\n30: \n31: export default defineConfig({\n32:   plugins: [sitemap()],\n33: });\n34: ```\n35: \n36: Generates `sitemap.xml` at build time.\n37: \n38: ## Options\n39: \n40: <TypeTable\n41:   type={{\n42:     hostname: {\n43:       type: 'string',\n44:       required: true,\n45:       description: 'Site hostname for URLs',\n46:     },\n47:     outDir: {\n48:       type: 'string',\n49:       default: '\"./public\"',\n50:       description: 'Output directory',\n51:     },\n52:     filename: {\n53:       type: 'string',\n54:       default: '\"sitemap.xml\"',\n55:       description: 'Output filename',\n56:     },\n57:     ignoreRoutes: {\n58:       type: 'string[]',\n59:       description: 'Routes to exclude',\n60:     },\n61:     extraRoutes: {\n62:       type: 'RouteConfig[]',\n63:       description: 'Additional routes to include',\n64:     },\n65:     lastmod: {\n66:       type: \"'build' | 'modified' | false\",\n67:       default: \"'build'\",\n68:       description: 'Last modification strategy',\n69:     },\n70:     changefreq: {\n71:       type: 'DefaultFreq',\n72:       description: 'Default change frequency',\n73:     },\n74:     priority: {\n75:       type: 'boolean',\n76:       default: 'false',\n77:       description: 'Auto-calculate priorities',\n78:     },\n79:     trailingSlash: {\n80:       type: 'boolean',\n81:       description: 'Add trailing slashes',\n82:     },\n83:   }}\n84: />\n85: \n86: ### RouteConfig\n87: \n88: ```ts\n89: interface RouteConfig {\n90:   url: string;\n91:   lastmod?: Date;\n92:   changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';\n93:   priority?: number;\n94: }\n95: ```\n96: \n97: ## Example Configuration\n98: \n99: ```ts\n100: import { defineConfig } from 'manicjs/config';\n101: import { sitemap } from '@manicjs/sitemap';\n102: \n103: export default defineConfig({\n104:   plugins: [\n105:     sitemap({\n106:       hostname: 'https://example.com',\n107:       ignoreRoutes: ['/admin', '/api', '/private'],\n108:       extraRoutes: [\n109:         { url: '/contact', changefreq: 'monthly', priority: 0.5 },\n110:       ],\n111:       priority: true,\n112:       trailingSlash: true,\n113:     }),\n114:   ],\n115: });\n116: ```\n117: \n118: ## Sitemap Index\n119: \n120: For large sites, generate sitemap index:\n121: \n122: ```ts\n123: import { defineConfig } from 'manicjs/config';\n124: import { sitemap } from '@manicjs/sitemap';\n125: \n126: export default defineConfig({\n127:   plugins: [\n128:     sitemap({\n129:       hostname: 'https://example.com',\n130:       // Automatically creates sitemap-1.xml, sitemap-2.xml, etc.\n131:       maxUrlsPerSitemap: 1000,\n132:       sitemaps: [\n133:         { filename: 'pages.xml', routes: ['/about', '/contact'] },\n134:         { filename: 'blog.xml', routes: ['/blog/**'] },\n135:       ],\n136:     }),\n137:   ],\n138: });\n139: ```\n140: \n141: ## Output\n142: \n143: Generated `sitemap.xml`:\n144: \n145: ```xml\n146: <?xml version=\"1.0\" encoding=\"UTF-8\"?>\n147: <urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n148:   <url>\n149:     <loc>https://example.com/</loc>\n150:     <lastmod>2024-01-15</lastmod>\n151:     <changefreq>daily</changefreq>\n152:     <priority>1.0</priority>\n153:   </url>\n154:   <url>\n155:     <loc>https://example.com/about</loc>\n156:     <lastmod>2024-01-15</lastmod>\n157:     <changefreq>monthly</changefreq>\n158:     <priority>0.8</priority>\n159:   </url>\n160: </urlset>\n161: ```\n162: \n163: ## Robots.txt Integration\n164: \n165: The plugin can also update `robots.txt`:\n166: \n167: ```ts\n168: import { defineConfig } from 'manicjs/config';\n169: import { sitemap } from '@manicjs/sitemap';\n170: \n171: export default defineConfig({\n172:   plugins: [\n173:     sitemap({\n174:       hostname: 'https://example.com',\n175:       robotsTxt: true,\n176:     }),\n177:   ],\n178: });\n179: ```\n180: \n181: Creates `robots.txt`:\n182: \n183: ```\n184: User-agent: *\n185: Allow: /\n186: Sitemap: https://example.com/sitemap.xml\n187: ```\n188: \n189: ## Multi-Language\n190: \n191: For i18n sites:\n192: \n193: ```ts\n194: import { defineConfig } from 'manicjs/config';\n195: import { sitemap } from '@manicjs/sitemap';\n196: \n197: export default defineConfig({\n198:   plugins: [\n199:     sitemap({\n200:       hostname: 'https://example.com',\n201:       languages: [\n202:         { lang: 'en', defaultFor: ['en', 'en-US'] },\n203:         { lang: 'es', defaultFor: ['es', 'es-ES'] },\n204:         { lang: 'fr', defaultFor: ['fr', 'fr-FR'] },\n205:       ],\n206:     }),\n207:   ],\n208: });\n209: ```\n210: \n211: ## Integration with SEO\n212: \n213: Works with the `@manicjs/seo` plugin for complete SEO:\n214: \n215: ```ts\n216: import { defineConfig } from 'manicjs/config';\n217: import { seo } from '@manicjs/seo';\n218: import { sitemap } from '@manicjs/sitemap';\n219: \n220: export default defineConfig({\n221:   plugins: [\n222:     seo({ siteUrl: 'https://example.com' }),\n223:     sitemap({ hostname: 'https://example.com' }),\n224:   ],\n225: });\n226: ```\n227: \n228: ## See Also\n229: \n230: - [SEO](/docs/framework/seo) - Meta tags and OG\n231: - [Google Search Console](https://search.google.com/search-console)\n232: - [Sitemap Protocol](https://www.sitemaps.org/protocol.html)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/sitemap.mdx"
}
```

**Tool Result:** `toolu_vrtx_01AP58pmuU9DUV6neNovRnP1`

```
{
  "content": "1: ---\n2: title: MCP\n3: description: Model Context Protocol server for AI integration.\n4: ---\n5: \n6: # MCP\n7: \n8: Model Context Protocol (MCP) server for integrating your app with AI assistants and agents.\n9: \n10: ## What is MCP?\n11: \n12: MCP (Model Context Protocol) is an open protocol that enables AI assistants like Claude, ChatGPT, and other AI agents to connect to your application for context and actions.\n13: \n14: ## Installation\n15: \n16: ```bash\n17: bun add @manicjs/mcp\n18: ```\n19: \n20: ## Quick Start\n21: \n22: ### 1. Install Plugin\n23: \n24: ```bash\n25: bun add @manicjs/mcp\n26: ```\n27: \n28: ### 2. Configure\n29: \n30: ```ts\n31: // manic.config.ts\n32: import { defineConfig } from 'manicjs/config';\n33: import { mcp } from '@manicjs/mcp';\n34: \n35: export default defineConfig({\n36:   plugins: [\n37:     mcp({\n38:       // Enable MCP endpoint\n39:       enabled: true,\n40:       // API route for MCP (default: /api/mcp)\n41:       route: '/api/mcp',\n42:     }),\n43:   ],\n44: });\n45: ```\n46: \n47: ### 3. Use with AI Assistant\n48: \n49: Your AI assistant can now access your app through the MCP endpoint.\n50: \n51: ## Options\n52: \n53: <TypeTable\n54:   type={{\n55:     enabled: {\n56:       type: 'boolean',\n57:       default: 'true',\n58:       description: 'Enable/disable MCP server',\n59:     },\n60:     route: {\n61:       type: 'string',\n62:       default: '\"/api/mcp\"',\n63:       description: 'MCP endpoint route',\n64:     },\n65:     tools: {\n66:       type: 'ToolDefinition[]',\n67:       description: 'Custom tools to expose',\n68:     },\n69:     resources: {\n70:       type: 'ResourceDefinition[]',\n71:       description: 'Custom resources to expose',\n72:     },\n73:     prompts: {\n74:       type: 'PromptDefinition[]',\n75:       description: 'Custom prompts to expose',\n76:     },\n77:     auth: {\n78:       type: 'AuthConfig',\n79:       description: 'Authentication settings',\n80:     },\n81:   }}\n82: />\n83: \n84: ### ToolDefinition\n85: \n86: ```ts\n87: interface ToolDefinition {\n88:   name: string;\n89:   description: string;\n90:   inputSchema: object;\n91:   handler: (input: object) => Promise<object>;\n92: }\n93: ```\n94: \n95: ## Exposing Data as Resources\n96: \n97: Expose your data as resources that AI can read:\n98: \n99: ```ts\n100: import { defineConfig } from 'manicjs/config';\n101: import { mcp } from '@manicjs/mcp';\n102: \n103: export default defineConfig({\n104:   plugins: [\n105:     mcp({\n106:       resources: [\n107:         {\n108:           uri: 'manic://users',\n109:           name: 'Users List',\n110:           description: 'All registered users',\n111:           mimeType: 'application/json',\n112:           handler: async () => {\n113:             return fetch('/api/users').then(r => r.json());\n114:           },\n115:         },\n116:         {\n117:           uri: 'manic://config',\n118:           name: 'App Config',\n119:           description: 'Current application configuration',\n120:           mimeType: 'application/json',\n121:           handler: async () => {\n122:             return getConfig();\n123:           },\n124:         },\n125:       ],\n126:     }),\n127:   ],\n128: });\n129: ```\n130: \n131: ## Exposing Tools\n132: \n133: Expose functions that AI can call:\n134: \n135: ```ts\n136: import { defineConfig } from 'manicjs/config';\n137: import { mcp } from '@manicjs/mcp';\n138: \n139: export default defineConfig({\n140:   plugins: [\n141:     mcp({\n142:       tools: [\n143:         {\n144:           name: 'get_users',\n145:           description: 'Get all users in the system',\n146:           inputSchema: {\n147:             type: 'object',\n148:             properties: {\n149:               limit: { type: 'number', description: 'Max results' },\n150:             },\n151:           },\n152:           handler: async (input) => {\n153:             const users = await fetchUsers(input.limit);\n154:             return { users };\n155:           },\n156:         },\n157:         {\n158:           name: 'send_notification',\n159:           description: 'Send a notification to a user',\n160:           inputSchema: {\n161:             type: 'object',\n162:             properties: {\n163:               userId: { type: 'string' },\n164:               message: { type: 'string' },\n165:             },\n166:             required: ['userId', 'message'],\n167:           },\n168:           handler: async (input) => {\n169:             await sendNotification(input.userId, input.message);\n170:             return { success: true };\n171:           },\n172:         },\n173:       ],\n174:     }),\n175:   ],\n176: });\n177: ```\n178: \n179: ## AI Integration Flow\n180: \n181: ```mermaid\n182: flowchart TB\n183:     AI[AI Assistant] -->|MCP Protocol| MCP[MCP Endpoint]\n184:     MCP -->|Tools| DB[Your App Backend]\n185:     MCP -->|Resources| DB\n186:     DB -->|Response| MCP\n187:     MCP -->|JSON-RPC| AI\n188: ```\n189: \n190: ## Authentication\n191: \n192: Protect your MCP endpoint:\n193: \n194: ```ts\n195: import { defineConfig } from 'manicjs/config';\n196: import { mcp } from '@manicjs/mcp';\n197: \n198: export default defineConfig({\n199:   plugins: [\n200:     mcp({\n201:       auth: {\n202:         type: 'bearer',\n203:         token: process.env.MCP_TOKEN,\n204:         allowedOrigins: ['https://anthropic.com', 'https://chat.openai.com'],\n205:       },\n206:     }),\n207:   ],\n208: });\n209: ```\n210: \n211: ## Complete Example\n212: \n213: ```ts\n214: // manic.config.ts\n215: import { defineConfig } from 'manicjs/config';\n216: import { mcp } from '@manicjs/mcp';\n217: \n218: export default defineConfig({\n219:   plugins: [\n220:     mcp({\n221:       enabled: true,\n222:       route: '/api/mcp',\n223:       tools: [\n224:         {\n225:           name: 'query_database',\n226:           description: 'Query the application database',\n227:           inputSchema: {\n228:             type: 'object',\n229:             properties: {\n230:               query: { type: 'string' },\n231:               params: { type: 'array' },\n232:             },\n233:             required: ['query'],\n234:           },\n235:           handler: async ({ query, params }) => {\n236:             const result = await db.query(query, params);\n237:             return { rows: result };\n238:           },\n239:         },\n240:       ],\n241:       resources: [\n242:         {\n243:           uri: 'manic://schema',\n244:           name: 'Database Schema',\n245:           description: 'Current database schema',\n246:           mimeType: 'application/json',\n247:           handler: async () => {\n248:             return db.getSchema();\n249:           },\n250:         },\n251:       ],\n252:     }),\n253:   ],\n254: });\n255: ```\n256: \n257: ## Supported AI Clients\n258: \n259: | AI Platform | Support |\n260: |-------------|---------|\n261: | Claude (Anthropic) | ✓ Native |\n262: | ChatGPT Plugins | ✓ Via OpenAPI |\n263: | LangChain | ✓ Via MCP-LangChain |\n264: | Custom | ✓ Standard MCP |\n265: \n266: ## Security\n267: \n268: <Callout type=\"warn\">\n269: \n270: **Protect your MCP endpoint** - It exposes your app's data and functionality to AI assistants.\n271: \n272: </Callout>\n273: \n274: Best practices:\n275: 1. Always use authentication\n276: 2. Limit exposed tools/resources\n277: 3. Log all MCP requests\n278: 4. Never expose sensitive data without auth\n279: \n280: ## See Also\n281: \n282: - [MCP Specification](https://modelcontextprotocol.io)\n283: - [Anthropic MCP](https://docs.anthropic.com/en/docs/mcp)\n284: - [SEO](/docs/framework/seo) - Combine with SEO for AI visibility",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mcp.mdx"
}
```

**Tool Result:** `toolu_vrtx_01T6pvLJHsVpTPyN6f6VhKeN`

```
{
  "content": "1: ---\n2: title: API Docs\n3: description: Auto-generate interactive API reference documentation.\n4: ---\n5: \n6: # API Docs\n7: \n8: Generates interactive API reference documentation using Scalar.\n9: \n10: ## Installation\n11: \n12: ```bash\n13: bun add @manicjs/api-docs\n14: ```\n15: \n16: ## Quick Start\n17: \n18: ### 1. Install Plugin\n19: \n20: ```bash\n21: bun add @manicjs/api-docs\n22: ```\n23: \n24: ### 2. Configure\n25: \n26: ```ts\n27: // manic.config.ts\n28: import { defineConfig } from 'manicjs/config';\n29: import { apiDocs } from '@manicjs/api-docs';\n30: \n31: export default defineConfig({\n32:   plugins: [\n33:     apiDocs({\n34:       route: '/api/docs',\n35:     }),\n36:   ],\n37: });\n38: ```\n39: \n40: ### 3. Add OpenAPI Specs\n41: \n42: The plugin generates docs from your API routes automatically.\n43: \n44: ## Options\n45: \n46: <TypeTable\n47:   type={{\n48:     route: {\n49:       type: 'string',\n50:       default: '\"/api/docs\"',\n51:       description: 'Route for API docs UI',\n52:     },\n53:     spec: {\n54:       type: 'OpenAPISpec',\n55:       description: 'Manual OpenAPI spec',\n56:     },\n57:     output: {\n58:       type: 'string',\n59:       description: 'Output file path',\n60:     },\n61:     theme: {\n62:       type: \"'scalar' | 'openapi' | 'stoplight'\",\n63:       default: '\"scalar\"',\n64:       description: 'Documentation theme',\n65:     },\n66:     title: {\n67:       type: 'string',\n68:       default: '\"API Reference\"',\n69:       description: 'Document title',\n70:     },\n71:     favicon: {\n72:       type: 'string',\n73:       description: 'Favicon path',\n74:     },\n75:   }}\n76: />\n77: \n78: ## Auto-Generation\n79: \n80: The plugin scans your API routes and generates OpenAPI spec:\n81: \n82: ```ts\n83: // manic.config.ts\n84: import { defineConfig } from 'manicjs/config';\n85: import { apiDocs } from '@manicjs/api-docs';\n86: \n87: export default defineConfig({\n88:   plugins: [\n89:     apiDocs({\n90:       // Auto-generates from app/api/\n91:       autoGenerate: true,\n92:     }),\n93:   ],\n94: });\n95: ```\n96: \n97: ## Manual Spec\n98: \n99: Provide custom OpenAPI spec:\n100: \n101: ```ts\n102: import { defineConfig } from 'manicjs/config';\n103: import { apiDocs } from '@manicjs/api-docs';\n104: \n105: export default defineConfig({\n106:   plugins: [\n107:     apiDocs({\n108:       spec: {\n109:         openapi: '3.0.0',\n110:         info: {\n111:           title: 'My API',\n112:           version: '1.0.0',\n113:         },\n114:         paths: {\n115:           '/users': {\n116:             get: {\n117:               summary: 'List users',\n118:               responses: {\n119:                 '200': {\n120:                   description: 'OK',\n121:                 },\n122:               },\n123:             },\n124:           },\n125:         },\n126:       },\n127:     }),\n128:   ],\n129: });\n130: ```\n131: \n132: ## Themes\n133: \n134: ### Scalar (Default)\n135: \n136: ```ts\n137: import { defineConfig } from 'manicjs/config';\n138: import { apiDocs } from '@manicjs/api-docs';\n139: \n140: export default defineConfig({\n141:   plugins: [\n142:     apiDocs({\n143:       theme: 'scalar',\n144:     }),\n145:   ],\n146: });\n147: ```\n148: \n149: ### OpenAPI\n150: \n151: ```ts\n152: export default defineConfig({\n153:   plugins: [\n154:     apiDocs({\n155:       theme: 'openapi',\n156:     }),\n157:   ],\n158: });\n159: ```\n160: \n161: ## Authentication\n162: \n163: Add auth to docs:\n164: \n165: ```ts\n166: export default defineConfig({\n167:   plugins: [\n168:     apiDocs({\n169:       route: '/api/docs',\n170:       auth: {\n171:         type: 'bearer',\n172:         token: process.env.API_DOCS_TOKEN,\n173:       },\n174:     }),\n175:   ],\n176: });\n177: ```\n178: \n179: ## Custom Branding\n180: \n181: ```ts\n182: export default defineConfig({\n183:   plugins: [\n184:     apiDocs({\n185:       title: 'My App API',\n186:       favicon: '/favicon.ico',\n187:       colors: {\n188:         primary: '#3b82f6',\n189:       },\n190:     }),\n191:   ],\n192: });\n193: ```\n194: \n195: ## Generated UI Features\n196: \n197: - Interactive request/response playground\n198: - Request body editor with JSON validation\n199: - Authentication header support\n200: - Code examples in multiple languages\n201: - Search and filtering\n202: - Dark/light mode\n203: \n204: ## Example Output\n205: \n206: ```\n207: ┌─────────────────────────────────────────────┐\n208: │  API Reference                        [■]  │\n209: ├─────────────────────────────────────────────┤\n210: │  GET  /api/users                     [Try] │\n211: │  ────────────────────────────────────────  │\n212: │  Lists all users in the system              │\n213: │  ┌─────────────────────────────────────┐   │\n214: │  │ Response 200                        │   │\n215: │  │ {                                   │   │\n216: │  │   \"users\": [                        │   │\n217: │  │     { \"id\": 1, \"name\": \"Alice\" }  │   │\n218: │  │   ]                                 │   │\n219: │  │ }                                   │   │\n220: │  └─────────────────────────────────────┘   │\n221: │                                             │\n222: │  POST  /api/users                     [Try]│\n223: │  ────────────────────────────────────────  │\n224: └─────────────────────────────────────────────┘\n225: ```\n226: \n227: ## Integration with OpenAPI\n228: \n229: Export spec for other tools:\n230: \n231: ```ts\n232: export default defineConfig({\n233:   plugins: [\n234:     apiDocs({\n235:       output: './openapi.json',\n236:       // Also generate spec file\n237:       generateFile: true,\n238:     }),\n239:   ],\n240: });\n241: ```\n242: \n243: ## Security\n244: \n245: <Callout type=\"warn\">\n246: \n247: **Protect production docs** - Use authentication or disable in production.\n248: \n249: </Callout>\n250: \n251: ```ts\n252: export default defineConfig({\n253:   plugins: [\n254:     apiDocs({\n255:       enabled: Bun.env.NODE_ENV !== 'production',\n256:     }),\n257:   ],\n258: });\n259: ```\n260: \n261: ## See Also\n262: \n263: - [API Routes](/docs/framework/server) - Your API endpoints\n264: - [Scalar](https://scalar.com) - API documentation tool\n265: - [OpenAPI Specification](https://swagger.io/specification/)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/api-docs.mdx"
}
```

**Tool Result:** `toolu_vrtx_01GST8FmMsXYUY9neGQwJfjX`

```
{
  "content": "1: ---\n2: title: Plugins\n3: description: Official plugins to extend Manic functionality.\n4: ---\n5: \n6: # Plugins\n7: \n8: Plugins extend Manic's core functionality. The framework includes official plugins for styling, content, SEO, and more.\n9: \n10: ## Installation\n11: \n12: Each plugin is a separate package:\n13: \n14: ```bash\n15: # Add plugins you need\n16: bun add @manicjs/tailwind @manicjs/mdx @manicjs/seo @manicjs/sitemap @manicjs/mcp @manicjs/api-docs\n17: ```\n18: \n19: ## Official Plugins\n20: \n21: <Cards>\n22:   <Card title=\"Tailwind CSS\" description=\"Tailwind CSS v4 integration with zero config.\" href=\"/docs/framework/tailwind\" />\n23:   <Card title=\"UnoCSS\" description=\"UnoCSS for atomic CSS styling.\" href=\"/docs/framework/unocss\" />\n24:   <Card title=\"MDX\" description=\"Markdown with JSX components.\" href=\"/docs/framework/mdx\" />\n25:   <Card title=\"SEO\" description=\"Meta tags, Open Graph, and social cards.\" href=\"/docs/framework/seo\" />\n26:   <Card title=\"Sitemap\" description=\"Auto-generate sitemap.xml.\" href=\"/docs/framework/sitemap\" />\n27:   <Card title=\"MCP\" description=\"Model Context Protocol server.\" href=\"/docs/framework/mcp\" />\n28:   <Card title=\"API Docs\" description=\"Scalar API reference UI.\" href=\"/docs/framework/api-docs\" />\n29: </Cards>\n30: \n31: ---\n32: \n33: ## Using Plugins\n34: \n35: ### 1. Install\n36: \n37: ```bash\n38: bun add @manicjs/[plugin-name]\n39: ```\n40: \n41: ### 2. Configure\n42: \n43: Add to your `manic.config.ts`:\n44: \n45: ```ts\n46: import { defineConfig } from 'manicjs/config';\n47: import { tailwind } from '@manicjs/tailwind';\n48: import { mdx } from '@manicjs/mdx';\n49: \n50: export default defineConfig({\n51:   plugins: [\n52:     tailwind(),\n53:     mdx(),\n54:   ],\n55: });\n56: ```\n57: \n58: ### 3. That's It\n59: \n60: Plugins automatically integrate with both dev server and build output. No additional setup required.\n61: \n62: ---\n63: \n64: ## How Plugins Work\n65: \n66: ### Plugin Interface\n67: \n68: ```ts\n69: interface ManicPlugin {\n70:   name: string;\n71:   \n72:   /** Bun plugin script - auto-injected */\n73:   preload?: string;\n74:   \n75:   /** bunfig.toml snippet */\n76:   bunfig?: string;\n77:   \n78:   /** Dev server hooks */\n79:   configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;\n80:   \n81:   /** Build hooks */\n82:   build?(ctx: ManicBuildPluginContext): void | Promise<void>;\n83: }\n84: ```\n85: \n86: ### Build Context\n87: \n88: During build, plugins can:\n89: \n90: - Inject HTML into `<head>` via `injectHtml()`\n91: - Emit static files via `emitClientFile()`\n92: - Access route information via `pageRoutes` and `apiRoutes`\n93: \n94: ### Server Context\n95: \n96: In dev server, plugins can:\n97: \n98: - Add routes via `addRoute()`\n99: - Inject link headers via `addLinkHeader()`\n100: - Inject HTML via `injectHtml()`\n101: \n102: ---\n103: \n104: ## Creating Custom Plugins\n105: \n106: See [Plugin Development](/docs/framework/advanced/plugin-development) for creating your own plugins.\n107: \n108: ---\n109: \n110: ## Version Compatibility\n111: \n112: | Plugin | Manic Version |\n113: |--------|---------------|\n114: | @manicjs/tailwind | 0.5.0+ |\n115: | @manicjs/unocss | 0.5.0+ |\n116: | @manicjs/mdx | 0.5.0+ |\n117: | @manicjs/seo | 0.5.0+ |\n118: | @manicjs/sitemap | 0.5.0+ |\n119: | @manicjs/mcp | 0.6.0+ |\n120: | @manicjs/api-docs | 0.6.0+ |",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/index.mdx"
}
```

## Assistant

Now let me read all the actual plugin source files to compare:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/tailwind"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/unocss"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/sitemap"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/api-docs"
}
```

## User

**Tool Result:** `toolu_vrtx_01M36SdnDPmqyN9vjHqKZNxq`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/tailwind",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

**Tool Result:** `toolu_vrtx_01FBVePUDdH93JUg6Ktfj4eU`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/unocss",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

**Tool Result:** `toolu_vrtx_01TmBYanpDZqGEzvdSqzWNqa`

```
{
  "content": "node_modules/\nsrc/\npackage.json",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mdx",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json"
  ]
}
```

**Tool Result:** `toolu_vrtx_013BGohmZK6v4gttoW79zjzc`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

**Tool Result:** `toolu_vrtx_019YEAgBynJCwobAKc4eRWyF`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/sitemap",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

**Tool Result:** `toolu_vrtx_015EneZsNfsz52APu4KKYr9S`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

**Tool Result:** `toolu_vrtx_013QrqWWFmaurHSpu8TPCu3y`

```
{
  "content": "node_modules/\nsrc/\npackage.json\nREADME.md",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/api-docs",
  "directoryEntries": [
    "node_modules/",
    "src/",
    "package.json",
    "README.md"
  ]
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/tailwind/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/unocss/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mdx/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/api-docs/src"
}
```

## User

**Tool Result:** `toolu_vrtx_01TzcUbhAjPE74dM2TMaGyFw`

```
{
  "content": "index.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/tailwind/src",
  "directoryEntries": [
    "index.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_01TLvP88Fg4xtJRLBqcWJnkE`

```
{
  "content": "index.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/unocss/src",
  "directoryEntries": [
    "index.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_016nAox2HNi8u5Gf82ZNVoLj`

```
{
  "content": "bun-plugin.ts\nindex.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mdx/src",
  "directoryEntries": [
    "bun-plugin.ts",
    "index.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_0136ATNSwy3J5TmpoNtPo1zp`

```
{
  "content": "index.ts\nrobots.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/src",
  "directoryEntries": [
    "index.ts",
    "robots.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_017v8jLpaDpXSeS5Stgh8HrK`

```
{
  "content": "generate.ts\nindex.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src",
  "directoryEntries": [
    "generate.ts",
    "index.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_01Tfze43prdo6SC11fvh7Wr1`

```
{
  "content": "console.ts\ndefault-tools.ts\ndiscovery.ts\nhandler.ts\nindex.ts\ntool.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src",
  "directoryEntries": [
    "console.ts",
    "default-tools.ts",
    "discovery.ts",
    "handler.ts",
    "index.ts",
    "tool.ts"
  ]
}
```

**Tool Result:** `toolu_vrtx_015Z5eCMZ6zt9f1b88BU3raT`

```
{
  "content": "index.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/api-docs/src",
  "directoryEntries": [
    "index.ts"
  ]
}
```

## Assistant

Now let me read all the actual plugin source files:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/tailwind/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/unocss/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mdx/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mdx/src/bun-plugin.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src/robots.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src/generate.ts"
}
```

## User

**Tool Result:** `toolu_vrtx_01WrTHujBTX3cpDbw7gTTJro`

```
{
  "content": "1: import type { ManicPlugin } from 'manicjs/config';\n2: \n3: /**\n4:  * Creates a Tailwind CSS plugin for Manic.\n5:  *\n6:  * Uses bun-plugin-tailwind for hot reloading support in development.\n7:  * In production, Tailwind classes are bundled with the client.\n8:  *\n9:  * @returns ManicPlugin for Tailwind CSS\n10:  *\n11:  * @example\n12:  * import { tailwind } from '@manicjs/tailwind';\n13:  *\n14:  * tailwind()\n15:  */\n16: export function tailwind(): ManicPlugin {\n17:   return {\n18:     name: '@manicjs/tailwind',\n19:     bunfig: `[serve.static]\\nplugins = [\"bun-plugin-tailwind\"]`,\n20:   };\n21: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/tailwind/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01Wq5TxxFVfdFMNS746dD1Qi`

```
{
  "content": "1: import type { ManicPlugin } from 'manicjs/config';\n2: import type { UserConfig } from 'unocss';\n3: \n4: /**\n5:  * Creates an UnoCSS plugin for Manic.\n6:  *\n7:  * Uses bun-plugin-unocss for hot reloading support.\n8:  * Config is read from uno.config.ts in the project root.\n9:  *\n10:  * @param config - Optional UnoCSS configuration (detected from uno.config.ts if not provided)\n11:  * @returns ManicPlugin for UnoCSS\n12:  *\n13:  * @example\n14:  * import { unocss } from '@manicjs/unocss';\n15:  *\n16:  * unocss()\n17:  */\n18: export function unocss(config?: UserConfig): ManicPlugin {\n19:   // bun-plugin-unocss auto-detects uno.config.ts in the project root.\n20:   // Pass config via uno.config.ts for full customization.\n21:   return {\n22:     name: '@manicjs/unocss',\n23:     bunfig: `[serve.static]\\nplugins = [\"bun-plugin-unocss\"]`,\n24:   };\n25: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/unocss/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_015BhteBKsvb2MP639NSFXZf`

```
{
  "content": "1: import type { ManicPlugin } from 'manicjs/config';\n2: import { resolve } from 'node:path';\n3: import { fileURLToPath } from 'node:url';\n4: \n5: export type { MdxPluginOptions } from './bun-plugin.ts';\n6: \n7: const __dirname = fileURLToPath(new URL('.', import.meta.url));\n8: \n9: /**\n10:  * Creates an MDX plugin for Manic.\n11:  *\n12:  * Enables MDX (Markdown + JSX) support in the project.\n13:  * Uses bun-plugin-mdx for fast compilation with support for:\n14:  * - GFM (GitHub Flavored Markdown)\n15:  * - Frontmatter\n16:  * - Table of contents extraction\n17:  * - Syntax highlighting\n18:  *\n19:  * @param options - MDX plugin configuration options\n20:  * @returns ManicPlugin for MDX\n21:  *\n22:  * @example\n23:  * import { mdx } from '@manicjs/mdx';\n24:  *\n25:  * mdx({\n26:  *   frontmatterName: 'metadata',\n27:  *   toc: true,\n28:  *   highlight: 'github-dark',\n29:  * })\n30:  *\n31:  * @example\n32:  * // With custom remark/rehype plugins (via Bun.plugin directly)\n33:  * import { mdxBunPlugin } from '@manicjs/mdx';\n34:  * Bun.plugin(mdxBunPlugin({ myOption: true }));\n35:  */\n36: export function mdx(options: import('./bun-plugin.ts').MdxPluginOptions = {}): ManicPlugin {\n37:   // Serialize non-function options so the preload script can read them.\n38:   // remark/rehype plugin arrays (functions) can't be serialized — users needing\n39:   // those should call mdxBunPlugin() directly and register via Bun.plugin().\n40:   const serializable: Record<string, unknown> = {};\n41:   if (options.filter) {\n42:     serializable.filter = { source: options.filter.source, flags: options.filter.flags };\n43:   }\n44:   if (options.frontmatterName) serializable.frontmatterName = options.frontmatterName;\n45:   if (options.disableGfm) serializable.disableGfm = options.disableGfm;\n46:   if (options.disableFrontmatter) serializable.disableFrontmatter = options.disableFrontmatter;\n47:   if (options.toc) serializable.toc = options.toc;\n48:   if (options.highlight) serializable.highlight = options.highlight;\n49:   if (options.mdxOptions) serializable.mdxOptions = options.mdxOptions;\n50: \n51:   if (Object.keys(serializable).length) {\n52:     process.env.__MANIC_MDX_OPTIONS__ = JSON.stringify(serializable);\n53:   }\n54: \n55:   return {\n56:     name: '@manicjs/mdx',\n57:     preload: resolve(__dirname, 'bun-plugin.ts'),\n58:     bunfig: `[serve.static]\\nplugins = [\"@manicjs/mdx/bun-plugin\"]`,\n59:   };\n60: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mdx/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01W4He4pUWNM5K4wBpHGNRoM`

```
{
  "content": "1: import type { BunPlugin } from 'bun';\n2: import { compile, type CompileOptions } from '@mdx-js/mdx';\n3: import remarkGfm from 'remark-gfm';\n4: import remarkFrontmatter from 'remark-frontmatter';\n5: import remarkMdxFrontmatter from 'remark-mdx-frontmatter';\n6: \n7: export interface MdxPluginOptions {\n8:   /** File extensions to treat as MDX (default: /\\.mdx?$/) */\n9:   filter?: RegExp;\n10:   /** Name of the exported frontmatter variable (default: 'frontmatter') */\n11:   frontmatterName?: string;\n12:   /** Disable built-in GFM support (default: false) */\n13:   disableGfm?: boolean;\n14:   /** Disable built-in frontmatter extraction (default: false) */\n15:   disableFrontmatter?: boolean;\n16:   /** Enable fumadocs-core rehypeToc — exports `toc` from each MDX file (default: false) */\n17:   toc?: boolean;\n18:   /**\n19:    * Enable syntax highlighting via rehype-pretty-code (default: false).\n20:    * Pass `true` for github-light/github-dark, or a theme object.\n21:    */\n22:   highlight?: boolean | { light: string; dark: string };\n23:   /** Extra remark plugins appended after built-ins */\n24:   remarkPlugins?: CompileOptions['remarkPlugins'];\n25:   /** Rehype plugins */\n26:   rehypePlugins?: CompileOptions['rehypePlugins'];\n27:   /** Pass-through any @mdx-js/mdx CompileOptions (overrides built-in defaults) */\n28:   mdxOptions?: Omit<CompileOptions, 'remarkPlugins' | 'rehypePlugins'>;\n29: }\n30: \n31: export function mdxBunPlugin(options: MdxPluginOptions = {}): BunPlugin {\n32:   const {\n33:     filter = /\\.mdx?$/,\n34:     frontmatterName = 'frontmatter',\n35:     disableGfm = false,\n36:     disableFrontmatter = false,\n37:     toc = false,\n38:     highlight = false,\n39:     remarkPlugins = [],\n40:     rehypePlugins = [],\n41:     mdxOptions = {},\n42:   } = options;\n43: \n44:   return {\n45:     name: 'manicjs-mdx',\n46:     setup(build) {\n47:       build.onLoad({ filter }, async (args) => {\n48:         const source = await Bun.file(args.path).text();\n49: \n50:         const builtinRemark: NonNullable<CompileOptions['remarkPlugins']> = [];\n51:         if (!disableGfm) builtinRemark.push(remarkGfm);\n52:         if (!disableFrontmatter) {\n53:           builtinRemark.push(remarkFrontmatter);\n54:           builtinRemark.push([remarkMdxFrontmatter, { name: frontmatterName }]);\n55:         }\n56: \n57:         const builtinRehype: NonNullable<CompileOptions['rehypePlugins']> = [];\n58:         if (highlight) {\n59:           const { default: rehypePrettyCode } = await import('rehype-pretty-code');\n60:           const theme = highlight === true\n61:             ? { light: 'github-light', dark: 'github-dark' }\n62:             : highlight;\n63:           builtinRehype.push([rehypePrettyCode, { theme }]);\n64:         }\n65:         if (toc) {\n66:           const { rehypeToc, remarkHeading } = await import('fumadocs-core/mdx-plugins');\n67:           builtinRemark.push(remarkHeading);\n68:           builtinRehype.push(rehypeToc);\n69:         }\n70: \n71:         const compiled = await compile(source, {\n72:           jsx: true,\n73:           jsxImportSource: 'react',\n74:           outputFormat: 'program',\n75:           ...mdxOptions,\n76:           remarkPlugins: [...builtinRemark, ...remarkPlugins],\n77:           rehypePlugins: [...builtinRehype, ...rehypePlugins],\n78:         });\n79: \n80:         return { contents: String(compiled), loader: 'jsx' };\n81:       });\n82:     },\n83:   };\n84: }\n85: \n86: // When preloaded via --preload, read serializable options from env var\n87: function resolveOptionsFromEnv(): MdxPluginOptions {\n88:   const raw = process.env.__MANIC_MDX_OPTIONS__;\n89:   if (!raw) return {};\n90:   try {\n91:     const parsed = JSON.parse(raw);\n92:     if (parsed.filter) {\n93:       parsed.filter = new RegExp(parsed.filter.source, parsed.filter.flags);\n94:     }\n95:     return parsed;\n96:   } catch {\n97:     return {};\n98:   }\n99: }\n100: \n101: // Auto-register when preloaded via --preload\n102: const _plugin = mdxBunPlugin(resolveOptionsFromEnv());\n103: Bun.plugin(_plugin);\n104: \n105: // Default export required by bunfig.toml [serve.static] plugins\n106: export default _plugin;",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mdx/src/bun-plugin.ts"
}
```

**Tool Result:** `toolu_vrtx_01Vx1cyo2BwGfWgWjM3sEdYB`

```
{
  "content": "1: import { createPlugin } from 'manicjs/config';\n2: import { generateRobotsTxt } from './robots';\n3: \n4: /**\n5:  * Robot rule for robots.txt\n6:  * @interface RobotRule\n7:  */\n8: export interface RobotRule {\n9:   /** User agent pattern (e.g. \"*\", \"GoogleBot\") */\n10:   userAgent: string;\n11:   /** Allowed paths */\n12:   allow?: string[];\n13:   /** Disallowed paths */\n14:   disallow?: string[];\n15:   /** Crawl delay in seconds */\n16:   crawlDelay?: number;\n17: }\n18: \n19: /**\n20:  * RFC 8288 Link header configuration\n21:  * @interface LinkHeader\n22:  */\n23: export interface LinkHeader {\n24:   /** Target URL for the link */\n25:   href: string;\n26:   /** IANA link relation type (e.g. \"service-desc\", \"describedby\") */\n27:   rel: string;\n28:   /** Media type (e.g. \"application/json\") */\n29:   type?: string;\n30: }\n31: \n32: /**\n33:  * SEO configuration for meta tags, Open Graph, Twitter Cards, and robots.txt\n34:  * @interface SeoConfig\n35:  */\n36: export interface SeoConfig {\n37:   /** Base URL of the site, e.g. \"https://example.com\" */\n38:   hostname: string;\n39:   /** Page title */\n40:   title?: string;\n41:   /** Page description */\n42:   description?: string;\n43:   /** Author name */\n44:   author?: string;\n45:   /** Twitter card config */\n46:   twitter?: {\n47:     card?: 'summary' | 'summary_large_image' | 'app' | 'player';\n48:     site?: string;\n49:     creator?: string;\n50:   };\n51:   /** Open Graph config */\n52:   openGraph?: {\n53:     type?: string;\n54:     locale?: string;\n55:     image?: string;\n56:     siteName?: string;\n57:   };\n58:   /** Crawler rules. Defaults to allow all. */\n59:   rules?: RobotRule[];\n60:   /** Additional sitemap URLs to include in robots.txt */\n61:   sitemaps?: string[];\n62:   /** Auto-add /sitemap.xml when @manicjs/sitemap is used @default true */\n63:   autoSitemap?: boolean;\n64:   /** Extra RFC 8288 Link headers added to all HTML responses */\n65:   linkHeaders?: LinkHeader[];\n66:   /**\n67:    * Content-Signal directives appended to robots.txt.\n68:    * @see https://contentsignals.org/\n69:    */\n70:   contentSignals?: {\n71:     'ai-train'?: 'yes' | 'no';\n72:     search?: 'yes' | 'no';\n73:     'ai-input'?: 'yes' | 'no';\n74:   };\n75: }\n76: \n77: function generateMetaTags(config: SeoConfig): string {\n78:   const tags: string[] = [];\n79:   const hostname = config.hostname.replace(/\\/$/, '');\n80: \n81:   if (config.title)\n82:     tags.push(`  <meta name=\"title\" content=\"${config.title}\">`);\n83:   if (config.description)\n84:     tags.push(`  <meta name=\"description\" content=\"${config.description}\">`);\n85:   if (config.author)\n86:     tags.push(`  <meta name=\"author\" content=\"${config.author}\">`);\n87: \n88:   // Open Graph\n89:   if (config.title)\n90:     tags.push(`  <meta property=\"og:title\" content=\"${config.title}\">`);\n91:   if (config.description)\n92:     tags.push(\n93:       `  <meta property=\"og:description\" content=\"${config.description}\">`\n94:     );\n95:   tags.push(`  <meta property=\"og:url\" content=\"${hostname}\">`);\n96:   if (config.openGraph?.type)\n97:     tags.push(`  <meta property=\"og:type\" content=\"${config.openGraph.type}\">`);\n98:   if (config.openGraph?.locale)\n99:     tags.push(\n100:       `  <meta property=\"og:locale\" content=\"${config.openGraph.locale}\">`\n101:     );\n102:   if (config.openGraph?.image)\n103:     tags.push(\n104:       `  <meta property=\"og:image\" content=\"${config.openGraph.image}\">`\n105:     );\n106:   if (config.openGraph?.siteName)\n107:     tags.push(\n108:       `  <meta property=\"og:site_name\" content=\"${config.openGraph.siteName}\">`\n109:     );\n110: \n111:   // Twitter\n112:   if (config.twitter?.card)\n113:     tags.push(`  <meta name=\"twitter:card\" content=\"${config.twitter.card}\">`);\n114:   if (config.twitter?.site)\n115:     tags.push(`  <meta name=\"twitter:site\" content=\"${config.twitter.site}\">`);\n116:   if (config.twitter?.creator)\n117:     tags.push(\n118:       `  <meta name=\"twitter:creator\" content=\"${config.twitter.creator}\">`\n119:     );\n120:   if (config.title)\n121:     tags.push(`  <meta name=\"twitter:title\" content=\"${config.title}\">`);\n122:   if (config.description)\n123:     tags.push(\n124:       `  <meta name=\"twitter:description\" content=\"${config.description}\">`\n125:     );\n126: \n127:   return tags.join('\\n');\n128: }\n129: \n130: /**\n131:  * Creates an SEO plugin for meta tags, Open Graph, Twitter Cards, and robots.txt.\n132:  *\n133:  * Generates:\n134:  * - robots.txt with crawl rules\n135:  * - Meta tags (title, description, author)\n136:  * - Open Graph tags for social sharing\n137:  * - Twitter Card tags\n138:  * - RFC 8288 Link headers for sitemap discovery\n139:  *\n140:  * @param config - SEO configuration options\n141:  * @returns ManicPlugin for SEO\n142:  *\n143:  * @example\n144:  * import { seo } from '@manicjs/seo';\n145:  *\n146:  * seo({\n147:  *   hostname: 'https://example.com',\n148:  *   title: 'My App',\n149:  *   description: 'A great app',\n150:  *   twitter: { card: 'summary_large_image' },\n151:  * })\n152:  */\n153: export function seo(config: SeoConfig) {\n154:   return createPlugin({\n155:     name: 'seo',\n156: \n157:     staticFiles: [\n158:       {\n159:         path: '/robots.txt',\n160:         content: generateRobotsTxt(config),\n161:         contentType: 'text/plain; charset=utf-8',\n162:       },\n163:     ],\n164: \n165:     configureServer(ctx) {\n166:       const hostname = config.hostname.replace(/\\/$/, '');\n167:       if (config.autoSitemap ?? true) {\n168:         ctx.addLinkHeader(\n169:           `<${hostname}/sitemap.xml>; rel=\"describedby\"; type=\"application/xml\"`\n170:         );\n171:       }\n172:       for (const s of config.sitemaps ?? []) {\n173:         ctx.addLinkHeader(`<${s}>; rel=\"describedby\"; type=\"application/xml\"`);\n174:       }\n175:       for (const lh of config.linkHeaders ?? []) {\n176:         ctx.addLinkHeader(\n177:           `<${lh.href}>; rel=\"${lh.rel}\"${lh.type ? `; type=\"${lh.type}\"` : ''}`\n178:         );\n179:       }\n180:       const metaTags = generateMetaTags(config);\n181:       if (metaTags) ctx.injectHtml(metaTags);\n182:     },\n183: \n184:     build(ctx) {\n185:       const metaTags = generateMetaTags(config);\n186:       if (metaTags) ctx.injectHtml(metaTags);\n187:     },\n188:   });\n189: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01PC3tA4u9kBH6f8G6n6soLx`

```
{
  "content": "1: import type { SeoConfig } from './index';\n2: \n3: /** Generates the full robots.txt content from the SEO config. */\n4: export function generateRobotsTxt(config: SeoConfig): string {\n5:   const hostname = config.hostname.replace(/\\/$/, '');\n6:   const autoSitemap = config.autoSitemap ?? true;\n7:   const rules = config.rules?.length\n8:     ? config.rules\n9:     : [{ userAgent: '*', allow: ['/'] }];\n10:   const lines: string[] = [];\n11: \n12:   for (const rule of rules) {\n13:     lines.push(`User-agent: ${rule.userAgent}`);\n14:     for (const p of rule.allow ?? []) lines.push(`Allow: ${p}`);\n15:     for (const p of rule.disallow ?? []) lines.push(`Disallow: ${p}`);\n16:     if (rule.crawlDelay != null) lines.push(`Crawl-delay: ${rule.crawlDelay}`);\n17:     lines.push('');\n18:   }\n19: \n20:   const sitemaps = config.sitemaps ? [...config.sitemaps] : [];\n21:   if (autoSitemap) {\n22:     const url = `${hostname}/sitemap.xml`;\n23:     if (!sitemaps.includes(url)) sitemaps.push(url);\n24:   }\n25:   for (const s of sitemaps) lines.push(`Sitemap: ${s}`);\n26: \n27:   if (config.contentSignals) {\n28:     const parts = Object.entries(config.contentSignals).map(\n29:       ([k, v]) => `${k}=${v}`\n30:     );\n31:     if (parts.length) lines.push('', `Content-Signal: ${parts.join(', ')}`);\n32:   }\n33: \n34:   return lines.join('\\n').trim() + '\\n';\n35: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/src/robots.ts"
}
```

**Tool Result:** `toolu_vrtx_01G12ULjKs9RFJPnMQJUsPfM`

```
{
  "content": "1: import { createPlugin } from 'manicjs/config';\n2: import { generateSitemapXml } from './generate';\n3: \n4: /**\n5:  * Sitemap generation configuration\n6:  * @interface SitemapConfig\n7:  */\n8: export interface SitemapConfig {\n9:   /** Base URL of the site, e.g. \"https://example.com\" */\n10:   hostname: string;\n11:   /** @default \"weekly\" */\n12:   changefreq?:\n13:     | 'always'\n14:     | 'hourly'\n15:     | 'daily'\n16:     | 'weekly'\n17:     | 'monthly'\n18:     | 'yearly'\n19:     | 'never';\n20:   /** @default 0.8 */\n21:   priority?: number;\n22:   /** Route paths to exclude from the sitemap */\n23:   exclude?: string[];\n24: }\n25: \n26: /**\n27:  * Creates a sitemap plugin that auto-generates sitemap.xml from routes.\n28:  *\n29:  * Scans page routes and generates an XML sitemap compatible with\n30:  * search engines. Excludes dynamic routes automatically.\n31:  *\n32:  * @param config - Sitemap configuration\n33:  * @returns ManicPlugin that generates sitemap.xml\n34:  *\n35:  * @example\n36:  * import { sitemap } from '@manicjs/sitemap';\n37:  *\n38:  * sitemap({\n39:  *   hostname: 'https://example.com',\n40:  *   changefreq: 'daily',\n41:  *   priority: 0.8,\n42:  *   exclude: ['/admin'],\n43:  * })\n44:  */\n45: export function sitemap(config: SitemapConfig) {\n46:   return createPlugin({\n47:     name: 'sitemap',\n48:     staticFiles: [\n49:       {\n50:         path: '/sitemap.xml',\n51:         content: ctx => generateSitemapXml(ctx.pageRoutes, config),\n52:         contentType: 'application/xml',\n53:       },\n54:     ],\n55:   });\n56: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01TpMbSfTodDxKSdz3T7xc95`

```
{
  "content": "1: import type { SitemapConfig } from './index';\n2: \n3: /** Generates sitemap XML from a list of page routes. */\n4: export function generateSitemapXml(\n5:   routes: { path: string; dynamic: boolean }[],\n6:   config: SitemapConfig\n7: ): string {\n8:   const hostname = config.hostname.replace(/\\/$/, '');\n9:   const changefreq = config.changefreq ?? 'weekly';\n10:   const priority = config.priority ?? 0.8;\n11:   const exclude = config.exclude ?? [];\n12: \n13:   const urls = routes\n14:     .filter(r => !r.dynamic && !exclude.includes(r.path))\n15:     .map(r => {\n16:       const loc = r.path === '/' ? hostname + '/' : hostname + r.path;\n17:       return `  <url>\\n    <loc>${loc}</loc>\\n    <changefreq>${changefreq}</changefreq>\\n    <priority>${priority}</priority>\\n  </url>`;\n18:     })\n19:     .join('\\n');\n20: \n21:   return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\\n${urls}\\n</urlset>`;\n22: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/sitemap/src/generate.ts"
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/tool.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/handler.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/discovery.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/default-tools.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/console.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/api-docs/src/index.ts"
}
```

## User

**Tool Result:** `toolu_vrtx_01PdwfHik7iyjQ3n19HgXy89`

```
{
  "content": "1: import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';\n2: import { defaultTools } from './default-tools';\n3: import { buildDiscoveryDocs } from './discovery';\n4: import { handleMessage, sseEvent } from './handler';\n5: import { consoleIngestHandler, CONSOLE_SCRIPT } from './console';\n6: \n7: export type { McpTool } from './tool';\n8: export { defineTool } from './tool';\n9: \n10: /**\n11:  * MCP (Model Context Protocol) server configuration\n12:  * @interface McpConfig\n13:  */\n14: export interface McpConfig {\n15:   /** @default \"manic-mcp\" */\n16:   name?: string;\n17:   /** @default \"1.0.0\" */\n18:   version?: string;\n19:   /** Endpoint path @default \"/mcp\" */\n20:   path?: string;\n21:   /** Additional tools alongside the built-in framework tools */\n22:   tools?: import('./tool').McpTool[];\n23: }\n24: \n25: /**\n26:  * Creates an MCP (Model Context Protocol) server plugin.\n27:  *\n28:  * Exposes tools to AI agents via the MCP protocol. Provides:\n29:  * - MCP server endpoint (JSON-RPC over SSE)\n30:  * - Auto-discovery endpoints for agents\n31:  * - Built-in framework tools (navigate, getRoute, etc.)\n32:  * - Browser-side WebMCP integration via /webmcp.js\n33:  * - Console logging for debugging\n34:  *\n35:  * @param config - MCP configuration options\n36:  * @returns ManicPlugin for MCP\n37:  *\n38:  * @example\n39:  * import { mcp, defineTool } from '@manicjs/mcp';\n40:  *\n41:  * mcp({\n42:  *   name: 'my-app',\n43:  *   version: '1.0.0',\n44:  *   path: '/mcp',\n45:  *   tools: [\n46:  *     defineTool({\n47:  *       name: 'getUser',\n48:  *       description: 'Get user by ID',\n49:  *       inputSchema: { type: 'object', properties: { id: { type: 'string' } } },\n50:  *       handler: async ({ id }) => ({ id, name: 'John' }),\n51:  *     }),\n52:  *   ],\n53:  * })\n54:  */\n55: /**\n56:  * Builds the inline script injected into the HTML that registers MCP tools\n57:  * (navigator.modelContext). Each tool delegates execution to the MCP server\n58:  * via fetch, so tools are defined once and work in both contexts.\n59:  */\n60: function buildWebMcpScript(\n61:   endpoint: string,\n62:   tools: import('./tool').McpTool[]\n63: ): string {\n64:   const toolDefs = tools.map(t => ({\n65:     name: t.name,\n66:     description: t.description,\n67:     inputSchema: t.inputSchema,\n68:   }));\n69: \n70:   return `(function () {\n71:   if (!navigator.modelContext) return;\n72:   var ac = new AbortController();\n73:   var tools = ${JSON.stringify(toolDefs, null, 2)};\n74:   tools.forEach(function (tool) {\n75:     navigator.modelContext.registerTool({\n76:       name: tool.name,\n77:       description: tool.description,\n78:       inputSchema: tool.inputSchema,\n79:       signal: ac.signal,\n80:       execute: function (args) {\n81:         return fetch(${JSON.stringify(endpoint)}, {\n82:           method: 'POST',\n83:           headers: { 'content-type': 'application/json', 'accept': 'application/json' },\n84:           body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.name, arguments: args } }),\n85:         })\n86:           .then(function (r) { return r.json(); })\n87:           .then(function (d) { return d.result?.content?.[0]?.text ? JSON.parse(d.result.content[0].text) : d.result; });\n88:       },\n89:     });\n90:   });\n91:   window.addEventListener('unload', function () { ac.abort(); });\n92: })();`;\n93: }\n94: \n95: export function mcp(config: McpConfig = {}): ManicPlugin {\n96:   const endpoint = config.path ?? '/mcp';\n97:   const serverName = config.name ?? 'manic-mcp';\n98:   const serverVersion = config.version ?? '1.0.0';\n99:   const userTools = config.tools ?? [];\n100:   const sessions = new Map<string, { initialized: boolean }>();\n101: \n102:   return {\n103:     name: '@manicjs/mcp',\n104:     mcpPath: endpoint,\n105: \n106:     async configureServer(ctx: ManicServerPluginContext) {\n107:       const tools = [...defaultTools(ctx), ...userTools];\n108: \n109:       if (!ctx.prod) {\n110:         ctx.addRoute('/mcp/console', consoleIngestHandler);\n111:         ctx.addRoute(\n112:           '/mcp/console.js',\n113:           () =>\n114:             new Response(CONSOLE_SCRIPT, {\n115:               headers: {\n116:                 'content-type': 'application/javascript; charset=utf-8',\n117:               },\n118:             })\n119:         );\n120:       }\n121: \n122:       const {\n123:         skillContent,\n124:         skillUrl,\n125:         wellKnown,\n126:         serverCard,\n127:         agentSkillsIndex,\n128:       } = await buildDiscoveryDocs(serverName, serverVersion, endpoint, tools);\n129: \n130:       ctx.addRoute(\n131:         '/.well-known/mcp.json',\n132:         () =>\n133:           new Response(wellKnown, {\n134:             headers: { 'content-type': 'application/json' },\n135:           })\n136:       );\n137:       ctx.addRoute(\n138:         '/.well-known/mcp/server-card.json',\n139:         () =>\n140:           new Response(serverCard, {\n141:             headers: { 'content-type': 'application/json' },\n142:           })\n143:       );\n144:       ctx.addRoute(\n145:         skillUrl,\n146:         () =>\n147:           new Response(skillContent, {\n148:             headers: { 'content-type': 'text/markdown; charset=utf-8' },\n149:           })\n150:       );\n151:       ctx.addRoute(\n152:         '/.well-known/agent-skills/index.json',\n153:         () =>\n154:           new Response(agentSkillsIndex, {\n155:             headers: { 'content-type': 'application/json' },\n156:           })\n157:       );\n158: \n159:       ctx.addLinkHeader(\n160:         '</.well-known/mcp/server-card.json>; rel=\"mcp\"; type=\"application/json\"'\n161:       );\n162:       ctx.addLinkHeader(\n163:         '</.well-known/mcp.json>; rel=\"mcp-discovery\"; type=\"application/json\"'\n164:       );\n165:       ctx.addLinkHeader(\n166:         '</.well-known/agent-skills/index.json>; rel=\"agent-skills\"; type=\"application/json\"'\n167:       );\n168: \n169:       ctx.addRoute(\n170:         '/webmcp.js',\n171:         () =>\n172:           new Response(buildWebMcpScript(endpoint, tools), {\n173:             headers: {\n174:               'content-type': 'application/javascript; charset=utf-8',\n175:             },\n176:           })\n177:       );\n178: \n179:       ctx.injectHtml('<script src=\"/webmcp.js\"></script>');\n180: \n181:       ctx.addRoute(endpoint, async (req: Request) => {\n182:         const origin = req.headers.get('origin');\n183:         const cors: Record<string, string> = origin\n184:           ? {\n185:               'access-control-allow-origin': origin,\n186:               'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',\n187:               'access-control-allow-headers':\n188:                 'content-type, accept, mcp-session-id',\n189:               'access-control-expose-headers': 'mcp-session-id',\n190:             }\n191:           : {};\n192: \n193:         if (req.method === 'OPTIONS')\n194:           return new Response(null, { status: 204, headers: cors });\n195: \n196:         const sessionId = req.headers.get('mcp-session-id');\n197: \n198:         if (req.method === 'DELETE') {\n199:           if (sessionId && sessions.has(sessionId)) {\n200:             sessions.delete(sessionId);\n201:             return new Response(null, { status: 200, headers: cors });\n202:           }\n203:           return new Response(null, { status: 404, headers: cors });\n204:         }\n205: \n206:         if (req.method === 'GET') {\n207:           if (!(req.headers.get('accept') ?? '').includes('text/event-stream'))\n208:             return new Response(null, { status: 405, headers: cors });\n209:           const stream = new ReadableStream({\n210:             start(c) {\n211:               const t = setInterval(\n212:                 () => c.enqueue(new TextEncoder().encode(': ping\\n\\n')),\n213:                 15_000\n214:               );\n215:               req.signal.addEventListener('abort', () => {\n216:                 clearInterval(t);\n217:                 c.close();\n218:               });\n219:             },\n220:           });\n221:           return new Response(stream, {\n222:             headers: {\n223:               ...cors,\n224:               'content-type': 'text/event-stream',\n225:               'cache-control': 'no-cache',\n226:               connection: 'keep-alive',\n227:             },\n228:           });\n229:         }\n230: \n231:         if (req.method === 'POST') {\n232:           const wantsSSE = (req.headers.get('accept') ?? '').includes(\n233:             'text/event-stream'\n234:           );\n235:           let body: unknown;\n236:           try {\n237:             body = await req.json();\n238:           } catch {\n239:             return new Response(\n240:               JSON.stringify({\n241:                 jsonrpc: '2.0',\n242:                 id: null,\n243:                 error: { code: -32700, message: 'Parse error' },\n244:               }),\n245:               {\n246:                 status: 400,\n247:                 headers: { ...cors, 'content-type': 'application/json' },\n248:               }\n249:             );\n250:           }\n251: \n252:           const messages = Array.isArray(body) ? body : [body];\n253:           const hasRequests = messages.some(\n254:             (m: any) => m.method && m.id !== undefined\n255:           );\n256: \n257:           if (!hasRequests) {\n258:             for (const msg of messages)\n259:               handleMessage(\n260:                 msg as any,\n261:                 sessionId,\n262:                 sessions,\n263:                 tools,\n264:                 serverName,\n265:                 serverVersion\n266:               );\n267:             return new Response(null, { status: 202, headers: cors });\n268:           }\n269: \n270:           const results = await Promise.all(\n271:             messages.map(async (msg: any) => {\n272:               const out = handleMessage(\n273:                 msg,\n274:                 sessionId,\n275:                 sessions,\n276:                 tools,\n277:                 serverName,\n278:                 serverVersion\n279:               );\n280:               if (!out) return { result: null, newSessionId: undefined };\n281:               return {\n282:                 result: await out.response,\n283:                 newSessionId: out.newSessionId,\n284:               };\n285:             })\n286:           );\n287: \n288:           const responses = results.map(r => r.result).filter(Boolean);\n289:           const newSessionId = results.find(r => r.newSessionId)?.newSessionId;\n290:           const resHeaders: Record<string, string> = { ...cors };\n291:           if (newSessionId) resHeaders['mcp-session-id'] = newSessionId;\n292: \n293:           if (wantsSSE) {\n294:             const enc = new TextEncoder();\n295:             const stream = new ReadableStream({\n296:               start(c) {\n297:                 for (const r of responses) c.enqueue(enc.encode(sseEvent(r)));\n298:                 c.close();\n299:               },\n300:             });\n301:             return new Response(stream, {\n302:               headers: {\n303:                 ...resHeaders,\n304:                 'content-type': 'text/event-stream',\n305:                 'cache-control': 'no-cache',\n306:               },\n307:             });\n308:           }\n309: \n310:           return new Response(\n311:             JSON.stringify(responses.length === 1 ? responses[0] : responses),\n312:             { headers: { ...resHeaders, 'content-type': 'application/json' } }\n313:           );\n314:         }\n315: \n316:         return new Response(null, { status: 405, headers: cors });\n317:       });\n318:     },\n319: \n320:     async build(ctx) {\n321:       const tools = [...defaultTools(ctx as any), ...userTools];\n322:       const {\n323:         skillContent,\n324:         skillUrl,\n325:         wellKnown,\n326:         serverCard,\n327:         agentSkillsIndex,\n328:       } = await buildDiscoveryDocs(serverName, serverVersion, endpoint, tools);\n329:       await Promise.all([\n330:         ctx.emitClientFile('.well-known/mcp.json', wellKnown),\n331:         ctx.emitClientFile('.well-known/mcp/server-card.json', serverCard),\n332:         ctx.emitClientFile(\n333:           '.well-known/agent-skills/index.json',\n334:           agentSkillsIndex\n335:         ),\n336:         ctx.emitClientFile(skillUrl.slice(1), skillContent),\n337:         ctx.emitClientFile('webmcp.js', buildWebMcpScript(endpoint, tools)),\n338:       ]);\n339:       ctx.injectHtml('<script src=\"/webmcp.js\"></script>');\n340:     },\n341:   };\n342: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01E1o37CKvP7HwHC82PMaaJE`

```
{
  "content": "1: import type { ZodObject, ZodRawShape, infer as ZodInfer } from 'zod';\n2: \n3: /**\n4:  * MCP tool definition\n5:  * @interface McpTool\n6:  */\n7: export interface McpTool {\n8:   /** Tool name (unique identifier) */\n9:   name: string;\n10:   /** Human-readable tool description */\n11:   description: string;\n12:   /** JSON Schema for tool input */\n13:   inputSchema: {\n14:     type: 'object';\n15:     properties?: Record<string, unknown>;\n16:     required?: string[];\n17:   };\n18:   /** Execute function with parsed arguments */\n19:   execute(args: Record<string, unknown>): Promise<unknown> | unknown;\n20: }\n21: \n22: type ToolDef<S extends ZodObject<ZodRawShape>> = {\n23:   description: string;\n24:   input: S;\n25:   execute(args: ZodInfer<S>): Promise<unknown> | unknown;\n26: };\n27: \n28: /**\n29:  * Defines a typed MCP tool with Zod schema validation.\n30:  *\n31:  * The Zod schema is automatically converted to JSON Schema for MCP.\n32:  * Args are validated and typed at call time.\n33:  *\n34:  * @template S - Zod schema type\n35:  * @param name - Unique tool name\n36:  * @param def - Tool definition with description, input schema, and handler\n37:  * @returns McpTool for use with mcp()\n38:  *\n39:  * @example\n40:  * import { defineTool } from '@manicjs/mcp';\n41:  * import { z } from 'zod';\n42:  *\n43:  * defineTool('getUser', {\n44:  *   description: 'Get a user by ID',\n45:  *   input: z.object({ id: z.string() }),\n46:  *   handler: async ({ id }) => ({ id, name: 'John' }),\n47:  * })\n48:  */\n49: export function defineTool<S extends ZodObject<ZodRawShape>>(\n50:   name: string,\n51:   def: ToolDef<S>\n52: ): McpTool {\n53:   const shape = def.input.shape;\n54:   const properties: Record<string, unknown> = {};\n55:   const required: string[] = [];\n56: \n57:   for (const [key, field] of Object.entries(shape)) {\n58:     const f = field as any;\n59:     const isOptional =\n60:       f._def?.typeName === 'ZodOptional' || f.isOptional?.() === true;\n61:     const inner = isOptional ? (f._def?.innerType ?? f) : f;\n62:     const typeName: string = inner._def?.typeName ?? '';\n63: \n64:     const prop: Record<string, unknown> = {\n65:       type:\n66:         typeName === 'ZodNumber'\n67:           ? 'number'\n68:           : typeName === 'ZodBoolean'\n69:             ? 'boolean'\n70:             : typeName === 'ZodArray'\n71:               ? 'array'\n72:               : 'string',\n73:     };\n74:     const desc = f._def?.description ?? inner._def?.description;\n75:     if (desc) prop.description = desc;\n76: \n77:     properties[key] = prop;\n78:     if (!isOptional) required.push(key);\n79:   }\n80: \n81:   return {\n82:     name,\n83:     description: def.description,\n84:     inputSchema: {\n85:       type: 'object',\n86:       properties,\n87:       ...(required.length ? { required } : {}),\n88:     },\n89:     execute(args) {\n90:       return def.execute(def.input.parse(args));\n91:     },\n92:   };\n93: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/tool.ts"
}
```

**Tool Result:** `toolu_vrtx_01MQcsAgc6x6BXRLedFcS9Gs`

```
{
  "content": "1: import type { McpTool } from './tool';\n2: import { PROTOCOL_VERSION } from './discovery';\n3: \n4: export type HandleResult = { response: unknown; newSessionId?: string } | null;\n5: \n6: /** Handles a single JSON-RPC message and returns the response (or null for notifications). */\n7: export function handleMessage(\n8:   msg: Record<string, unknown>,\n9:   sessionId: string | null,\n10:   sessions: Map<string, { initialized: boolean }>,\n11:   tools: McpTool[],\n12:   serverName: string,\n13:   serverVersion: string\n14: ): HandleResult {\n15:   const { id, method, params } = msg as {\n16:     id?: unknown;\n17:     method?: string;\n18:     params?: any;\n19:   };\n20: \n21:   if (method === 'initialize') {\n22:     const newSessionId = crypto.randomUUID();\n23:     sessions.set(newSessionId, { initialized: false });\n24:     return {\n25:       newSessionId,\n26:       response: {\n27:         jsonrpc: '2.0',\n28:         id,\n29:         result: {\n30:           protocolVersion: PROTOCOL_VERSION,\n31:           capabilities: { tools: {} },\n32:           serverInfo: { name: serverName, version: serverVersion },\n33:         },\n34:       },\n35:     };\n36:   }\n37: \n38:   if (method === 'notifications/initialized') {\n39:     const s = sessionId ? sessions.get(sessionId) : null;\n40:     if (s) s.initialized = true;\n41:     return null;\n42:   }\n43: \n44:   if (method === 'tools/list') {\n45:     return {\n46:       response: {\n47:         jsonrpc: '2.0',\n48:         id,\n49:         result: {\n50:           tools: tools.map(({ name, description, inputSchema }) => ({\n51:             name,\n52:             description,\n53:             inputSchema,\n54:           })),\n55:         },\n56:       },\n57:     };\n58:   }\n59: \n60:   if (method === 'tools/call') {\n61:     const tool = tools.find(t => t.name === params?.name);\n62:     if (!tool) {\n63:       return {\n64:         response: {\n65:           jsonrpc: '2.0',\n66:           id,\n67:           error: { code: -32601, message: `Tool not found: ${params?.name}` },\n68:         },\n69:       };\n70:     }\n71:     return {\n72:       response: (async () => {\n73:         try {\n74:           const result = await tool.execute(params?.arguments ?? {});\n75:           return {\n76:             jsonrpc: '2.0',\n77:             id,\n78:             result: {\n79:               content: [{ type: 'text', text: JSON.stringify(result) }],\n80:             },\n81:           };\n82:         } catch (err: unknown) {\n83:           return {\n84:             jsonrpc: '2.0',\n85:             id,\n86:             error: {\n87:               code: -32000,\n88:               message: err instanceof Error ? err.message : String(err),\n89:             },\n90:           };\n91:         }\n92:       })(),\n93:     };\n94:   }\n95: \n96:   return {\n97:     response: {\n98:       jsonrpc: '2.0',\n99:       id: id ?? null,\n100:       error: { code: -32601, message: 'Method not found' },\n101:     },\n102:   };\n103: }\n104: \n105: export function sseEvent(data: unknown): string {\n106:   return `data: ${JSON.stringify(data)}\\n\\n`;\n107: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/handler.ts"
}
```

**Tool Result:** `toolu_vrtx_01C9tJEfAktxHW9LQsZEXEm8`

```
{
  "content": "1: import type { McpTool } from './tool';\n2: \n3: const PROTOCOL_VERSION = '2025-03-26';\n4: \n5: export { PROTOCOL_VERSION };\n6: \n7: /** Builds all well-known discovery documents from the active tool list. */\n8: export async function buildDiscoveryDocs(\n9:   serverName: string,\n10:   serverVersion: string,\n11:   endpoint: string,\n12:   tools: McpTool[]\n13: ) {\n14:   const toolDocs = tools\n15:     .map(t => {\n16:       const props = t.inputSchema.properties ?? {};\n17:       const req = new Set(t.inputSchema.required ?? []);\n18:       const params = Object.entries(props)\n19:         .map(\n20:           ([k, v]: [string, any]) =>\n21:             `  - \\`${k}${req.has(k) ? '' : '?'}\\` (${v.type ?? 'string'})${v.description ? ': ' + v.description : ''}`\n22:         )\n23:         .join('\\n');\n24:       return [\n25:         `### \\`${t.name}\\``,\n26:         t.description,\n27:         ...(params\n28:           ? ['', '**Parameters:**', params]\n29:           : ['', '_No parameters._']),\n30:       ].join('\\n');\n31:     })\n32:     .join('\\n\\n');\n33: \n34:   const skillContent = `# ${serverName} — MCP Server Skill\n35: \n36: ## Overview\n37: \n38: This server implements the [Model Context Protocol](https://modelcontextprotocol.io) (MCP ${PROTOCOL_VERSION}) using the **Streamable HTTP** transport.\n39: \n40: ## Connection\n41: \n42: **Endpoint:** \\`${endpoint}\\`\n43: **Transport:** Streamable HTTP (POST + optional SSE)\n44: **Discovery:** \\`/.well-known/mcp/server-card.json\\`\n45: \n46: ### Initialization sequence\n47: \n48: 1. \\`POST ${endpoint}\\` with \\`initialize\\` (no \\`Mcp-Session-Id\\` header)\n49: 2. Server responds with \\`InitializeResult\\` + \\`Mcp-Session-Id\\` response header\n50: 3. \\`POST ${endpoint}\\` with \\`notifications/initialized\\` (include \\`Mcp-Session-Id\\`)\n51: 4. All subsequent requests must include \\`Mcp-Session-Id\\`\n52: \n53: ### Request format\n54: \n55: \\`\\`\\`http\n56: POST ${endpoint}\n57: Content-Type: application/json\n58: Accept: application/json, text/event-stream\n59: Mcp-Session-Id: <session-id>\n60: \n61: {\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/call\",\"params\":{\"name\":\"<tool>\",\"arguments\":{...}}}\n62: \\`\\`\\`\n63: \n64: ## Available tools\n65: \n66: ${toolDocs}\n67: \n68: ## Ending a session\n69: \n70: \\`\\`\\`http\n71: DELETE ${endpoint}\n72: Mcp-Session-Id: <session-id>\n73: \\`\\`\\`\n74: `;\n75: \n76:   const skillBytes = new TextEncoder().encode(skillContent);\n77:   const hashBuf = await crypto.subtle.digest('SHA-256', skillBytes);\n78:   const digest =\n79:     'sha256:' +\n80:     Array.from(new Uint8Array(hashBuf))\n81:       .map(b => b.toString(16).padStart(2, '0'))\n82:       .join('');\n83:   const skillUrl = '/.well-known/agent-skills/use-mcp/SKILL.md';\n84: \n85:   return {\n86:     skillContent,\n87:     skillUrl,\n88:     wellKnown: JSON.stringify({\n89:       mcpVersion: PROTOCOL_VERSION,\n90:       endpoint,\n91:       name: serverName,\n92:       version: serverVersion,\n93:       tools: tools.map(t => ({ name: t.name, description: t.description })),\n94:     }),\n95:     serverCard: JSON.stringify({\n96:       serverInfo: { name: serverName, version: serverVersion },\n97:       transport: { type: 'streamable-http', endpoint },\n98:       capabilities: { tools: true, resources: false, prompts: false },\n99:     }),\n100:     agentSkillsIndex: JSON.stringify({\n101:       $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',\n102:       skills: [\n103:         {\n104:           name: 'use-mcp',\n105:           type: 'skill-md',\n106:           description: `How to connect to and use the ${serverName} MCP server`,\n107:           url: skillUrl,\n108:           digest,\n109:         },\n110:       ],\n111:     }),\n112:   };\n113: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/discovery.ts"
}
```

**Tool Result:** `toolu_vrtx_01Ph7f22xdAMaNTWff5Z6znk`

```
{
  "content": "1: import type { ManicServerPluginContext } from 'manicjs/config';\n2: import type { McpTool } from './tool';\n3: import { consoleLogTool } from './console';\n4: \n5: /** Returns the built-in framework tools derived from the plugin context. */\n6: export function defaultTools(ctx: ManicServerPluginContext): McpTool[] {\n7:   const port = ctx.config.server?.port ?? 6070;\n8: \n9:   const tools: McpTool[] = [\n10:     {\n11:       name: 'get_routes',\n12:       description:\n13:         'Returns all page routes registered in the Manic app (path + file path).',\n14:       inputSchema: { type: 'object' },\n15:       execute: () => ctx.pageRoutes,\n16:     },\n17:     {\n18:       name: 'get_api_routes',\n19:       description:\n20:         'Returns all API routes registered under /api in the Manic app.',\n21:       inputSchema: { type: 'object' },\n22:       execute: () => ctx.apiRoutes,\n23:     },\n24:     {\n25:       name: 'get_page_meta',\n26:       description:\n27:         'Fetches a page and extracts its <title>, meta tags (og:*, description, etc.), and canonical link.',\n28:       inputSchema: {\n29:         type: 'object',\n30:         properties: {\n31:           url: { type: 'string', description: 'Absolute or relative URL' },\n32:         },\n33:         required: ['url'],\n34:       },\n35:       async execute({ url }) {\n36:         const target = String(url);\n37:         const res = await fetch(\n38:           target.startsWith('http')\n39:             ? target\n40:             : `http://localhost:${port}${target}`\n41:         );\n42:         const html = await res.text();\n43:         const title = html.match(/<title[^>]*>([^<]*)<\\/title>/i)?.[1] ?? null;\n44:         const metas: Record<string, string> = {};\n45:         for (const m of html.matchAll(/<meta\\s+([^>]+)>/gi)) {\n46:           const name =\n47:             m[1].match(/(?:name|property)=[\"']([^\"']+)[\"']/i)?.[1] ?? null;\n48:           const content = m[1].match(/content=[\"']([^\"']+)[\"']/i)?.[1] ?? null;\n49:           if (name && content) metas[name] = content;\n50:         }\n51:         const canonical =\n52:           html.match(\n53:             /<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']+)[\"']/i\n54:           )?.[1] ?? null;\n55:         return { title, meta: metas, canonical };\n56:       },\n57:     },\n58:     {\n59:       name: 'get_rendered_elements',\n60:       description:\n61:         'Fetches a page and returns a simplified element list (tag, id, class, text) for AI inspection.',\n62:       inputSchema: {\n63:         type: 'object',\n64:         properties: {\n65:           url: { type: 'string', description: 'Absolute or relative URL' },\n66:           selector: {\n67:             type: 'string',\n68:             description: 'CSS selector scope (default: body)',\n69:           },\n70:         },\n71:         required: ['url'],\n72:       },\n73:       async execute({ url, selector }) {\n74:         const target = String(url);\n75:         const res = await fetch(\n76:           target.startsWith('http')\n77:             ? target\n78:             : `http://localhost:${port}${target}`\n79:         );\n80:         const html = await res.text();\n81:         const scope = selector ? String(selector) : 'body';\n82:         const elements: Array<{\n83:           tag: string;\n84:           id?: string;\n85:           class?: string;\n86:           text?: string;\n87:         }> = [];\n88:         for (const m of html.matchAll(\n89:           /<([a-z][a-z0-9-]*)([^>]*)>([\\s\\S]*?)<\\/\\1>/gi\n90:         )) {\n91:           const [, tag, attrs, inner] = m;\n92:           if (['script', 'style', 'head'].includes(tag.toLowerCase())) continue;\n93:           const id = attrs.match(/id=[\"']([^\"']+)[\"']/i)?.[1];\n94:           const cls = attrs.match(/class=[\"']([^\"']+)[\"']/i)?.[1];\n95:           const text =\n96:             inner\n97:               .replace(/<[^>]+>/g, '')\n98:               .trim()\n99:               .slice(0, 80) || undefined;\n100:           elements.push({\n101:             tag,\n102:             ...(id ? { id } : {}),\n103:             ...(cls ? { class: cls } : {}),\n104:             ...(text ? { text } : {}),\n105:           });\n106:           if (elements.length >= 100) break;\n107:         }\n108:         return { selector: scope, elements };\n109:       },\n110:     },\n111:   ];\n112: \n113:   if (!ctx.prod) tools.push(consoleLogTool());\n114: \n115:   return tools;\n116: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/default-tools.ts"
}
```

**Tool Result:** `toolu_vrtx_01Ftpb4XsBZwzSR4U2CPa411`

```
{
  "content": "1: import type { McpTool } from './tool';\n2: \n3: const MAX_LOGS = 200;\n4: export const consoleLogs: Array<{\n5:   level: string;\n6:   args: unknown[];\n7:   ts: number;\n8: }> = [];\n9: \n10: export const CONSOLE_SCRIPT = `(function(){var e='/mcp/console',l=['log','warn','error','info','debug'];l.forEach(function(n){var o=console[n].bind(console);console[n]=function(){o.apply(console,arguments);try{var a=Array.from(arguments).map(function(x){try{return JSON.parse(JSON.stringify(x))}catch{return String(x)}});fetch(e,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({level:n,args:a,ts:Date.now()}),keepalive:true}).catch(function(){})}catch{}}})})();`;\n11: \n12: /** Returns the console log capture tool (dev-only). */\n13: export function consoleLogTool(): McpTool {\n14:   return {\n15:     name: 'get_console_logs',\n16:     description:\n17:       'Returns browser console logs captured from the running page (requires /mcp/console.js).',\n18:     inputSchema: {\n19:       type: 'object',\n20:       properties: {\n21:         level: {\n22:           type: 'string',\n23:           description: 'Filter by level: log | warn | error | info | debug',\n24:         },\n25:         limit: {\n26:           type: 'number',\n27:           description: 'Max entries to return (default 50)',\n28:         },\n29:       },\n30:     },\n31:     execute({ level, limit }) {\n32:       const lvl = level ? String(level) : null;\n33:       const lim = typeof limit === 'number' ? limit : 50;\n34:       const filtered = lvl\n35:         ? consoleLogs.filter(e => e.level === lvl)\n36:         : consoleLogs;\n37:       return filtered.slice(-lim);\n38:     },\n39:   };\n40: }\n41: \n42: /** Route handler that receives log entries POSTed by the browser script. */\n43: export async function consoleIngestHandler(req: Request): Promise<Response> {\n44:   if (req.method !== 'POST') return new Response(null, { status: 405 });\n45:   try {\n46:     const entry = (await req.json()) as {\n47:       level: string;\n48:       args: unknown[];\n49:       ts: number;\n50:     };\n51:     consoleLogs.push(entry);\n52:     if (consoleLogs.length > MAX_LOGS) consoleLogs.shift();\n53:   } catch {}\n54:   return new Response(null, { status: 202 });\n55: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/mcp/src/console.ts"
}
```

**Tool Result:** `toolu_vrtx_014QYXh9V2fVVM9sLQw7gdL3`

```
{
  "content": "1: import type { ManicPlugin, ManicServerPluginContext } from 'manicjs/config';\n2: \n3: /**\n4:  * Configuration options for API documentation\n5:  * @interface ApiDocsOptions\n6:  */\n7: export interface ApiDocsOptions {\n8:   /** Path to mount the docs UI (default: \"/docs\") */\n9:   path?: string;\n10:   /** OpenAPI spec URL (default: \"/openapi.json\") */\n11:   specUrl?: string;\n12:   /** Scalar theme (default: \"default\") */\n13:   theme?: string;\n14: }\n15: \n16: /**\n17:  * Creates an API documentation plugin using Scalar.\n18:  *\n19:  * Mounts an interactive API reference UI at /docs (or custom path).\n20:  * Loads the OpenAPI spec from the specified URL.\n21:  *\n22:  * @param options - API documentation options\n23:  * @returns ManicPlugin for API docs\n24:  *\n25:  * @example\n26:  * import { apiDocs } from '@manicjs/api-docs';\n27:  *\n28:  * apiDocs({\n29:  *   path: '/docs',\n30:  *   specUrl: '/openapi.json',\n31:  *   theme: 'modern',\n32:  * })\n33:  */\n34: export function apiDocs(options: ApiDocsOptions = {}): ManicPlugin {\n35:   const docsPath = options.path ?? '/docs';\n36:   const specUrl = options.specUrl ?? '/openapi.json';\n37: \n38:   return {\n39:     name: '@manicjs/api-docs',\n40: \n41:     async configureServer(ctx: ManicServerPluginContext) {\n42:       const { Hono } = await import('hono');\n43:       const { apiReference } = await import('@scalar/hono-api-reference');\n44: \n45:       const app = new Hono();\n46:       app.get(\n47:         docsPath,\n48:         apiReference({ spec: { url: specUrl }, theme: options.theme as any })\n49:       );\n50: \n51:       ctx.addRoute(docsPath, req => app.fetch(req));\n52:       ctx.addRoute(`${docsPath}/*`, req => app.fetch(req));\n53:     },\n54:   };\n55: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/api-docs/src/index.ts"
}
```

## Assistant

Now let me also read the remaining docs - API reference docs, core docs, and other framework docs to cross-reference:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/config.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/plugins.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/theme.mdx"
}
```

## User

**Tool Result:** `toolu_vrtx_01VNj58dRSJAB5TjUuoQgNvi`

```
{
  "content": "1: ---\n2: title: Configuration\n3: description: Full technical specification for manic.config.ts with TypeTable definitions.\n4: ---\n5: \n6: # Configuration Reference\n7: \n8: <Callout type=\"info\" title=\"TL;DR\">\n9: \n10: Complete reference for `manic.config.ts` - covers all configuration options with full TypeScript type definitions.\n11: \n12: </Callout>\n13: The `manic.config.ts` file (or `.js`) is the source of truth for your application's build and runtime behavior. Use the `defineConfig` helper to ensure full type safety.\n14: \n15: ```ts twoslash\n16: import React from 'react';\n17: import { defineConfig } from 'manicjs/config';\n18: \n19: export default defineConfig({\n20:   mode: 'fullstack',\n21:   app: {\n22:     name: 'My Manic App',\n23:   },\n24:   server: {\n25:     port: 3000,\n26:   },\n27: });\n28: ```\n29: \n30: ---\n31: \n32: ## Top-Level Options\n33: \n34: <TypeTable\n35:   type={{\n36:     mode: {\n37:       type: \"'fullstack' | 'frontend'\",\n38:       default: \"'fullstack'\",\n39:       description: \"'fullstack' includes Hono API support. 'frontend' is SPA only.\",\n40:     },\n41:     app: {\n42:       type: \"AppConfig\",\n43:       default: \"{}\",\n44:       description: \"Application-level metadata.\",\n45:     },\n46:     server: {\n47:       type: \"ServerConfig\",\n48:       default: \"{}\",\n49:       description: \"Development and runtime server settings.\",\n50:     },\n51:     router: {\n52:       type: \"RouterConfig\",\n53:       default: \"{}\",\n54:       description: \"Client-side navigation settings.\",\n55:     },\n56:     build: {\n57:       type: \"BuildConfig\",\n58:       default: \"{}\",\n59:       description: \"Production optimization settings.\",\n60:     },\n61:     providers: {\n62:       type: \"ManicProvider[]\",\n63:       default: \"[]\",\n64:       description: \"Deployment adapters (Vercel, Cloudflare, etc.).\",\n65:     },\n66:   }}\n67: />\n68: \n69: ---\n70: \n71: ## `app` Settings\n72: \n73: <TypeTable\n74:   type={{\n75:     name: {\n76:       type: \"string\",\n77:       description: \"The title of your application, injected into the <title> tag of the built HTML.\",\n78:     },\n79:   }}\n80: />\n81: \n82: ## `server` Settings\n83: \n84: <TypeTable\n85:   type={{\n86:     port: {\n87:       type: \"number\",\n88:       default: \"6070\",\n89:       description: \"The port the server binds to.\",\n90:     },\n91:     hmr: {\n92:       type: \"boolean\",\n93:       default: \"true\",\n94:       description: \"Toggle React Fast Refresh in development.\",\n95:     },\n96:   }}\n97: />\n98: \n99: ## `router` Settings\n100: \n101: <TypeTable\n102:   type={{\n103:     viewTransitions: {\n104:       type: \"boolean\",\n105:       default: \"true\",\n106:       description: \"Enable the native browser View Transitions API.\",\n107:     },\n108:     preserveScroll: {\n109:       type: \"boolean\",\n110:       default: \"false\",\n111:       description: \"If true, the router will not reset scroll to top on navigation.\",\n112:     },\n113:     scrollBehavior: {\n114:       type: \"'auto' | 'smooth'\",\n115:       default: \"'auto'\",\n116:       description: \"The CSS scroll behavior for navigation.\",\n117:     },\n118:   }}\n119: />\n120: \n121: ## `build` Settings\n122: \n123: <TypeTable\n124:   type={{\n125:     outdir: {\n126:       type: \"string\",\n127:       default: \"'.manic'\",\n128:       description: \"The directory for build artifacts.\",\n129:     },\n130:     minify: {\n131:       type: \"boolean\",\n132:       default: \"true\",\n133:       description: \"Toggle OXC-Minify for production builds.\",\n134:     },\n135:     splitting: {\n136:       type: \"boolean\",\n137:       default: \"true\",\n138:       description: \"Enable greedy code-splitting for route chunks.\",\n139:     },\n140:     sourcemap: {\n141:       type: \"boolean | 'inline' | 'external'\",\n142:       default: \"'inline'\",\n143:       description: \"Source map generation strategy.\",\n144:     },\n145:   }}\n146: />\n147: \n148: ---\n149: \n150: ## Sitemap Configuration\n151: \n152: Manic can automatically generate a `sitemap.xml` for your application.\n153: \n154: ```ts\n155: sitemap: {\n156:   hostname: 'https://example.com',\n157:   exclude: ['/admin/**'],\n158:   changefreq: 'daily',\n159:   priority: 0.7\n160: }\n161: ```",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/config.mdx"
}
```

**Tool Result:** `toolu_vrtx_018yQKf66QZw5R83xBwZQxGa`

```
{
  "content": "1: ---\n2: title: Plugins\n3: description: Full reference for the Manic Plugin API and development lifecycle.\n4: ---\n5: \n6: # Plugins Reference\n7: \n8: Plugins are the primary way to extend Manic's functionality. They allow you to hook into the development server, customize the build pipeline, and inject assets into the built application.\n9: \n10: ## `createPlugin`\n11: \n12: The `createPlugin` helper simplifies plugin development by providing a unified interface for both development and production environments.\n13: \n14: ```ts twoslash\n15: //\n16: import { createPlugin } from 'manicjs/config';\n17: \n18: // Conceptual helper\n19: const generateSitemap = (routes: any[]) => '<xml></xml>';\n20: \n21: export const sitemapPlugin = (options: { enabled?: boolean }) => {\n22:   return createPlugin({\n23:     name: 'manic-plugin-sitemap',\n24:     \n25:     // Automatic dev/prod parity for static files\n26:     staticFiles: [\n27:       {\n28:         path: '/sitemap.xml',\n29:         content: (ctx) => generateSitemap(ctx.pageRoutes),\n30:         contentType: 'application/xml',\n31:       },\n32:     ],\n33: \n34:     configureServer(ctx) {\n35:       // Dev-only hooks\n36:       ctx.injectHtml('<meta name=\"sitemap-plugin\" content=\"enabled\">');\n37:     },\n38: \n39:     build(ctx) {\n40:       // Build-only hooks\n41:       ctx.injectHtml('<style>.sitemap-link { color: red; }</style>');\n42:     }\n43:   });\n44: };\n45: ```\n46: \n47: ---\n48: \n49: ## Technical Specification\n50: \n51: ### `ManicPlugin` Interface\n52: \n53: <TypeTable\n54:   type={{\n55:     name: {\n56:       type: \"string\",\n57:       description: \"Unique identifier for the plugin.\",\n58:     },\n59:     preload: {\n60:       type: \"string\",\n61:       description: \"Absolute path to a Bun plugin script to preload.\",\n62:     },\n63:     bunfig: {\n64:       type: \"string\",\n65:       description: \"TOML snippet to merge into bunfig.toml during dev.\",\n66:     },\n67:     configureServer: {\n68:       type: \"(ctx: ManicServerPluginContext) => void | Promise<void>\",\n69:       description: \"Runtime hook for the development server.\",\n70:     },\n71:     build: {\n72:       type: \"(ctx: ManicBuildPluginContext) => void | Promise<void>\",\n73:       description: \"Build-time hook for production packaging.\",\n74:     },\n75:   }}\n76: />\n77: \n78: ---\n79: \n80: ## Context APIs\n81: \n82: Both `configureServer` and `build` hooks receive a context object that provides access to the project's state.\n83: \n84: ### `ManicPluginContext` (Shared)\n85: \n86: <TypeTable\n87:   type={{\n88:     config: {\n89:       type: \"ManicConfig\",\n90:       description: \"The full merged ManicConfig object.\",\n91:     },\n92:     pageRoutes: {\n93:       type: \"PageRoute[]\",\n94:       description: \"Array of discovered page routes.\",\n95:     },\n96:     apiRoutes: {\n97:       type: \"ApiRoute[]\",\n98:       description: \"Array of discovered API routes.\",\n99:     },\n100:     prod: {\n101:       type: \"boolean\",\n102:       description: \"Boolean indicating if the environment is production.\",\n103:     },\n104:   }}\n105: />\n106: \n107: ### `ManicServerPluginContext` (Server Only)\n108: \n109: <TypeTable\n110:   type={{\n111:     addRoute: {\n112:       type: \"(path: string, handler: Handler) => void\",\n113:       description: \"Register a Hono route on the dev server.\",\n114:     },\n115:     addLinkHeader: {\n116:       type: \"(value: string) => void\",\n117:       description: \"Injects a Link header into responses.\",\n118:     },\n119:     injectHtml: {\n120:       type: \"(tags: string) => void\",\n121:       description: \"Appends HTML to the <head> of served pages.\",\n122:     },\n123:   }}\n124: />\n125: \n126: ### `ManicBuildPluginContext` (Build Only)\n127: \n128: <TypeTable\n129:   type={{\n130:     emitClientFile: {\n131:       type: \"(path: string, content: string) => void\",\n132:       description: \"Writes a static asset to the client output.\",\n133:     },\n134:     injectHtml: {\n135:       type: \"(tags: string) => void\",\n136:       description: \"Appends HTML to the <head> of the built index.html.\",\n137:     },\n138:   }}\n139: />\n140: \n141: ---\n142: \n143: ## Best Practices\n144: \n145: <Callout type=\"info\">\n146: \n147: **Production Parity**: If you register a route in `configureServer` using `addRoute`, make sure to also emit the same content in a `build` hook (or use the `staticFiles` shorthand) so your application behaves identically in production and development.\n148: \n149: </Callout>\n150: <Callout type=\"info\">\n151: \n152: Use the `staticFiles` shorthand in `createPlugin` whenever possible. It handles the dev/prod parity logic for you automatically.\n153: \n154: </Callout>",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/plugins.mdx"
}
```

**Tool Result:** `toolu_vrtx_01V5kiHvEQynbteLHttd6frT`

```
{
  "content": "1: ---\n2: title: Theme\n3: description: Dark mode, theme toggling, and CSS variables in Manic.\n4: ---\n5: \n6: # Theme\n7: \n8: Manic provides built-in theme support for dark/light mode with system preference detection.\n9: \n10: ## Quick Start\n11: \n12: ### Wrap Your App\n13: \n14: ```tsx\n15: // app/main.tsx\n16: import { ThemeProvider } from 'manicjs';\n17: import { App } from './App';\n18: \n19: export default function Root() {\n20:   return (\n21:     <ThemeProvider>\n22:       <App />\n23:     </ThemeProvider>\n24:   );\n25: }\n26: ```\n27: \n28: ### Use in Component\n29: \n30: ```tsx\n31: // app/routes/index.tsx\n32: import { useTheme, ThemeToggle } from 'manicjs';\n33: \n34: export default function Home() {\n35:   const { theme, isDark, toggle } = useTheme();\n36:   \n37:   return (\n38:     <div className={isDark ? 'dark' : 'light'}>\n39:       <p>Current: {theme}</p>\n40:       <button onClick={toggle}>Toggle</button>\n41:       <ThemeToggle />\n42:     </div>\n43:   );\n44: }\n45: ```\n46: \n47: ## `useTheme()`\n48: \n49: Access the current theme state and controls:\n50: \n51: ```ts\n52: const { \n53:   theme,           // 'light' | 'dark' | 'system'\n54:   setTheme,       // (theme: Theme) => void\n55:   toggle,        // () => void\n56:   isDark,        // boolean\n57:   isLight,       // boolean\n58:   resolvedTheme  // 'light' | 'dark' (resolved)\n59: } = useTheme();\n60: ```\n61: \n62: ### Theme Type\n63: \n64: <TypeTable\n65:   type={{\n66:     theme: {\n67:       type: \"'light' | 'dark' | 'system'\",\n68:       description: 'User preference setting',\n69:     },\n70:     resolvedTheme: {\n71:       type: \"'light' | 'dark'\",\n72:       description: 'Actual applied theme after resolving system',\n73:     },\n74:     isDark: {\n75:       type: 'boolean',\n76:       description: 'True if resolved theme is dark',\n77:     },\n78:     isLight: {\n79:       type: 'boolean',\n80:       description: 'True if resolved theme is light',\n81:     },\n82:   }}\n83: />\n84: \n85: ## `<ThemeToggle />`\n86: \n87: A pre-built toggle button component:\n88: \n89: ```tsx\n90: import { ThemeToggle } from 'manicjs';\n91: \n92: // Default\n93: <ThemeToggle />\n94: \n95: // With custom styling\n96: <ThemeToggle \n97:   className=\"my-toggle\"\n98:   style={{ borderRadius: '8px' }}\n99: />\n100: \n101: // With custom icons\n102: <ThemeToggle>\n103:   <span slot=\"light\">☀️</span>\n104:   <span slot=\"dark\">🌙</span>\n105: </ThemeToggle>\n106: ```\n107: \n108: ### Props\n109: \n110: <TypeTable\n111:   type={{\n112:     className: {\n113:       type: 'string',\n114:       description: 'CSS class name',\n115:     },\n116:     style: {\n117:       type: 'CSSProperties',\n118:       description: 'Inline styles',\n119:     },\n120:     children: {\n121:       type: 'ReactNode',\n122:       description: 'Custom toggle content with slots',\n123:     },\n124:   }}\n125: />\n126: \n127: ## CSS Variables\n128: \n129: Manic sets CSS variables on the `html` element:\n130: \n131: ```css\n132: :root {\n133:   --manic-theme: light;\n134:   --manic-is-dark: 0;\n135: }\n136: \n137: :root.dark {\n138:   --manic-theme: dark;\n139:   --manic-is-dark: 1;\n140: }\n141: ```\n142: \n143: ### Using in Tailwind\n144: \n145: ```css\n146: /* tailwind.config.js */\n147: export default {\n148:   darkMode: 'class',\n149:   darkClass: 'dark',\n150: }\n151: ```\n152: \n153: ```tsx\n154: // In components\n155: <div className={isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>\n156:   Content\n157: </div>\n158: ```\n159: \n160: ## Programmatic Control\n161: \n162: ```tsx\n163: function ThemeSwitch() {\n164:   const { theme, setTheme } = useTheme();\n165:   \n166:   return (\n167:     <select \n168:       value={theme}\n169:       onChange={(e) => setTheme(e.target.value as Theme)}\n170:     >\n171:       <option value=\"light\">Light</option>\n172:       <option value=\"dark\">Dark</option>\n173:       <option value=\"system\">System</option>\n174:     </select>\n175:   );\n176: }\n177: ```\n178: \n179: ## Persistence\n180: \n181: Theme preference is stored in `localStorage` under `manic-theme` key.\n182: \n183: ## See Also\n184: \n185: - [Environment Variables](/docs/framework/advanced/environment-variables) - Theme config\n186: - [Getting Started](/docs/framework/getting-started) - Basic setup",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/api/theme.mdx"
}
```

## Assistant

Now let me check the actual core framework code to see what's actually implemented for theme, config, etc.:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages/manic/src"
}
```

**Tool Use:** `finder`

```json
{
  "query": "Find the theme implementation in packages/manic/src/theme/ — look for useTheme, ThemeProvider, ThemeToggle, isDark, setTheme, toggle functions/components. Return file paths and line numbers."
}
```

**Tool Use:** `finder`

```json
{
  "query": "Find the ManicPlugin interface, createPlugin function, and ManicServerPluginContext/ManicBuildPluginContext types in packages/manic/src/config/. Return file paths and exact interface definitions."
}
```

## User

**Tool Result:** `toolu_vrtx_016ymbSnT4oUr3nqziZ3CoLP`

```
{
  "content": "cli/\ncomponents/\nconfig/\nenv/\nplugins/\nrouter/\nserver/\ntheme/\ntransitions/",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages/manic/src",
  "directoryEntries": [
    "cli/",
    "components/",
    "config/",
    "env/",
    "plugins/",
    "router/",
    "server/",
    "theme/",
    "transitions/"
  ]
}
```

**Tool Result:** `toolu_vrtx_014aVB3gwmecqe6GrUKcMXfN`

```
The theme implementation is consolidated in a single file within the `packages/manic/src/theme/` directory, providing a React context, provider, and toggle component.

Relevant files:
- [packages/manic/src/theme/index.ts#L25-L33](file:///Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts#L25-L33) - Theme interface and context type (setTheme, toggle, isDark)
- [packages/manic/src/theme/index.ts#L85-L128](file:///Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts#L85-L128) - ThemeProvider implementation, setTheme, and toggle logic
- [packages/manic/src/theme/index.ts#L130-L136](file:///Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts#L130-L136) - useTheme hook
- [packages/manic/src/theme/index.ts#L144-L163](file:///Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts#L144-L163) - ThemeToggle component implementation
```

**Tool Result:** `toolu_vrtx_01KuPNS6QhP5p7YpoMeXY1c2`

```
The Manic plugin system is defined in `packages/manic/src/config/index.ts`. It includes the core `ManicPlugin` interface, specific context types for server and build steps, and the `createPlugin` helper function.

### Relevant files:
- [packages/manic/src/config/index.ts#L59-L68](file:///Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts#L59-L68) — **ManicServerPluginContext**
- [packages/manic/src/config/index.ts#L71-L78](file:///Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts#L71-L78) — **ManicBuildPluginContext**
- [packages/manic/src/config/index.ts#L81-L94](file:///Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts#L81-L94) — **ManicPlugin**
- [packages/manic/src/config/index.ts#L186-L233](file:///Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts#L186-L233) — **createPlugin** function

```typescript
// ManicServerPluginContext
export interface ManicServerPluginContext extends ManicPluginContext {
  addRoute(path: string, handler: (req: Request) => Response | Promise<Response>): void;
  addLinkHeader(value: string): void;
  injectHtml(tags: string): void;
}

// ManicBuildPluginContext
export interface ManicBuildPluginContext extends ManicPluginContext {
  emitClientFile(relativePath: string, content: string | Uint8Array): Promise<void>;
  injectHtml(tags: string): void;
}

// ManicPlugin
export interface ManicPlugin {
  name: string;
  preload?: string;
  bunfig?: string;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}

// createPlugin
export function createPlugin(options: {
  name: string;
  preload?: string;
  bunfig?: string;
  staticFiles?: Array<{
    path: string;
    content: string | ((ctx: ManicPluginContext) => string | Promise<string>);
    contentType?: string;
  }>;
  configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;
  build?(ctx: ManicBuildPluginContext): void | Promise<void>;
}): ManicPlugin { ... }
```
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages/manic/index.ts"
}
```

## User

**Tool Result:** `toolu_vrtx_01HPCYPVa3ZnmSsQQ3Jhuh8g`

```
{
  "content": "1: import {\n2:   useState,\n3:   useEffect,\n4:   useCallback,\n5:   createElement,\n6:   createContext,\n7:   useContext,\n8:   type ReactNode,\n9: } from 'react';\n10: \n11: /** Theme mode: light, dark, or follow system preference */\n12: type Theme = 'light' | 'dark' | 'system';\n13: \n14: /** LocalStorage key for persisting theme preference */\n15: const STORAGE_KEY = 'manic-theme';\n16: \n17: /**\n18:  * Context value for theme state and actions\n19:  * @interface ThemeContextValue\n20:  */\n21: interface ThemeContextValue {\n22:   /** Current theme setting */\n23:   theme: Theme;\n24:   /** Resolved theme (light/dark after resolving 'system') */\n25:   resolvedTheme: 'light' | 'dark';\n26:   /** Set the theme */\n27:   setTheme: (theme: Theme) => void;\n28:   /** Toggle between light and dark */\n29:   toggle: () => void;\n30:   /** Whether dark mode is active */\n31:   isDark: boolean;\n32:   /** Whether light mode is active */\n33:   isLight: boolean;\n34: }\n35: \n36: /** React context for theme state - use useTheme() to access */\n37: const ThemeContext = createContext<ThemeContextValue | null>(null);\n38: \n39: /**\n40:  * Gets the system's color scheme preference\n41:  * @returns 'light' or 'dark' based on system settings\n42:  * @internal\n43:  */\n44: function getSystemTheme(): 'light' | 'dark' {\n45:   if (typeof window === 'undefined') return 'light';\n46:   return window.matchMedia('(prefers-color-scheme: dark)').matches\n47:     ? 'dark'\n48:     : 'light';\n49: }\n50: \n51: function getStoredTheme(): Theme {\n52:   if (typeof window === 'undefined') return 'system';\n53:   return (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';\n54: }\n55: \n56: function applyTheme(theme: Theme) {\n57:   if (typeof document === 'undefined') return;\n58: \n59:   const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;\n60:   const root = document.documentElement;\n61: \n62:   if (resolvedTheme === 'dark') {\n63:     root.classList.add('dark');\n64:   } else {\n65:     root.classList.remove('dark');\n66:   }\n67: }\n68: \n69: /**\n70:  * Theme provider component that manages light/dark/system theme.\n71:  * Wraps your app to provide theme context to all child components.\n72:  * Adds 'dark' class to <html> element when dark mode is active.\n73:  *\n74:  * @param props - Component props\n75:  * @param props.children - Child components that need theme access\n76:  * @returns React element with theme context\n77:  *\n78:  * @example\n79:  * import { ThemeProvider } from 'manicjs/theme';\n80:  *\n81:  * <ThemeProvider>\n82:  *   <App />\n83:  * </ThemeProvider>\n84:  */\n85: export function ThemeProvider({ children }: { children: ReactNode }) {\n86:   const [theme, setThemeState] = useState<Theme>(getStoredTheme);\n87:   const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>\n88:     theme === 'system' ? getSystemTheme() : theme\n89:   );\n90: \n91:   const setTheme = useCallback((newTheme: Theme) => {\n92:     setThemeState(newTheme);\n93:     localStorage.setItem(STORAGE_KEY, newTheme);\n94:     applyTheme(newTheme);\n95:     setResolvedTheme(newTheme === 'system' ? getSystemTheme() : newTheme);\n96:   }, []);\n97: \n98:   const toggle = useCallback(() => {\n99:     const next = resolvedTheme === 'dark' ? 'light' : 'dark';\n100:     setTheme(next);\n101:   }, [resolvedTheme, setTheme]);\n102: \n103:   useEffect(() => {\n104:     applyTheme(theme);\n105: \n106:     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');\n107:     const handleChange = () => {\n108:       if (theme === 'system') {\n109:         applyTheme('system');\n110:         setResolvedTheme(getSystemTheme());\n111:       }\n112:     };\n113: \n114:     mediaQuery.addEventListener('change', handleChange);\n115:     return () => mediaQuery.removeEventListener('change', handleChange);\n116:   }, [theme]);\n117: \n118:   const value: ThemeContextValue = {\n119:     theme,\n120:     resolvedTheme,\n121:     setTheme,\n122:     toggle,\n123:     isDark: resolvedTheme === 'dark',\n124:     isLight: resolvedTheme === 'light',\n125:   };\n126: \n127:   return createElement(ThemeContext.Provider, { value }, children);\n128: }\n129: \n130: export function useTheme(): ThemeContextValue {\n131:   const context = useContext(ThemeContext);\n132:   if (!context) {\n133:     throw new Error('useTheme must be used within a ThemeProvider');\n134:   }\n135:   return context;\n136: }\n137: \n138: export interface ThemeToggleProps {\n139:   className?: string;\n140:   style?: React.CSSProperties;\n141:   children?: ReactNode | ((theme: 'light' | 'dark') => ReactNode);\n142: }\n143: \n144: export function ThemeToggle({ className, style, children }: ThemeToggleProps) {\n145:   const { toggle, isDark, resolvedTheme } = useTheme();\n146: \n147:   const content =\n148:     typeof children === 'function' ? children(resolvedTheme) : children;\n149: \n150:   return createElement(\n151:     'button',\n152:     {\n153:       onClick: toggle,\n154:       className,\n155:       style,\n156:       'aria-label': isDark ? 'Switch to light mode' : 'Switch to dark mode',\n157:     },\n158:     content || (isDark ? '☀️' : '🌙')\n159:   );\n160: }\n161: \n162: export function initTheme() {\n163:   if (typeof window === 'undefined') return;\n164:   applyTheme(getStoredTheme());\n165: }\n166: \n167: if (typeof window !== 'undefined') {\n168:   initTheme();\n169: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages/manic/src/theme/index.ts"
}
```

**Tool Result:** `toolu_vrtx_018UDdAzqZNA34tWFUwMhpBH`

```
{
  "content": "1: /** Deployment provider interface (Vercel, Cloudflare, Netlify, etc.) */\n2: export interface ManicProvider {\n3:   name: string;\n4:   build(context: BuildContext): Promise<void>;\n5: }\n6: \n7: /** Context passed to deployment provider build functions */\n8: export interface BuildContext {\n9:   dist: string;\n10:   config: ManicConfig;\n11:   apiEntries: string[];\n12:   clientDir: string;\n13:   serverFile: string;\n14: }\n15: \n16: /** Sitemap auto-generation configuration */\n17: export interface SitemapConfig {\n18:   /** Base URL for the site (e.g. \"https://example.com\") */\n19:   hostname: string;\n20:   /** How frequently pages change @default \"weekly\" */\n21:   changefreq?:\n22:     | 'always'\n23:     | 'hourly'\n24:     | 'daily'\n25:     | 'weekly'\n26:     | 'monthly'\n27:     | 'yearly'\n28:     | 'never';\n29:   /** Priority of URLs relative to other URLs on the site @default 0.8 */\n30:   priority?: number;\n31:   /** Route paths to exclude from the sitemap */\n32:   exclude?: string[];\n33: }\n34: \n35: /** Route info for page routes */\n36: export interface PageRoute {\n37:   path: string;\n38:   filePath: string;\n39:   dynamic: boolean;\n40: }\n41: \n42: /** Route info for API routes */\n43: export interface ApiRoute {\n44:   mountPath: string;\n45:   filePath: string;\n46: }\n47: \n48: /** Context passed to plugins */\n49: export interface ManicPluginContext {\n50:   config: ManicConfig;\n51:   pageRoutes: PageRoute[];\n52:   apiRoutes: ApiRoute[];\n53:   prod: boolean;\n54:   cwd: string;\n55:   dist: string;\n56: }\n57: \n58: /** Extended context for server plugins */\n59: export interface ManicServerPluginContext extends ManicPluginContext {\n60:   addRoute(\n61:     path: string,\n62:     handler: (req: Request) => Response | Promise<Response>\n63:   ): void;\n64:   /** Add a Link header to all HTML page responses (RFC 8288) */\n65:   addLinkHeader(value: string): void;\n66:   /** Inject HTML tags (e.g. <meta>) into the <head> of every served HTML page */\n67:   injectHtml(tags: string): void;\n68: }\n69: \n70: /** Extended context for build plugins */\n71: export interface ManicBuildPluginContext extends ManicPluginContext {\n72:   emitClientFile(\n73:     relativePath: string,\n74:     content: string | Uint8Array\n75:   ): Promise<void>;\n76:   /** Inject HTML tags (e.g. <meta>) into the <head> of the built index.html */\n77:   injectHtml(tags: string): void;\n78: }\n79: \n80: /** Plugin interface for extending Manic */\n81: export interface ManicPlugin {\n82:   name: string;\n83:   /**\n84:    * Absolute path to a Bun plugin script to preload during dev and build.\n85:    */\n86:   preload?: string;\n87:   /**\n88:    * TOML snippet to append to bunfig.toml during dev (e.g. [serve.static] entries).\n89:    * The dev command collects these and writes them automatically.\n90:    */\n91:   bunfig?: string;\n92:   configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;\n93:   build?(ctx: ManicBuildPluginContext): void | Promise<void>;\n94: }\n95: \n96: /** Main configuration object for a Manic application */\n97: export interface ManicConfig {\n98:   /** Server mode — \"fullstack\" includes Hono API support, \"frontend\" is pure SPA @default \"fullstack\" */\n99:   mode?: 'fullstack' | 'frontend';\n100: \n101:   app?: {\n102:     /** Application name, shown in browser title */\n103:     name?: string;\n104:   };\n105: \n106:   server?: {\n107:     /** Port to run the dev/prod server on @default 6070 */\n108:     port?: number;\n109:     /** Enable HMR in development @default true */\n110:     hmr?: boolean;\n111:   };\n112: \n113:   router?: {\n114:     /** Enable View Transitions API for client-side navigation @default true */\n115:     viewTransitions?: boolean;\n116:     /** Preserve scroll position on navigation @default false */\n117:     preserveScroll?: boolean;\n118:     /** Scroll behavior when navigating @default \"auto\" */\n119:     scrollBehavior?: 'auto' | 'smooth';\n120:   };\n121: \n122:   build?: {\n123:     /** Minify production bundles @default true */\n124:     minify?: boolean;\n125:     /** Generate sourcemaps @default \"inline\" */\n126:     sourcemap?: boolean | 'inline' | 'external';\n127:     /** Enable code splitting @default true */\n128:     splitting?: boolean;\n129:     /** Output directory for production builds @default \".manic\" */\n130:     outdir?: string;\n131:   };\n132: \n133:   /** Sitemap generation config, or false to disable */\n134:   sitemap?: SitemapConfig | false;\n135: \n136:   /** Custom OXC transform settings */\n137:   oxc?: {\n138:     /** Target ES version @default \"esnext\" in dev, \"es2022\" in prod */\n139:     target?: string;\n140:     /** Replace import extensions like .ts to .js @default true */\n141:     rewriteImportExtensions?: boolean;\n142:     /** Use React Fast Refresh @default true in dev */\n143:     refresh?: boolean;\n144:   };\n145: \n146:   /** Deployment providers (Vercel, Cloudflare, Netlify) */\n147:   providers?: ManicProvider[];\n148: \n149:   /** Plugins for extending Manic */\n150:   plugins?: ManicPlugin[];\n151: }\n152: \n153: const DEFAULT_CONFIG: ManicConfig = {\n154:   mode: 'fullstack',\n155:   app: { name: 'Manic App' },\n156:   server: { port: 6070, hmr: true },\n157:   router: {\n158:     viewTransitions: true,\n159:     preserveScroll: false,\n160:     scrollBehavior: 'auto',\n161:   },\n162:   build: {\n163:     minify: true,\n164:     sourcemap: 'inline',\n165:     splitting: true,\n166:     outdir: '.manic',\n167:   },\n168:   oxc: {\n169:     target: 'esnext',\n170:     rewriteImportExtensions: true,\n171:     refresh: true,\n172:   },\n173: };\n174: \n175: /** Define a typed Manic configuration — use in manic.config.ts */\n176: export function defineConfig(config: ManicConfig): ManicConfig {\n177:   return config;\n178: }\n179: \n180: /**\n181:  * Helper for authoring plugins. Accepts the same shape as ManicPlugin but\n182:  * provides a `staticFiles` shorthand — an array of { path, content } entries\n183:  * that are automatically served as routes in dev and emitted as client files\n184:  * in production, eliminating the repetitive dev/prod parity boilerplate.\n185:  */\n186: export function createPlugin(options: {\n187:   name: string;\n188:   /** Absolute path to a Bun plugin script — auto-injected as --preload in dev, Bun.plugin() in build */\n189:   preload?: string;\n190:   /** TOML snippet for bunfig.toml — manic dev merges all [serve.static] entries automatically */\n191:   bunfig?: string;\n192:   /** Static files to serve in dev and emit in prod automatically */\n193:   staticFiles?: Array<{\n194:     path: string;\n195:     content:\n196:       | string\n197:       | ((ctx: ManicPluginContext) => string | Promise<string>);\n198:     contentType?: string;\n199:   }>;\n200:   configureServer?(ctx: ManicServerPluginContext): void | Promise<void>;\n201:   build?(ctx: ManicBuildPluginContext): void | Promise<void>;\n202: }): ManicPlugin {\n203:   return {\n204:     name: options.name,\n205:     preload: options.preload,\n206:     bunfig: options.bunfig,\n207: \n208:     async configureServer(ctx) {\n209:       for (const file of options.staticFiles ?? []) {\n210:         const ct = file.contentType ?? 'text/plain; charset=utf-8';\n211:         ctx.addRoute(file.path, async () => {\n212:           const body =\n213:             typeof file.content === 'function'\n214:               ? await file.content(ctx)\n215:               : file.content;\n216:           return new Response(body, { headers: { 'content-type': ct } });\n217:         });\n218:       }\n219:       await options.configureServer?.(ctx);\n220:     },\n221: \n222:     async build(ctx) {\n223:       for (const file of options.staticFiles ?? []) {\n224:         const body =\n225:           typeof file.content === 'function'\n226:             ? await file.content(ctx)\n227:             : file.content;\n228:         await ctx.emitClientFile(file.path.replace(/^\\//, ''), body);\n229:       }\n230:       await options.build?.(ctx);\n231:     },\n232:   };\n233: }\n234: \n235: let cachedConfig: ManicConfig | null = null;\n236: \n237: /** Loads and merges the user's manic.config.ts with defaults */\n238: export async function loadConfig(\n239:   cwd: string = process.cwd()\n240: ): Promise<ManicConfig> {\n241:   if (cachedConfig) return cachedConfig;\n242: \n243:   const configFiles = ['manic.config.ts', 'manic.config.js'];\n244: \n245:   for (const file of configFiles) {\n246:     const configPath = `${cwd}/${file}`;\n247:     const configFile = Bun.file(configPath);\n248: \n249:     if (await configFile.exists()) {\n250:       try {\n251:         const mod = await import(configPath);\n252:         const userConfig = mod.default || mod;\n253: \n254:         cachedConfig = {\n255:           mode: userConfig.mode ?? DEFAULT_CONFIG.mode,\n256:           app: { ...DEFAULT_CONFIG.app, ...userConfig.app },\n257:           server: { ...DEFAULT_CONFIG.server, ...userConfig.server },\n258:           router: { ...DEFAULT_CONFIG.router, ...userConfig.router },\n259:           build: { ...DEFAULT_CONFIG.build, ...userConfig.build },\n260:           sitemap: userConfig.sitemap === false ? false : userConfig.sitemap,\n261:           oxc: { ...DEFAULT_CONFIG.oxc, ...userConfig.oxc },\n262:           providers: userConfig.providers,\n263:           plugins: userConfig.plugins,\n264:         };\n265: \n266:         return cachedConfig;\n267:       } catch (e) {\n268:         console.error(`[Manic] Failed to load config from ${file}:`, e);\n269:       }\n270:     }\n271:   }\n272: \n273:   cachedConfig = DEFAULT_CONFIG;\n274:   return cachedConfig;\n275: }\n276: \n277: /** Returns the cached config — call loadConfig() first */\n278: export function getConfig(): ManicConfig {\n279:   return cachedConfig || DEFAULT_CONFIG;\n280: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages/manic/src/config/index.ts"
}
```

**Tool Result:** `toolu_vrtx_01EuHQEKNBLox7yXF3LuHrq8`

```
{
  "content": "1: export {\n2:   Link,\n3:   navigate,\n4:   Router,\n5:   useRouter,\n6:   useQueryParams,\n7: } from './src/router';\n8: export { NotFound } from './src/components/NotFound/index';\n9: export { ErrorOverlay } from './src/components/ErrorOverlay/index';\n10: export { ServerError } from './src/components/ServerError/index';\n11: export {\n12:   defineConfig,\n13:   loadConfig,\n14:   type ManicConfig,\n15:   type ManicPlugin,\n16:   type ManicPluginContext,\n17:   type ManicServerPluginContext,\n18:   type ManicBuildPluginContext,\n19:   type PageRoute,\n20:   type ApiRoute,\n21: } from './src/config';\n22: export { ThemeProvider, useTheme, ThemeToggle } from './src/theme';\n23: export { ViewTransitions } from './src/transitions';\n24: export { createClient } from './src/config/client';",
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages/manic/index.ts"
}
```

## Assistant

Now I have a comprehensive view. Let me consult the oracle to synthesize all the findings before making changes:

**Tool Use:** `oracle`

```json
{
  "task": "I need a thorough audit of docs vs actual implementation for the Manic framework plugins. Compare each plugin's documentation (what's documented) against what's actually implemented in the source. For each plugin, identify:\n1. Features documented but NOT implemented (need to either implement or remove from docs)\n2. Features implemented but NOT documented (need to add to docs)\n3. Inaccurate documentation (wrong API signatures, wrong option names, etc.)\n\nHere's the summary I've gathered:\n\n**Tailwind plugin (plugins/tailwind/src/index.ts)**:\n- Implementation: `tailwind()` takes NO parameters, just returns bunfig for bun-plugin-tailwind\n- Docs claim: `content`, `darkMode`, `safelist` options exist\n\n**UnoCSS plugin (plugins/unocss/src/index.ts)**:\n- Implementation: `unocss(config?: UserConfig)` accepts optional UserConfig but it's unused (just returns bunfig). Config is read from uno.config.ts\n- Docs claim: inline `presets`, `rules`, `shortcuts`, `theme` options\n\n**MDX plugin (plugins/mdx/src/index.ts + bun-plugin.ts)**:\n- Implementation: Options are `filter`, `frontmatterName`, `disableGfm`, `disableFrontmatter`, `toc`, `highlight`, `remarkPlugins`, `rehypePlugins`, `mdxOptions`\n- Docs claim: `gfm` (boolean, default true), `remarkPlugins`, `rehypePlugins`, `frontmatter` (boolean, default true), `toc` (boolean)\n\n**SEO plugin (plugins/seo/src/index.ts)**:\n- Implementation: SeoConfig has `hostname`, `title`, `description`, `author`, `twitter`, `openGraph`, `rules`, `sitemaps`, `autoSitemap`, `linkHeaders`, `contentSignals`\n- Docs claim: `title`, `titleTemplate`, `description`, `siteName`, `siteUrl`, `twitter`, `openGraph`, `robots`, `canonical`, JSON-LD component, dynamic OG images, per-page metadata via `Metadata` export\n\n**Sitemap plugin (plugins/sitemap/src/index.ts + generate.ts)**:\n- Implementation: SitemapConfig has `hostname`, `changefreq`, `priority`, `exclude`\n- Docs claim: `hostname`, `outDir`, `filename`, `ignoreRoutes`, `extraRoutes`, `lastmod`, `changefreq`, `priority`, `trailingSlash`, plus sitemap index, robots.txt integration, multi-language support\n\n**MCP plugin (plugins/mcp/src/)**:\n- Implementation: McpConfig has `name`, `version`, `path`, `tools` (using defineTool with Zod). Has built-in tools, discovery, console, WebMCP. No resources/prompts/auth support.\n- Docs claim: `enabled`, `route`, `tools`, `resources`, `prompts`, `auth` options. Shows tools with `handler` property instead of `execute`. Shows inline tool definitions without Zod.\n\n**API Docs plugin (plugins/api-docs/src/index.ts)**:\n- Implementation: ApiDocsOptions has `path`, `specUrl`, `theme`\n- Docs claim: `route`, `spec`, `output`, `theme`, `title`, `favicon`, `autoGenerate`, `auth`, `colors`, `enabled`, `generateFile`\n\nPlease give me a prioritized list of what to fix for each plugin.",
  "context": "The user wants me to go plugin by plugin and either implement missing features or fix the docs to match reality. I need to figure out what's feasible to implement vs what should just have docs corrected."
}
```

## User

**Tool Result:** `toolu_vrtx_011tGpi752BN1fxGPJMbJxJx`

```
1) **TL;DR**

Most of these should be **docs fixes, not feature work**. The only implementation changes I’d seriously consider right now are **small MDX compatibility/clarity fixes** and a **UnoCSS API cleanup**; everything else is either already a thin wrapper by design or would require a much bigger product decision than the current docs imply.

---

2) **Recommended approach (simple path)**

## Overall priority

**P0: Fix docs immediately**
1. **SEO**
2. **MCP**
3. **API Docs**
4. **Sitemap**
5. **Tailwind**
6. **UnoCSS**
7. **MDX**

Reason: the first 4 currently promise major features that simply do not exist; Tailwind/UnoCSS mostly document config that is silently ignored; MDX is real but the docs describe the API inaccurately.

## Per-plugin audit

---

### 1. `@manicjs/tailwind` — **docs-only fix**
**Source truth:** `plugins/tailwind/src/index.ts` exports `tailwind(): ManicPlugin` with **no options**. It only injects:

```ts
bunfig: `[serve.static]\nplugins = ["bun-plugin-tailwind"]`
```

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/tailwind.mdx`:
- `content`
- `darkMode`
- `safelist`
- `tailwind({...})` examples

None of those are part of the plugin API.

#### 2) Implemented but not documented
Missing from the docs page:
- It is a **zero-config wrapper** around `bun-plugin-tailwind`
- Customization should happen in:
  - `tailwind.config.ts`, or
  - CSS `@theme` / normal Tailwind CSS config patterns

The package `README.md` already reflects this much better.

#### 3) Inaccurate docs
- The whole **Options** section is fictional.
- Example config with `tailwind({ ... })` is wrong.
- Dark mode guidance is okay as Tailwind usage guidance, but it should **not** be framed as plugin options.

#### Prioritized fix
**P0 (S):** Replace the docs page with the README-level story:
- `tailwind()` takes no options
- Add CSS import
- Configure Tailwind via standard Tailwind files/CSS

#### Implement or remove?
**Remove from docs.**  
Do **not** implement `content/darkMode/safelist` on the Manic wrapper; that would duplicate Tailwind’s own config surface for very little value.

---

### 2. `@manicjs/unocss` — **docs fix + tiny API cleanup**
**Source truth:** `plugins/unocss/src/index.ts` exports:

```ts
export function unocss(config?: UserConfig): ManicPlugin
```

but `config` is **unused**. The plugin just injects `bun-plugin-unocss`; actual config is read from `uno.config.ts`.

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/unocss.mdx`:
- Inline `presets`
- `rules`
- `shortcuts`
- `theme`
- examples using `unocss({ ... })`

These options are not actually wired through.

#### 2) Implemented but not documented
Docs page should say:
- Config lives in **`uno.config.ts`**
- The wrapper’s job is just to register `bun-plugin-unocss`
- It’s effectively **zero-config from Manic’s perspective**

Also, install docs should probably mention `unocss` itself if users want presets/config.

#### 3) Inaccurate docs
- The docs page implies `unocss(config)` works. In practice, that config is ignored.
- Source JSDoc is also slightly misleading because it suggests inline config is meaningful.

#### Prioritized fix
1. **P0 (S):** Rewrite docs page to say: `unocss()` + configure via `uno.config.ts`
2. **P1 (S):** Fix the source API trap:
   - either remove the unused `config` parameter, or
   - keep it but document/guard that inline config is ignored

#### Implement or remove?
**Docs fix preferred.**  
Supporting arbitrary inline Uno config is not a great fit because presets/rules/shortcuts often contain functions and are not trivially serializable into the current wrapper model.

---

### 3. `@manicjs/mdx` — **docs fix, plus one small code polish worth doing**
**Source truth:** `plugins/mdx/src/bun-plugin.ts` supports:
- `filter`
- `frontmatterName`
- `disableGfm`
- `disableFrontmatter`
- `toc`
- `highlight`
- `remarkPlugins`
- `rehypePlugins`
- `mdxOptions`

But `plugins/mdx/src/index.ts` only serializes a subset into env:
- `filter`
- `frontmatterName`
- `disableGfm`
- `disableFrontmatter`
- `toc`
- `highlight`
- `mdxOptions`

So `remarkPlugins` / `rehypePlugins` are supported by `mdxBunPlugin()`, **not by `mdx()` in `manic.config.ts`**.

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/mdx.mdx`:
- `gfm` option name — actual API is `disableGfm`
- `frontmatter` option name — actual API is `disableFrontmatter`
- `remarkPlugins` / `rehypePlugins` as normal `mdx()` options — misleading, because `mdx()` cannot serialize function plugins
- “Code blocks use Shiki by default” — false; `highlight` defaults to `false`
- The `MDX` runtime component example is not provided by this plugin
- TOC usage example is misleading (`import { toc } from '~/toc'`)

#### 2) Implemented but not documented
Should be added to docs:
- `filter`
- `frontmatterName`
- `disableGfm`
- `disableFrontmatter`
- `highlight` (`true` or `{ light, dark }`)
- `mdxOptions`
- `@manicjs/mdx/bun-plugin` escape hatch for custom remark/rehype plugins
- `toc` depends on optional `fumadocs-core`

#### 3) Inaccurate docs
- Wrong option names and defaults
- Wrong highlighting default
- Wrong mental model for custom plugin support through `mdx()`

Also:
- `plugins/mdx/src/index.ts` JSDoc says `import { mdxBunPlugin } from '@manicjs/mdx'`, but package exports it at **`@manicjs/mdx/bun-plugin`**

#### Prioritized fix
1. **P0 (M):** Rewrite docs page around the real API
2. **P0 (M):** Explicitly split:
   - `mdx()` = Manic-friendly, serializable options only
   - `mdxBunPlugin()` from `@manicjs/mdx/bun-plugin` = advanced custom remark/rehype usage
3. **P1 (S):** Fix source JSDoc import path
4. **Optional P1 (S/M):** Add aliases:
   - `gfm` → map to `disableGfm`
   - `frontmatter` → map to `disableFrontmatter`

#### Implement or remove?
- **Docs fix:** `remarkPlugins` / `rehypePlugins` support in `mdx()` should be removed from docs
- **Small implementation worth considering:** add `gfm` and `frontmatter` aliases for ergonomics/compat

---

### 4. `@manicjs/seo` — **docs-only fix**
**Source truth:** `plugins/seo/src/index.ts` supports:
- `hostname` **required**
- `title`
- `description`
- `author`
- `twitter`
- `openGraph`
- `rules`
- `sitemaps`
- `autoSitemap`
- `linkHeaders`
- `contentSignals`

It injects **global meta tags** and serves **`/robots.txt`**. It is **not** a per-page SEO system.

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/seo.mdx`:
- `titleTemplate`
- top-level `siteName`
- `siteUrl`
- `robots` option shape
- `canonical`
- per-page `Metadata` export
- `JsonLd` component
- dynamic OG image support / `ogImage.route`
- page-level metadata system in general

None of that exists.

#### 2) Implemented but not documented
Should be documented clearly:
- `hostname` is required
- `author`
- `rules` for robots.txt
- `sitemaps`
- `autoSitemap`
- `linkHeaders`
- `contentSignals`
- actual `twitter.card/site/creator`
- actual `openGraph.type/locale/image/siteName`

#### 3) Inaccurate docs
- Uses `siteUrl`; actual option is `hostname`
- Uses top-level `siteName`; actual is `openGraph.siteName`
- Uses `twitter.cardType`; actual is `twitter.card`
- Uses `openGraph.fallbackImage`; actual is `openGraph.image`
- Docs imply `<title>` and canonical tags are generated; source only injects meta tags, not canonical links or dynamic title templating

#### Prioritized fix
1. **P0 (M):** Rewrite docs page as a **global robots/meta plugin**
2. **P0 (S):** Remove all per-page/JSON-LD/OG-image/canonical claims
3. **P0 (S):** Update examples to use `hostname`

#### Implement or remove?
**Remove from docs.**  
Implementing the documented feature set would be a **new SEO subsystem**, not a patch.

---

### 5. `@manicjs/sitemap` — **docs-only fix**
**Source truth:** `plugins/sitemap/src/index.ts` supports:
- `hostname` **required**
- `changefreq?`
- `priority?` (number)
- `exclude?`

It emits `/sitemap.xml` from non-dynamic page routes.

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/sitemap.mdx`:
- `outDir`
- `filename`
- `ignoreRoutes`
- `extraRoutes`
- `lastmod`
- `trailingSlash`
- `priority` as boolean auto-calc
- sitemap index / multiple sitemap files
- `robotsTxt`
- multi-language support
- `maxUrlsPerSitemap`
- per-route configs

None of these exist.

#### 2) Implemented but not documented
Docs should emphasize:
- `exclude` is the real option name
- dynamic routes are automatically excluded
- output is always `/sitemap.xml`

#### 3) Inaccurate docs
- Quick start shows `sitemap()` with no `hostname`, but `hostname` is required
- `priority` type is wrong in docs
- `ignoreRoutes` should be `exclude`
- SEO integration example uses `seo({ siteUrl: ... })`, which is also wrong

#### Prioritized fix
1. **P0 (S):** Replace docs page with the README-level API
2. **P0 (S):** Fix examples to require `hostname`
3. **P0 (S):** Remove all advanced sitemap features from docs

#### Implement or remove?
**Remove from docs.**  
Anything beyond the current API is real feature work, not cleanup.

---

### 6. `@manicjs/mcp` — **docs-only fix, plus fix source comments**
**Source truth:** `plugins/mcp/src/index.ts` supports:
- `name`
- `version`
- `path`
- `tools`

Plus real implemented behavior:
- built-in tools
- discovery docs (`/.well-known/...`)
- WebMCP script `/webmcp.js`
- JSON-RPC over Streamable HTTP
- dev console capture routes/tools

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/mcp.mdx`:
- `enabled`
- `route`
- `resources`
- `prompts`
- `auth`

These are not in the implementation.

#### 2) Implemented but not documented
Should be documented:
- built-in tools:
  - `get_routes`
  - `get_api_routes`
  - `get_page_meta`
  - `get_rendered_elements`
  - `get_console_logs` (dev only)
- discovery endpoints
- `/webmcp.js`
- JSON-RPC methods
- Streamable HTTP/SSE behavior
- `defineTool(name, { description, input, execute })` with Zod

#### 3) Inaccurate docs
- `route` should be `path`
- default is `/mcp`, not `/api/mcp`
- tool examples use `handler`; actual interface uses `execute`
- docs focus on raw inline tools; real ergonomic API is `defineTool(...)` with Zod

Also source comments are wrong:
- `plugins/mcp/src/index.ts` JSDoc example uses `defineTool({ ... handler })`
- `plugins/mcp/src/tool.ts` JSDoc also says `handler` instead of `execute`

#### Prioritized fix
1. **P0 (M):** Rewrite docs page from the README/source
2. **P1 (S):** Fix the JSDoc examples in source files
3. **Optional P1 (S):** Add `route` alias to `path` only if you want soft compatibility for old docs

#### Implement or remove?
- **Resources/prompts/auth:** remove from docs
- **JSDoc/API naming fixes:** worth doing

---

### 7. `@manicjs/api-docs` — **docs-only fix**
**Source truth:** `plugins/api-docs/src/index.ts` supports:
- `path`
- `specUrl`
- `theme`

It mounts Scalar UI. The framework/provider layer exposes `/openapi.json`; the plugin itself does not “generate the spec.”

#### 1) Documented but not implemented
In `docs/content/docs/framework/plugins/api-docs.mdx`:
- `route`
- `spec`
- `output`
- `title`
- `favicon`
- `autoGenerate`
- `auth`
- `colors`
- `enabled`
- `generateFile`

None are implemented by the plugin.

#### 2) Implemented but not documented
Should be documented:
- real option names: `path`, `specUrl`, `theme`
- it mounts both `path` and `${path}/*`
- it has **no build hook**
- it depends on framework/provider OpenAPI generation rather than generating specs itself

#### 3) Inaccurate docs
- default route is `/docs`, not `/api/docs`
- manual `spec: {...}` support is not implemented
- docs imply the plugin owns spec generation/output; it does not

#### Prioritized fix
1. **P0 (S):** Replace docs page with README-accurate content
2. **P0 (S):** Clarify separation:
   - Manic/provider generates `/openapi.json`
   - plugin only mounts Scalar UI

#### Implement or remove?
**Remove from docs.**  
The existing plugin is intentionally thin; the documented “full docs platform” is not there.

---

## Cross-cutting docs that also need fixes

These are important because they’ll keep reintroducing confusion even after plugin pages are fixed.

### `docs/content/docs/core/architecture.mdx`
Contains clearly wrong examples:
- imports `defineTool` from `manicjs/config` instead of `defineConfig`
- uses default imports for plugins instead of named imports
- uses fake SEO options (`robots`, `canonical`)
- calls `sitemap()` without required `hostname`

**Priority: P0**

### `docs/content/docs/framework/advanced/plugins.mdx`
Uses default imports like:

```ts
import tailwind from '@manicjs/tailwind';
```

but source exports named functions.

**Priority: P0**

### Source JSDoc drift
- `plugins/mdx/src/index.ts`
- `plugins/mcp/src/index.ts`
- `plugins/mcp/src/tool.ts`

These are smaller, but worth fixing because they can feed generated docs and future drift.

**Priority: P1**

---

3) **Rationale and trade-offs**

The repo shows a clear pattern: several plugins are intentionally **thin adapters** over Bun/plugins/framework hooks, while the docs pages describe a much more full-featured product. Re-implementing docs promises would turn into new subsystem work:
- SEO becomes a metadata framework
- Sitemap becomes a full sitemap engine
- MCP becomes a broader platform with auth/resources/prompts
- API Docs becomes a spec generation/branding/auth product

That’s unnecessary unless those features are actually on the roadmap. The simplest, lowest-risk path is to make docs match the code.

---

4) **Risks and guardrails**

- **Biggest risk:** trying to “catch up” implementation to the docs will sprawl quickly.
- **Guardrail:** only implement small compatibility changes where the code already almost supports them:
  - MDX aliases (`gfm`, `frontmatter`) if desired
  - UnoCSS parameter cleanup
  - MCP/MDX JSDoc corrections
- For everything else, prefer:
  - remove fictional options
  - document actual option names
  - explain where config really lives (`tailwind.config.ts`, `uno.config.ts`, etc.)

---

5) **When to consider the advanced path**

Only revisit implementation if you have a concrete product need such as:
- users explicitly need **page-level SEO metadata**, canonical URLs, or JSON-LD
- users need **extra sitemap entries**, `lastmod`, or i18n sitemap output
- users need **authenticated MCP** or MCP **resources/prompts**
- users need API Docs to accept a **manual spec object** or **custom branding/auth**

If none of those are active requirements, doc alignment is enough.

---

6) **Optional advanced path**

If you do want one small implementation pass beyond doc fixes, I’d choose this order:

1. **MDX aliases + docs cleanup** — **S/M**
   - accept `gfm` and `frontmatter` aliases
   - fix `mdxBunPlugin` import docs
   - clearly document `mdx()` vs `@manicjs/mdx/bun-plugin`

2. **UnoCSS API cleanup** — **S**
   - remove or guard the ignored `config` parameter

Everything else should stay **docs-only** for now.
```

## Assistant

Excellent analysis. This is a massive audit. Let me now systematically fix everything — docs first, then small source fixes. I'll work plugin by plugin, spawning parallel tasks for independent work.

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/advanced/plugins.mdx"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/core/architecture.mdx"
}
```

## User

*(interrupted)*

**Tool Result:** `toolu_vrtx_015gnBtbyEvTXbFDYUKHrKzs`

```
{
  "content": "1: ---\n2: title: Plugins\n3: description: Using official and third-party plugins to extend Manic functionality.\n4: ---\n5: \n6: # Plugins\n7: \n8: <Callout type=\"info\" title=\"TL;DR\">\n9: \n10: Plugins extend Manic with features like Tailwind CSS, MDX, SEO, sitemap, and more. Install from npm and configure in `manic.config.ts`.\n11: \n12: </Callout>\n13: ## What It Is\n14: \n15: Manic plugins add functionality without custom code:\n16: \n17: | Plugin | Purpose | Package |\n18: |--------|----------|---------|\n19: | **Tailwind CSS** | Styling | `@manicjs/tailwind` |\n20: | **UnoCSS** | Styling | `@manicjs/unocss` |\n21: | **MDX** | Markdown + JSX | `@manicjs/mdx` |\n22: | **SEO** | Meta tags | `@manicjs/seo` |\n23: | **Sitemap** | sitemap.xml | `@manicjs/sitemap` |\n24: | **MCP** | AI tools | `@manicjs/mcp` |\n25: | **API Docs** | OpenAPI UI | `@manicjs/api-docs` |\n26: \n27: ---\n28: \n29: ## Prerequisites\n30: \n31: - [Config Reference](/docs/api/config) - Configuration basics\n32: - [Project Structure](/docs/framework/getting-started/project-structure) - File organization\n33: \n34: ---\n35: \n36: ## Quick Start\n37: \n38: ### Install Plugin\n39: \n40: ```bash\n41: bun add @manicjs/tailwind\n42: ```\n43: \n44: ### Configure\n45: \n46: ```ts\n47: // manic.config.ts\n48: import { defineConfig } from 'manicjs/config';\n49: import tailwind from '@manicjs/tailwind';\n50: \n51: export default defineConfig({\n52:   plugins: [tailwind()],\n53: });\n54: ```\n55: \n56: ---\n57: \n58: ## Installation Examples\n59: \n60: ### Tailwind CSS\n61: \n62: ```bash\n63: bun add @manicjs/tailwind\n64: ```\n65: \n66: ```ts\n67: // manic.config.ts\n68: import { defineConfig } from 'manicjs/config';\n69: import tailwind from '@manicjs/tailwind';\n70: \n71: export default defineConfig({\n72:   plugins: [tailwind()],\n73: });\n74: ```\n75: \n76: ### MDX\n77: \n78: ```bash\n79: bun add @manicjs/mdx\n80: ```\n81: \n82: ```ts\n83: // manic.config.ts\n84: import { defineConfig } from 'manicjs/config';\n85: import mdx from '@manicjs/mdx';\n86: \n87: export default defineConfig({\n88:   plugins: [mdx()],\n89: });\n90: ```\n91: \n92: ### Sitemap\n93: \n94: ```bash\n95: bun add @manicjs/sitemap\n96: ```\n97: \n98: ```ts\n99: // manic.config.ts\n100: import { defineConfig } from 'manicjs/config';\n101: import sitemap from '@manicjs/sitemap';\n102: \n103: export default defineConfig({\n104:   plugins: [sitemap()],\n105: });\n106: ```\n107: \n108: ### SEO\n109: \n110: ```bash\n111: bun add @manicjs/seo\n112: ```\n113: \n114: ```ts\n115: // manic.config.ts\n116: import { defineConfig } from 'manicjs/config';\n117: import seo from '@manicjs/seo';\n118: \n119: export default defineConfig({\n120:   plugins: [seo({\n121:     title: 'My App',\n122:     description: 'My awesome app',\n123:     openGraph: {\n124:       images: ['/og-image.png'],\n125:     },\n126:   })],\n127: });\n128: ```\n129: \n130: ### API Docs\n131: \n132: ```bash\n133: bun add @manicjs/api-docs\n134: ```\n135: \n136: ```ts\n137: // manic.config.ts\n138: import { defineConfig } from 'manicjs/config';\n139: import apiDocs from '@manicjs/api-docs';\n140: \n141: export default defineConfig({\n142:   plugins: [apiDocs()],\n143: });\n144: ```\n145: \n146: ---\n147: \n148: ## Plugin Types\n149: \n150: ### ManicPlugin Interface\n151: \n152: ```ts\n153: interface ManicPlugin {\n154:   name: string;\n155: \n156:   // Build-time\n157:   build?: (ctx: ManicPluginContext) => void | Promise<void>;\n158: \n159:   // Dev server\n160:   configureServer?: (ctx: ManicServerPluginContext) => void | Promise<void>;\n161: }\n162: \n163: interface ManicPluginContext {\n164:   pageRoutes: string[];\n165:   apiRoutes: string[];\n166:   dist: string;\n167:   emitClientFile: (path: string, content: string) => void;\n168:   injectHtml: (tags: string) => void;\n169: }\n170: ```\n171: \n172: ### createPlugin Helper\n173: \n174: ```ts\n175: import { createPlugin } from 'manicjs/config';\n176: \n177: const myPlugin = createPlugin({\n178:   name: 'my-plugin',\n179: \n180:   staticFiles: [\n181:     {\n182:       path: '/my-file.txt',\n183:       content: 'Hello World',\n184:     },\n185:   ],\n186: \n187:   build(ctx) {\n188:     ctx.injectHtml('<meta name=\"my-plugin\" content=\"true\">');\n189:   },\n190: });\n191: ```\n192: \n193: ---\n194: \n195: ## Third-Party Plugins\n196: \n197: ### Community Plugins\n198: \n199: Search for Manic plugins:\n200: \n201: ```bash\n202: npm search @manicjs\n203: ```\n204: \n205: ### Using UnoCSS\n206: \n207: ```bash\n208: bun add @manicjs/unocss\n209: ```\n210: \n211: ```ts\n212: // manic.config.ts\n213: import { defineConfig } from 'manicjs/config';\n214: import unocss from '@manicjs/unocss';\n215: \n216: export default defineConfig({\n217:   plugins: [unocss()],\n218: });\n219: ```\n220: \n221: ---\n222: \n223: ## Advanced Patterns\n224: \n225: ### Custom Plugin\n226: \n227: ```ts\n228: // plugins/my-custom-plugin.ts\n229: import { createPlugin, type ManicPlugin } from 'manicjs/config';\n230: \n231: export function myCustomPlugin(options?: { enabled?: boolean }): ManicPlugin {\n232:   return createPlugin({\n233:     name: 'my-custom-plugin',\n234:     enabled: options?.enabled ?? true,\n235: \n236:     build(ctx) {\n237:       if (!options?.enabled) return;\n238: \n239:       // Inject custom styles\n240:       ctx.injectHtml(`\n241:         <style>\n242:           .custom-class { color: red; }\n243:         </style>\n244:       `);\n245: \n246:       // Emit static file\n247:       ctx.emitClientFile('/assets/custom.css', `\n248:         .custom-class { color: blue; }\n249:       `);\n250:     },\n251:   });\n252: }\n253: ```\n254: \n255: ### Plugin Options\n256: \n257: ```ts\n258: // With options\n259: export default defineConfig({\n260:   plugins: [\n261:     seo({\n262:       title: 'My App',\n263:       description: 'Description',\n264:     }),\n265:   ],\n266: });\n267: ```\n268: \n269: ---\n270: \n271: ## Common Issues\n272: \n273: ### Issue 1: Plugin Not Loading\n274: \n275: **Problem:** Plugin not working.\n276: \n277: **Checks:**\n278: 1. Package is installed\n279: 2. Plugin is in `plugins` array\n280: 3. Server restarted\n281: \n282: ### Issue 2: Conflicting Plugins\n283: \n284: **Problem:** Two plugins conflicting.\n285: \n286: **Solution:** Check order or disable one:\n287: \n288: ```ts\n289: export default defineConfig({\n290:   plugins: [\n291:     // Only one styling plugin\n292:     // tailwind() or unocss(), not both\n293:   ],\n294: });\n295: ```\n296: \n297: ---\n298: \n299: ## Best Practices\n300: \n301: <Callout type=\"info\">\n302: \n303: **Use official plugins** — they're tested and maintained.\n304: \n305: </Callout>\n306: <Callout type=\"warn\">\n307:  \n308: **Check plugin compatibility** — ensure plugin works with your Manic version.\n309:  \n310: </Callout>\n311: \n312: <Callout type=\"info\">\n313: \n314: **Configure plugins early** — in manic.config.ts before other options.\n315: \n316: </Callout>\n317: ---\n318: \n319: ## Version History\n320: \n321: | Version | Changes |\n322: |---------|---------|\n323: | v0.12.0 | Added MCP plugin |\n324: | v0.11.0 | Added API Docs plugin |\n325: | v0.10.0 | Added basic plugins |\n326: \n327: ---\n328: \n329: See also:\n330: - [Config Reference](/docs/api/config)\n331: - [Build Pipeline](/docs/core/build-pipeline)",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/advanced/plugins.mdx"
}
```

**Tool Result:** `toolu_vrtx_018yny7SssCeimXumq6JbbGM`

```
{
  "content": "1: ---\n2: title: Architecture Overview\n3: description: Deep dive into Manic's design, build pipeline, and core systems.\n4: ---\n5: \n6: # Architecture Overview\n7: \n8: Manic is built on three core pillars: **type-safe routing**, **zero-config build engine**, and **plugin-driven extensibility**.\n9: \n10: ## System Design\n11: \n12: ```mermaid\n13: graph TD\n14:     subgraph Client[\"Browser (Client)\"]\n15:         Router[\"React SPA Router\"]\n16:         Lazy[\"Lazy Load Chunks\"]\n17:         VT[\"View Transitions\"]\n18:         Prefetch[\"Hover Prefetch\"]\n19:     end\n20: \n21:     subgraph Server[\"Bun.serve (Server)\"]\n22:         Hono[\"Hono API Router\"]\n23:         OpenAPI[\"OpenAPI Discovery\"]\n24:         RPC[\"Type-safe RPC\"]\n25:         \n26:         Static[\"Static Assets\"]\n27:         Tailwind[\"Tailwind CSS v4\"]\n28:     end\n29: \n30:     Client -- \"HTTP /api/*\" --> Hono\n31:     Client -- \"Static Assets\" --> Static\n32: ```\n33: \n34: ## Build Pipeline\n35: \n36: ### Development: `manic dev`\n37: \n38: Starts a live development server with HMR:\n39: \n40: ```mermaid\n41: graph TB\n42:     Lint[\"1. Lint (oxlint)\"]\n43:     Discovery[\"2. Route Scan\"]\n44:     Generate[\"3. Generated Manifest\"]\n45:     Serve[\"4. Bun.serve\"]\n46:     Watch[\"5. Hot Reload\"]\n47: \n48:     Lint --> Discovery\n49:     Discovery --> Generate\n50:     Generate --> Serve\n51:     Serve <--> Watch\n52: ```\n53: \n54: Key files:\n55: - `app/~routes.generated.ts` — Route registry (auto-generated, **never edit**)\n56: - `manic.config.ts` — Plugin & config definition\n57: - `~manic.ts` — Server entry point (auto-generated)\n58: \n59: ### Production: `manic build`\n60: \n61: Optimized, minified production output:\n62: \n63: ```mermaid\n64: graph TD\n65:     Lint[\"1. Lint (oxlint)\"]\n66:     Discovery[\"2. Route Discovery\"]\n67:     Client[\"3. Client Bundling\"]\n68:     API[\"4. API Bundling\"]\n69:     Server[\"5. Server Bundling\"]\n70:     Minify[\"6. OXC Minify\"]\n71:     Provider[\"7. Provider Pack\"]\n72: \n73:     Lint --> Discovery\n74:     Discovery --> Client\n75:     Discovery --> API\n76:     Client --> Server\n77:     API --> Server\n78:     Server --> Minify\n79:     Minify --> Provider\n80: ```\n81: \n82: Output structure:\n83: <Files>\n84:   <Folder name=\"dist\" defaultOpen>\n85:     <Folder name=\"client\">\n86:       <File name=\"[name].js\" />\n87:       <File name=\"index.html\" />\n88:     </Folder>\n89:     <Folder name=\"api\">\n90:       <File name=\"[name].js\" />\n91:     </Folder>\n92:     <File name=\"server.js\" />\n93:     <File name=\"manifest.json\" />\n94:   </Folder>\n95: </Files>\n96: \n97: ## Router (Client-Side)\n98: \n99: ### Route Scoring: How Routes Are Matched\n100: \n101: Manic uses a **scoring algorithm** to determine which route handles a URL:\n102: \n103: ```ts\n104: // Example routes\n105: app/routes/posts/new.tsx         // Score: 200 (static + static)\n106: app/routes/posts/[id].tsx        // Score: 110 (static + dynamic)\n107: app/routes/posts/[...slug].tsx   // Score: 101 (static + catch-all)\n108: ```\n109: \n110: **Scoring Rules:**\n111: - Static segment: `+100`\n112: - Dynamic segment: `+10`\n113: - Catch-all segment: `+1`\n114: \n115: **URL Match Process:**\n116: ```\n117: /posts/new\n118: ├─ new.tsx → 200 ✓ (WINNER)\n119: ├─ [id].tsx → 110\n120: └─ [...slug].tsx → 101\n121: \n122: /posts/123\n123: ├─ new.tsx → No match\n124: ├─ [id].tsx → 110 ✓ (WINNER)\n125: └─ [...slug].tsx → 101\n126: ```\n127: \n128: This ensures **correct precedence without order dependency**.\n129: \n130: ### Code Splitting Strategy: Lazy Loading\n131: \n132: Each route's component is **lazy-loaded on first navigation**:\n133: \n134: ```ts\n135: // Generated in app/~routes.generated.ts\n136: const routes = [\n137:   {\n138:     path: '/posts/[id]',\n139:     component: null,  // Lazy\n140:     loader: () => import('./routes/posts/[id].tsx'),\n141:   },\n142: ];\n143: ```\n144: \n145: **Prefetch Behavior:**\n146: \n147: ```tsx\n148: import { Link } from 'manicjs';\n149: \n150: // On mouse enter or focus:\n151: // → fetch('/api/__manifest.json')\n152: // → Preload /posts/123's JS chunk\n153: <a href=\"/posts/123\" prefetch>\n154:   View Post\n155: </a>\n156: ```\n157: \n158: Benefits:\n159: - Only ship JS needed for current page\n160: - Chunks cached in memory after first load\n161: - Smooth prefetch without janky loads\n162: \n163: ### Client Navigation Flow\n164: \n165: ```mermaid\n166: graph TD\n167:     Click[\"User clicks Link\"] --> Prevent[\"preventDefault()\"]\n168:     Prevent --> Load[\"Lazy Load JS Chunk\"]\n169:     Load --> Match[\"Match Route\"]\n170:     Match --> Render[\"React Render\"]\n171:     Render --> VT[\"View Transition\"]\n172:     VT --> History[\"Update History\"]\n173:     History --> Scroll[\"Scroll to Top\"]\n174: ```\n175: \n176: **Hook Access:**\n177: \n178: ```tsx\n179: import { useRouter, useParams, useQueryParams } from 'manicjs';\n180: \n181: export default function PostPage() {\n182:   const router = useRouter();      // navigate(path, options)\n183:   const { id } = useParams();       // Route params\n184:   const [query, setQuery] = useQueryParams();  // URL search\n185:   \n186:   return <div>Post {id}</div>;\n187: }\n188: ```\n189: \n190: ## API Routes (Server-Side)\n191: \n192: ### File-Based API Routes\n193: \n194: <Files>\n195:   <Folder name=\"app/api\" defaultOpen>\n196:     <Folder name=\"users\">\n197:       <File name=\"index.ts\" />\n198:       <File name=\"[id].ts\" />\n199:     </Folder>\n200:     <Folder name=\"posts\">\n201:       <File name=\"index.ts\" />\n202:     </Folder>\n203:     <Folder name=\"search\">\n204:       <File name=\"index.ts\" />\n205:     </Folder>\n206:   </Folder>\n207: </Files>\n208: \n209: Each `index.ts` exports a Hono route handler:\n210: \n211: ```ts\n212: // app/api/users/index.ts\n213: import { Hono } from 'hono';\n214: \n215: const app = new Hono();\n216: \n217: app.get('/', async (c) => {\n218:   const users = await db.query('SELECT * FROM users');\n219:   return c.json(users);\n220: });\n221: \n222: export default app;\n223: ```\n224: \n225: ### Auto-Generated OpenAPI\n226: \n227: Manic scans all API routes and generates an **OpenAPI schema**:\n228: \n229: ```json\n230: {\n231:   \"openapi\": \"3.1.0\",\n232:   \"paths\": {\n233:     \"/api/users\": {\n234:       \"get\": {\n235:         \"operationId\": \"listUsers\",\n236:         \"responses\": {\n237:           \"200\": {\n238:             \"content\": {\n239:               \"application/json\": {\n240:                 \"schema\": { \"type\": \"array\" }\n241:               }\n242:             }\n243:           }\n244:         }\n245:       }\n246:     }\n247:   }\n248: }\n249: ```\n250: \n251: **Discovery:** `GET /.well-known/openapi.json`\n252: \n253: Use with tools like Scalar, Swagger, or postman for docs.\n254: \n255: ### Type-Safe Client\n256: \n257: Manic generates a **type-safe RPC client** from your API routes:\n258: \n259: ```ts\n260: // Type-safe API client using Hono RPC\n261: import type { AppType } from '../api/index';\n262: import { hc } from 'hono/client';\n263: \n264: const client = hc<AppType>('/api');\n265: \n266: // Type-safe API calls\n267: const users = await client.users.$get();\n268: const user = await client.users[':id'].get({ param: { id: '123' } });\n269: ```\n270: \n271: Uses Hono's RPC for full type inference from your API routes.\n272: \n273: ## Plugin System\n274: \n275: ### Core Plugin API\n276: \n277: ```ts\n278: import { createPlugin } from 'manicjs/config';\n279: \n280: export function myPlugin(options = {}) {\n281:   return createPlugin({\n282:     name: 'my-plugin',\n283:     \n284:     // Option 1: Static files (recommended)\n285:     staticFiles: [\n286:       {\n287:         path: '/robots.txt',\n288:         content: 'User-agent: *\\nDisallow: /',\n289:         contentType: 'text/plain; charset=utf-8',\n290:       },\n291:     ],\n292:     \n293:     // Option 2: Server hooks (dev-only routes)\n294:     configureServer(ctx) {\n295:       ctx.addRoute('/health', () => new Response('ok'));\n296:       ctx.injectHtml('<meta name=\"my-plugin\" content=\"true\">');\n297:       ctx.addLinkHeader('<https://example.com>; rel=\"preconnect\"');\n298:     },\n299:     \n300:     // Option 3: Build hooks (emit & inject)\n301:     build(ctx) {\n302:       ctx.emitClientFile('/__manifest.json', JSON.stringify({\n303:         routes: ctx.pageRoutes,\n304:       }));\n305:       ctx.injectHtml('<link rel=\"dns-prefetch\" href=\"https://api.example.com\">');\n306:     },\n307:   });\n308: }\n309: ```\n310: \n311: ### Official Plugins\n312: \n313: | Package | Purpose | Status |\n314: |---------|---------|--------|\n315: | `@manicjs/tailwind` | Tailwind CSS v4 | ✓ Stable |\n316: | `@manicjs/seo` | robots.txt, meta tags, Link headers | ✓ Stable |\n317: | `@manicjs/sitemap` | Auto-generate sitemap.xml | ✓ Stable |\n318: | `@manicjs/mcp` | Model Context Protocol endpoint | ✓ Stable |\n319: | `@manicjs/api-docs` | Scalar API reference UI | ✓ Stable |\n320: \n321: Example config:\n322: \n323: ```ts\n324: // manic.config.ts\n325: import { defineTool } from 'manicjs/config';\n326: import tailwind from '@manicjs/tailwind';\n327: import seo from '@manicjs/seo';\n328: import sitemap from '@manicjs/sitemap';\n329: \n330: export default defineTool({\n331:   plugins: [\n332:     tailwind(),\n333:     seo({\n334:       robots: 'follow',\n335:       canonical: 'https://example.com',\n336:     }),\n337:     sitemap(),\n338:   ],\n339: });\n340: ```\n341: \n342: ## Configuration\n343: \n344: ### Framework Configuration\n345: \n346: ```ts\n347: // manic.config.ts\n348: import { defineConfig } from 'manicjs/config';\n349: import tailwind from '@manicjs/tailwind';\n350: \n351: export default defineConfig({\n352:   // App metadata\n353:   name: 'My App',\n354:   description: 'Built with Manic',\n355:   \n356:   // Plugins & extensions\n357:   plugins: [\n358:     tailwind(),\n359:     // ... more plugins\n360:   ],\n361:   \n362:   // Build options\n363:   build: {\n364:     minify: true,\n365:     sourcemaps: false,\n366:   },\n367:   \n368:   // Server options\n369:   server: {\n370:     port: 3000,\n371:     host: '0.0.0.0',\n372:   },\n373: });\n374: ```\n375: \n376: ### Managing Secrets\n377: \n378: Create `.env.local` for development:\n379: \n380: ```bash\n381: MANIC_PUBLIC_API_URL=http://localhost:3000/api\n382: DATABASE_URL=postgres://user:pass@localhost/db\n383: ```\n384: \n385: Access in routes:\n386: \n387: ```ts\n388: import { getEnv } from 'manicjs/env';\n389: \n390: const apiUrl = getEnv('MANIC_PUBLIC_API_URL');  // Client\n391: const dbUrl = getEnv('DATABASE_URL');           // Server\n392: ```\n393: \n394: <Callout type=\"warn\">\n395:  \n396: Never commit `.env.local`. Add to `.gitignore`.\n397:  \n398: </Callout>\n399: \n400: <Callout type=\"info\">\n401: \n402: Use `MANIC_PUBLIC_` prefix for client-exposed variables. Server vars are never exposed.\n403: \n404: </Callout>\n405: ## Performance\n406: \n407: Manic is designed for **extreme speed**:\n408: \n409: - **OXC Transforms** — 50-100x faster than SWC/Babel\n410: - **Parallel Minification** — All bundles minified in parallel\n411: - **Lazy Loading** — Only ship JS for current route\n412: - **Prefetch** — Pre-download route chunks before navigation\n413: - **Zero Runtime** — No Manic runtime overhead; just vanilla React\n414: \n415: **Typical Build Times:**\n416: - Development: `<500ms` full rebuild\n417: - Production: under one second for most projects\n418: - Minification: under 100ms for all bundles combined\n419: \n420: ---\n421: \n422: Questions? See [troubleshooting](/docs/framework/troubleshooting/index) or [CLI Reference](/docs/cli/index).",
  "absolutePath": "/Users/marban/Documents/Coding/manic/docs/content/docs/core/architecture.mdx"
}
```

## User

lets make a Metadata component where it allows us to set seo stuff per page right? they can use a variable to change title or do stuff so that gives granular control, add docs aswell as make component this overrides default seo on that particular page

## Assistant

Let me check the SEO plugin's package.json and exports to understand how to integrate:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json"
}
```

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src"
}
```

## User

**Tool Result:** `toolu_vrtx_013V6AjiuQjZS9AMnP79GydG`

```
{
  "content": "1: {\n2:   \"name\": \"@manicjs/seo\",\n3:   \"version\": \"0.5.1\",\n4:   \"description\": \"SEO plugin for Manic framework — robots.txt generation\",\n5:   \"keywords\": [\n6:     \"manic\",\n7:     \"robots.txt\",\n8:     \"seo\"\n9:   ],\n10:   \"license\": \"GPL-3.0\",\n11:   \"author\": \"Rahuletto\",\n12:   \"repository\": {\n13:     \"type\": \"git\",\n14:     \"url\": \"https://github.com/Rahuletto/manic\"\n15:   },\n16:   \"files\": [\n17:     \"src/**/*\",\n18:     \"README.md\"\n19:   ],\n20:   \"type\": \"module\",\n21:   \"main\": \"./src/index.ts\",\n22:   \"types\": \"./src/index.ts\",\n23:   \"exports\": {\n24:     \".\": {\n25:       \"types\": \"./src/index.ts\",\n26:       \"import\": \"./src/index.ts\"\n27:     }\n28:   },\n29:   \"publishConfig\": {\n30:     \"access\": \"public\"\n31:   },\n32:   \"peerDependencies\": {\n33:     \"manicjs\": \"^0.7.4\"\n34:   },\n35:   \"devDependencies\": {\n36:     \"@shikijs/transformers\": \"^4.0.2\",\n37:     \"@types/mdx\": \"^2.0.13\",\n38:     \"fumadocs-docgen\": \"^3.0.10\"\n39:   }\n40: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json"
}
```

**Tool Result:** `toolu_vrtx_01KYB9tg8pZm35Ss2vDNb35Q`

```
{
  "content": "index.ts\nrobots.ts",
  "isDirectory": true,
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/src",
  "directoryEntries": [
    "index.ts",
    "robots.ts"
  ]
}
```

## Assistant

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src/index.ts"
}
```

## User

**Tool Result:** `toolu_vrtx_015KdEHXdVUg8vomBpu4bYmC`

```
{
  "content": "1: import { createPlugin } from 'manicjs/config';\n2: import { generateRobotsTxt } from './robots';\n3: \n4: /**\n5:  * Robot rule for robots.txt\n6:  * @interface RobotRule\n7:  */\n8: export interface RobotRule {\n9:   /** User agent pattern (e.g. \"*\", \"GoogleBot\") */\n10:   userAgent: string;\n11:   /** Allowed paths */\n12:   allow?: string[];\n13:   /** Disallowed paths */\n14:   disallow?: string[];\n15:   /** Crawl delay in seconds */\n16:   crawlDelay?: number;\n17: }\n18: \n19: /**\n20:  * RFC 8288 Link header configuration\n21:  * @interface LinkHeader\n22:  */\n23: export interface LinkHeader {\n24:   /** Target URL for the link */\n25:   href: string;\n26:   /** IANA link relation type (e.g. \"service-desc\", \"describedby\") */\n27:   rel: string;\n28:   /** Media type (e.g. \"application/json\") */\n29:   type?: string;\n30: }\n31: \n32: /**\n33:  * SEO configuration for meta tags, Open Graph, Twitter Cards, and robots.txt\n34:  * @interface SeoConfig\n35:  */\n36: export interface SeoConfig {\n37:   /** Base URL of the site, e.g. \"https://example.com\" */\n38:   hostname: string;\n39:   /** Page title */\n40:   title?: string;\n41:   /** Page description */\n42:   description?: string;\n43:   /** Author name */\n44:   author?: string;\n45:   /** Twitter card config */\n46:   twitter?: {\n47:     card?: 'summary' | 'summary_large_image' | 'app' | 'player';\n48:     site?: string;\n49:     creator?: string;\n50:   };\n51:   /** Open Graph config */\n52:   openGraph?: {\n53:     type?: string;\n54:     locale?: string;\n55:     image?: string;\n56:     siteName?: string;\n57:   };\n58:   /** Crawler rules. Defaults to allow all. */\n59:   rules?: RobotRule[];\n60:   /** Additional sitemap URLs to include in robots.txt */\n61:   sitemaps?: string[];\n62:   /** Auto-add /sitemap.xml when @manicjs/sitemap is used @default true */\n63:   autoSitemap?: boolean;\n64:   /** Extra RFC 8288 Link headers added to all HTML responses */\n65:   linkHeaders?: LinkHeader[];\n66:   /**\n67:    * Content-Signal directives appended to robots.txt.\n68:    * @see https://contentsignals.org/\n69:    */\n70:   contentSignals?: {\n71:     'ai-train'?: 'yes' | 'no';\n72:     search?: 'yes' | 'no';\n73:     'ai-input'?: 'yes' | 'no';\n74:   };\n75: }\n76: \n77: function generateMetaTags(config: SeoConfig): string {\n78:   const tags: string[] = [];\n79:   const hostname = config.hostname.replace(/\\/$/, '');\n80: \n81:   if (config.title)\n82:     tags.push(`  <meta name=\"title\" content=\"${config.title}\">`);\n83:   if (config.description)\n84:     tags.push(`  <meta name=\"description\" content=\"${config.description}\">`);\n85:   if (config.author)\n86:     tags.push(`  <meta name=\"author\" content=\"${config.author}\">`);\n87: \n88:   // Open Graph\n89:   if (config.title)\n90:     tags.push(`  <meta property=\"og:title\" content=\"${config.title}\">`);\n91:   if (config.description)\n92:     tags.push(\n93:       `  <meta property=\"og:description\" content=\"${config.description}\">`\n94:     );\n95:   tags.push(`  <meta property=\"og:url\" content=\"${hostname}\">`);\n96:   if (config.openGraph?.type)\n97:     tags.push(`  <meta property=\"og:type\" content=\"${config.openGraph.type}\">`);\n98:   if (config.openGraph?.locale)\n99:     tags.push(\n100:       `  <meta property=\"og:locale\" content=\"${config.openGraph.locale}\">`\n101:     );\n102:   if (config.openGraph?.image)\n103:     tags.push(\n104:       `  <meta property=\"og:image\" content=\"${config.openGraph.image}\">`\n105:     );\n106:   if (config.openGraph?.siteName)\n107:     tags.push(\n108:       `  <meta property=\"og:site_name\" content=\"${config.openGraph.siteName}\">`\n109:     );\n110: \n111:   // Twitter\n112:   if (config.twitter?.card)\n113:     tags.push(`  <meta name=\"twitter:card\" content=\"${config.twitter.card}\">`);\n114:   if (config.twitter?.site)\n115:     tags.push(`  <meta name=\"twitter:site\" content=\"${config.twitter.site}\">`);\n116:   if (config.twitter?.creator)\n117:     tags.push(\n118:       `  <meta name=\"twitter:creator\" content=\"${config.twitter.creator}\">`\n119:     );\n120:   if (config.title)\n121:     tags.push(`  <meta name=\"twitter:title\" content=\"${config.title}\">`);\n122:   if (config.description)\n123:     tags.push(\n124:       `  <meta name=\"twitter:description\" content=\"${config.description}\">`\n125:     );\n126: \n127:   return tags.join('\\n');\n128: }\n129: \n130: /**\n131:  * Creates an SEO plugin for meta tags, Open Graph, Twitter Cards, and robots.txt.\n132:  *\n133:  * Generates:\n134:  * - robots.txt with crawl rules\n135:  * - Meta tags (title, description, author)\n136:  * - Open Graph tags for social sharing\n137:  * - Twitter Card tags\n138:  * - RFC 8288 Link headers for sitemap discovery\n139:  *\n140:  * @param config - SEO configuration options\n141:  * @returns ManicPlugin for SEO\n142:  *\n143:  * @example\n144:  * import { seo } from '@manicjs/seo';\n145:  *\n146:  * seo({\n147:  *   hostname: 'https://example.com',\n148:  *   title: 'My App',\n149:  *   description: 'A great app',\n150:  *   twitter: { card: 'summary_large_image' },\n151:  * })\n152:  */\n153: export function seo(config: SeoConfig) {\n154:   return createPlugin({\n155:     name: 'seo',\n156: \n157:     staticFiles: [\n158:       {\n159:         path: '/robots.txt',\n160:         content: generateRobotsTxt(config),\n161:         contentType: 'text/plain; charset=utf-8',\n162:       },\n163:     ],\n164: \n165:     configureServer(ctx) {\n166:       const hostname = config.hostname.replace(/\\/$/, '');\n167:       if (config.autoSitemap ?? true) {\n168:         ctx.addLinkHeader(\n169:           `<${hostname}/sitemap.xml>; rel=\"describedby\"; type=\"application/xml\"`\n170:         );\n171:       }\n172:       for (const s of config.sitemaps ?? []) {\n173:         ctx.addLinkHeader(`<${s}>; rel=\"describedby\"; type=\"application/xml\"`);\n174:       }\n175:       for (const lh of config.linkHeaders ?? []) {\n176:         ctx.addLinkHeader(\n177:           `<${lh.href}>; rel=\"${lh.rel}\"${lh.type ? `; type=\"${lh.type}\"` : ''}`\n178:         );\n179:       }\n180:       const metaTags = generateMetaTags(config);\n181:       if (metaTags) ctx.injectHtml(metaTags);\n182:     },\n183: \n184:     build(ctx) {\n185:       const metaTags = generateMetaTags(config);\n186:       if (metaTags) ctx.injectHtml(metaTags);\n187:     },\n188:   });\n189: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/src/index.ts"
}
```

## Assistant

Now let me check how routes work to understand the lifecycle — since this is an SPA, the `Metadata` component needs to work client-side by manipulating `<head>`:

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/packages/manic/src/router/lib/Router.tsx"
}
```

## User

**Tool Result:** `toolu_vrtx_0123UNPodp6Xwf1qmkvfYVE8`

```
{
  "content": "1: import {\n2:   createElement,\n3:   useEffect,\n4:   useState,\n5:   useRef,\n6:   useMemo,\n7:   Component,\n8:   type ComponentType,\n9:   type ErrorInfo,\n10: } from 'react';\n11: import { flushSync } from 'react-dom';\n12: import { NotFound } from '../../components/NotFound';\n13: import { ErrorOverlay } from '../../components/ErrorOverlay';\n14: import { ServerError } from '../../components/ServerError';\n15: import { RouterContext } from './context';\n16: import { RouteRegistry } from './matcher';\n17: import type { RouteDef } from './types';\n18: \n19: type LazyLoader = () => Promise<{ default: ComponentType }>;\n20: \n21: declare global {\n22:   interface Window {\n23:     __MANIC_ROUTES__?: Record<string, LazyLoader>;\n24:     __MANIC_ERROR_PAGES__?: {\n25:       notFound?: LazyLoader;\n26:       error?: LazyLoader;\n27:     };\n28:     __MANIC_NAVIGATE__?: (to: string, options?: { replace?: boolean }) => void;\n29:   }\n30: \n31:   interface Document {\n32:     startViewTransition?: (callback: () => void | Promise<void>) => {\n33:       finished: Promise<void>;\n34:       updateCallbackDone: Promise<void>;\n35:       ready: Promise<void>;\n36:     };\n37:   }\n38: }\n39: \n40: /** Hook to access URL search parameters reactively — updates on popstate */\n41: function useQueryParams(): URLSearchParams {\n42:   const [params, setParams] = useState(() =>\n43:     typeof window !== 'undefined'\n44:       ? new URLSearchParams(window.location.search)\n45:       : new URLSearchParams()\n46:   );\n47: \n48:   useEffect(() => {\n49:     const update = (): void =>\n50:       setParams(new URLSearchParams(window.location.search));\n51:     window.addEventListener('popstate', update);\n52:     return () => window.removeEventListener('popstate', update);\n53:   }, []);\n54: \n55:   return params;\n56: }\n57: \n58: export { useQueryParams };\n59: \n60: // Cache loaded components\n61: const componentCache = new Map<string, ComponentType>();\n62: \n63: // Clear component cache during HMR so new components are picked up\n64: if (import.meta.hot) {\n65:   import.meta.hot.accept(() => {\n66:     componentCache.clear();\n67:   });\n68: }\n69: \n70: async function loadComponent(\n71:   path: string,\n72:   loader: LazyLoader,\n73:   signal?: AbortSignal\n74: ): Promise<ComponentType | null> {\n75:   if (!componentCache.has(path)) {\n76:     try {\n77:       const module = await loader();\n78:       if (signal?.aborted) return null;\n79:       componentCache.set(path, module.default);\n80:     } catch (e) {\n81:       if (signal?.aborted) return null;\n82:       throw e;\n83:     }\n84:   }\n85:   return componentCache.get(path)!;\n86: }\n87: \n88: /** Preload a route's component module — called on link hover for instant navigation */\n89: export function preloadRoute(path: string): void {\n90:   if (typeof window === 'undefined' || !window.__MANIC_ROUTES__) return;\n91: \n92:   const routes = window.__MANIC_ROUTES__;\n93: \n94:   // Use registry to match the actual route loader\n95:   const routeDefs = Object.entries(routes).map(([p, loader]) => ({\n96:     path: p || '/',\n97:     component: null,\n98:     loader,\n99:   }));\n100:   const registry = new RouteRegistry(routeDefs);\n101:   const match = registry.match(path);\n102: \n103:   if (match) {\n104:     const loader = routes[match.path];\n105:     if (loader && !componentCache.has(match.path)) {\n106:       loader().then(mod => componentCache.set(match.path, mod.default));\n107:     }\n108:   }\n109: }\n110: \n111: let viewTransitionsEnabled = true;\n112: \n113: /** Enable or disable View Transitions API for client-side navigation */\n114: export function setViewTransitions(enabled: boolean): void {\n115:   viewTransitionsEnabled = enabled;\n116: }\n117: \n118: /** Navigate to a path programmatically */\n119: export function navigate(to: string, options?: { replace?: boolean }): void {\n120:   if (typeof window !== 'undefined' && window.__MANIC_NAVIGATE__) {\n121:     window.__MANIC_NAVIGATE__(to, options);\n122:   }\n123: }\n124: \n125: // Cache for custom error page components\n126: const errorPageCache = new Map<string, ComponentType>();\n127: \n128: async function loadErrorPage(\n129:   key: string,\n130:   loader: LazyLoader\n131: ): Promise<ComponentType> {\n132:   if (!errorPageCache.has(key)) {\n133:     const module = await loader();\n134:     errorPageCache.set(key, module.default);\n135:   }\n136:   return errorPageCache.get(key)!;\n137: }\n138: \n139: function useErrorPage(\n140:   key: string,\n141:   loader?: LazyLoader,\n142:   fallback?: ComponentType\n143: ): ComponentType {\n144:   const [Component, setComponent] = useState<ComponentType>(\n145:     () => errorPageCache.get(key) ?? fallback ?? NotFound\n146:   );\n147: \n148:   useEffect(() => {\n149:     if (loader && !errorPageCache.has(key)) {\n150:       loadErrorPage(key, loader).then(C => setComponent(() => C));\n151:     }\n152:   }, [key, loader]);\n153: \n154:   return Component;\n155: }\n156: \n157: class ErrorBoundary extends Component<\n158:   {\n159:     fallback: React.ReactNode;\n160:     children: React.ReactNode;\n161:     onError: (error: Error) => void;\n162:   },\n163:   { hasError: boolean }\n164: > {\n165:   constructor(props: any) {\n166:     super(props);\n167:     this.state = { hasError: false };\n168:   }\n169: \n170:   static getDerivedStateFromError() {\n171:     return { hasError: true };\n172:   }\n173: \n174:   componentDidCatch(error: Error, errorInfo: ErrorInfo) {\n175:     console.error('Router caught an error during render:');\n176:     console.error(error, errorInfo);\n177:     this.props.onError(error);\n178:   }\n179: \n180:   render() {\n181:     if (this.state.hasError) {\n182:       return this.props.fallback;\n183:     }\n184:     return this.props.children;\n185:   }\n186: }\n187: \n188: /** Client-side router with file-based routing, view transitions, and error boundaries */\n189: export function Router({\n190:   routes: manualRoutes,\n191: }: {\n192:   routes?: Record<string, LazyLoader>;\n193: }): React.ReactElement {\n194:   const [currentPath, setCurrentPath] = useState(\n195:     typeof window !== 'undefined' ? window.location.pathname : '/'\n196:   );\n197:   const [LoadedComponent, setLoadedComponent] = useState<ComponentType | null>(\n198:     null\n199:   );\n200:   const [routeParams, setRouteParams] = useState<Record<string, string>>({});\n201:   const [errorDetails, setErrorDetails] = useState<Error | null>(null);\n202:   const [resolvedDevRoutes, setResolvedDevRoutes] = useState<\n203:     { path: string; file: string; componentName: string }[] | undefined\n204:   >(undefined);\n205:   const isNavigating = useRef(false);\n206:   const abortController = useRef<AbortController | null>(null);\n207:   const activeTransition = useRef<ReturnType<typeof document.startViewTransition> | null>(null);\n208: \n209:   const rawRoutes: Record<string, LazyLoader> =\n210:     manualRoutes ??\n211:     (typeof window !== 'undefined' ? (window.__MANIC_ROUTES__ ?? {}) : {});\n212: \n213:   const errorPages =\n214:     typeof window !== 'undefined' ? window.__MANIC_ERROR_PAGES__ : undefined;\n215: \n216:   useEffect(() => {\n217:     if (process.env.NODE_ENV === 'production') return;\n218:     Promise.all(\n219:       Object.entries(rawRoutes).map(async ([p, loader]) => {\n220:         const normalized = p || '/';\n221:         // Extract file path from the loader function source\n222:         const src = loader.toString();\n223:         const match = src.match(/import\\([\"']([^\"']+)[\"']\\)/);\n224:         const file = match\n225:           ? match[1].replace(/^\\.\\//, 'app/')\n226:           : (() => {\n227:               const filePart =\n228:                 normalized === '/'\n229:                   ? 'index'\n230:                   : normalized\n231:                       .replace(/^\\//, '')\n232:                       .replace(/:\\.\\.\\.([^/]+)/g, '[...$1]')\n233:                       .replace(/:([^/]+)/g, '[$1]');\n234:               return `app/routes/${filePart}.tsx`;\n235:             })();\n236:         let componentName = '';\n237:         try {\n238:           componentName = (await loader()).default?.name ?? '';\n239:         } catch {}\n240:         return { path: normalized, file, componentName };\n241:       })\n242:     ).then(setResolvedDevRoutes);\n243:   }, []);\n244: \n245:   const NotFoundPage = useErrorPage('notFound', errorPages?.notFound, NotFound);\n246:   const ErrorPage = useErrorPage('error', errorPages?.error, process.env.NODE_ENV === 'production' ? ServerError : ErrorOverlay);\n247: \n248:   // Compile routes into a registry exactly once\n249:   const registry = useMemo(() => {\n250:     const defs = Object.entries(rawRoutes).map(([path, loader]) => ({\n251:       path: path || '/',\n252:       component: null,\n253:       loader,\n254:     }));\n255:     return new RouteRegistry(defs);\n256:   }, [rawRoutes]);\n257: \n258:   const loadAndTransition = async (\n259:     path: string,\n260:     isPopState: boolean,\n261:     replace: boolean = false\n262:   ) => {\n263:     if (abortController.current) {\n264:       abortController.current.abort();\n265:     }\n266:     abortController.current = new AbortController();\n267:     const signal = abortController.current.signal;\n268: \n269:     const match = registry.match(path);\n270:     if (!match) {\n271:       if (!isPopState) {\n272:         if (replace)\n273:           window.history.replaceState({ scrollY: window.scrollY }, '', path);\n274:         else window.history.pushState({ scrollY: window.scrollY }, '', path);\n275:       }\n276:       setCurrentPath(path);\n277:       setLoadedComponent(null);\n278:       setErrorDetails(null);\n279:       return;\n280:     }\n281: \n282:     const matchedLoader = rawRoutes[match.path];\n283:     if (matchedLoader) {\n284:       isNavigating.current = true;\n285:       try {\n286:         const Cmp = await loadComponent(match.path, matchedLoader, signal);\n287: \n288:         if (signal.aborted) return;\n289: \n290:         const updateState = () => {\n291:           if (!isPopState) {\n292:             // Save current scroll position before pushing\n293:             window.history.replaceState({ scrollY: window.scrollY }, '');\n294:             if (replace) {\n295:               window.history.replaceState({ scrollY: 0 }, '', path);\n296:             } else {\n297:               window.history.pushState({ scrollY: 0 }, '', path);\n298:             }\n299:           }\n300: \n301:           setCurrentPath(path);\n302:           setLoadedComponent(() => Cmp);\n303:           setRouteParams(match.params);\n304:           setErrorDetails(null);\n305: \n306:           if (!isPopState && document.body) {\n307:             // ensure we scroll to top on new navigation, leaving popstate intact\n308:             window.scrollTo(0, 0);\n309:           } else if (\n310:             isPopState &&\n311:             window.history.state?.scrollY !== undefined\n312:           ) {\n313:             window.scrollTo(0, window.history.state.scrollY);\n314:           }\n315:         };\n316: \n317:         const shouldAnimate =\n318:           viewTransitionsEnabled &&\n319:           document.startViewTransition &&\n320:           !isPopState &&\n321:           !replace &&\n322:           !activeTransition.current;\n323: \n324:         if (shouldAnimate) {\n325:           try {\n326:             const transition = document.startViewTransition!(() => {\n327:               flushSync(updateState);\n328:             });\n329:             activeTransition.current = transition;\n330:             transition.finished.catch(() => {}).finally(() => {\n331:               activeTransition.current = null;\n332:             });\n333:           } catch {\n334:             updateState();\n335:           }\n336:         } else {\n337:           updateState();\n338:         }\n339:       } catch (err) {\n340:         if (signal.aborted) return;\n341:         setErrorDetails(err instanceof Error ? err : new Error(String(err)));\n342:       } finally {\n343:         if (!signal.aborted) isNavigating.current = false;\n344:       }\n345:     }\n346:   };\n347: \n348:   useEffect(() => {\n349:     if ('scrollRestoration' in window.history) {\n350:       window.history.scrollRestoration = 'manual';\n351:     }\n352: \n353:     // Assign globally for <Link> and manual navigation\n354:     window.__MANIC_NAVIGATE__ = (to: string, options) => {\n355:       loadAndTransition(to, false, options?.replace);\n356:     };\n357: \n358:     const handlePopState = () => {\n359:       loadAndTransition(window.location.pathname, true);\n360:     };\n361: \n362:     window.addEventListener('popstate', handlePopState);\n363: \n364:     // Initial mount load\n365:     if (componentCache.size === 0) {\n366:       loadAndTransition(window.location.pathname, true, true);\n367:     }\n368: \n369:     return () => {\n370:       window.removeEventListener('popstate', handlePopState);\n371:       delete window.__MANIC_NAVIGATE__;\n372:     };\n373:   }, [registry]);\n374: \n375:   if (errorDetails) {\n376:     return createElement(\n377:       RouterContext.Provider,\n378:       { value: { path: currentPath, navigate, params: {} } },\n379:       createElement(ErrorPage as any, { error: errorDetails })\n380:     );\n381:   }\n382: \n383:   if (!LoadedComponent) {\n384:     const match = registry.match(currentPath);\n385:     if (!match) {\n386:       const devRoutes = resolvedDevRoutes;\n387:       return createElement(\n388:         RouterContext.Provider,\n389:         { value: { path: currentPath, navigate, params: {} } },\n390:         createElement(NotFoundPage, { routes: devRoutes, currentPath } as any)\n391:       );\n392:     }\n393:     // Show nothing while loading initial route (suspense-like)\n394:     return null;\n395:   }\n396: \n397:   return createElement(\n398:     RouterContext.Provider,\n399:     { value: { path: currentPath, navigate, params: routeParams } },\n400:     createElement(\n401:       ErrorBoundary,\n402:       {\n403:         fallback: createElement(ErrorPage as any, { error: errorDetails }),\n404:         onError: err => setErrorDetails(err),\n405:       },\n406:       createElement(LoadedComponent, null)\n407:     )\n408:   );\n409: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/packages/manic/src/router/lib/Router.tsx"
}
```

## Assistant

Now I have full context. Let me create the `Metadata` component and update the docs. The component should:

1. Live in `plugins/seo/src/metadata.tsx` — a React component that manipulates `<head>` tags
2. Be exported from `@manicjs/seo`
3. Override global SEO defaults per-page

**Tool Use:** `Read`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json"
}
```

## User

**Tool Result:** `toolu_vrtx_01Xcnft2eNRfcsVR8tAxgAPS`

```
{
  "content": "1: {\n2:   \"name\": \"@manicjs/seo\",\n3:   \"version\": \"0.5.1\",\n4:   \"description\": \"SEO plugin for Manic framework — robots.txt generation\",\n5:   \"keywords\": [\n6:     \"manic\",\n7:     \"robots.txt\",\n8:     \"seo\"\n9:   ],\n10:   \"license\": \"GPL-3.0\",\n11:   \"author\": \"Rahuletto\",\n12:   \"repository\": {\n13:     \"type\": \"git\",\n14:     \"url\": \"https://github.com/Rahuletto/manic\"\n15:   },\n16:   \"files\": [\n17:     \"src/**/*\",\n18:     \"README.md\"\n19:   ],\n20:   \"type\": \"module\",\n21:   \"main\": \"./src/index.ts\",\n22:   \"types\": \"./src/index.ts\",\n23:   \"exports\": {\n24:     \".\": {\n25:       \"types\": \"./src/index.ts\",\n26:       \"import\": \"./src/index.ts\"\n27:     }\n28:   },\n29:   \"publishConfig\": {\n30:     \"access\": \"public\"\n31:   },\n32:   \"peerDependencies\": {\n33:     \"manicjs\": \"^0.7.4\"\n34:   },\n35:   \"devDependencies\": {\n36:     \"@shikijs/transformers\": \"^4.0.2\",\n37:     \"@types/mdx\": \"^2.0.13\",\n38:     \"fumadocs-docgen\": \"^3.0.10\"\n39:   }\n40: }",
  "absolutePath": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json"
}
```

## Assistant

I need to add React as a peer dep and add a separate export for the Metadata component. Let me create the component and wire everything up:

**Tool Use:** `create_file`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/src/metadata.tsx",
  "content": "import { useEffect, useRef } from 'react';\n\n/**\n * Per-page metadata that overrides global SEO defaults.\n *\n * Drop `<Metadata>` into any route component to set the page title,\n * description, Open Graph tags, Twitter Card tags, and canonical URL.\n * Tags are applied on mount and cleaned up on unmount so navigating\n * between pages restores the previous (global) values automatically.\n *\n * @example\n * ```tsx\n * import { Metadata } from '@manicjs/seo/metadata';\n *\n * export default function About() {\n *   return (\n *     <>\n *       <Metadata\n *         title=\"About Us\"\n *         description=\"Learn more about our company\"\n *         ogImage=\"/images/about-og.png\"\n *       />\n *       <h1>About</h1>\n *     </>\n *   );\n * }\n * ```\n */\nexport interface MetadataProps {\n  /** Page title — sets `<title>` and `og:title` / `twitter:title` */\n  title?: string;\n  /** Meta description — sets `name=\"description\"`, `og:description`, `twitter:description` */\n  description?: string;\n  /** Author — sets `name=\"author\"` */\n  author?: string;\n  /** Canonical URL — creates/updates `<link rel=\"canonical\">` */\n  canonical?: string;\n  /** Open Graph image URL — sets `og:image` and `twitter:image` */\n  ogImage?: string;\n  /** Open Graph type — sets `og:type` (default from global config) */\n  ogType?: string;\n  /** Open Graph URL — sets `og:url` */\n  ogUrl?: string;\n  /** Open Graph locale — sets `og:locale` */\n  ogLocale?: string;\n  /** Open Graph site name — sets `og:site_name` */\n  ogSiteName?: string;\n  /** Twitter card type — sets `twitter:card` */\n  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';\n  /** Twitter site handle — sets `twitter:site` */\n  twitterSite?: string;\n  /** Twitter creator handle — sets `twitter:creator` */\n  twitterCreator?: string;\n}\n\n// ---------------------------------------------------------------------------\n// Helpers for managing <meta> and <link> tags in <head>\n// ---------------------------------------------------------------------------\n\ntype TagEntry = { element: Element; previous: string | null };\n\nconst MANIC_ATTR = 'data-manic-seo';\n\nfunction upsertMeta(\n  attr: 'name' | 'property',\n  key: string,\n  value: string,\n  tracker: TagEntry[]\n) {\n  const selector = `meta[${attr}=\"${key}\"]`;\n  let el = document.head.querySelector(selector);\n  const previous = el?.getAttribute('content') ?? null;\n\n  if (el) {\n    el.setAttribute('content', value);\n  } else {\n    el = document.createElement('meta');\n    el.setAttribute(attr, key);\n    el.setAttribute('content', value);\n    el.setAttribute(MANIC_ATTR, '');\n    document.head.appendChild(el);\n  }\n\n  tracker.push({ element: el, previous });\n}\n\nfunction upsertLink(\n  rel: string,\n  href: string,\n  tracker: TagEntry[]\n) {\n  const selector = `link[rel=\"${rel}\"]`;\n  let el = document.head.querySelector(selector);\n  const previous = el?.getAttribute('href') ?? null;\n\n  if (el) {\n    el.setAttribute('href', href);\n  } else {\n    el = document.createElement('link');\n    el.setAttribute('rel', rel);\n    el.setAttribute('href', href);\n    el.setAttribute(MANIC_ATTR, '');\n    document.head.appendChild(el);\n  }\n\n  tracker.push({ element: el, previous });\n}\n\n/**\n * React component for per-page SEO metadata.\n *\n * Renders nothing visible — it manages `<head>` tags via side effects.\n * On unmount the previous tag values are restored so global SEO defaults\n * come back when navigating away from the page.\n */\nexport function Metadata(props: MetadataProps): null {\n  const tracked = useRef<{\n    title: string | null;\n    tags: TagEntry[];\n  }>({ title: null, tags: [] });\n\n  useEffect(() => {\n    const tags: TagEntry[] = [];\n    const prevTitle = document.title;\n\n    // Title\n    if (props.title) {\n      document.title = props.title;\n    }\n\n    // Standard meta\n    if (props.title) upsertMeta('name', 'title', props.title, tags);\n    if (props.description)\n      upsertMeta('name', 'description', props.description, tags);\n    if (props.author) upsertMeta('name', 'author', props.author, tags);\n\n    // Open Graph\n    if (props.title) upsertMeta('property', 'og:title', props.title, tags);\n    if (props.description)\n      upsertMeta('property', 'og:description', props.description, tags);\n    if (props.ogImage) upsertMeta('property', 'og:image', props.ogImage, tags);\n    if (props.ogType) upsertMeta('property', 'og:type', props.ogType, tags);\n    if (props.ogUrl) upsertMeta('property', 'og:url', props.ogUrl, tags);\n    if (props.ogLocale)\n      upsertMeta('property', 'og:locale', props.ogLocale, tags);\n    if (props.ogSiteName)\n      upsertMeta('property', 'og:site_name', props.ogSiteName, tags);\n\n    // Twitter Card\n    if (props.twitterCard)\n      upsertMeta('name', 'twitter:card', props.twitterCard, tags);\n    if (props.title)\n      upsertMeta('name', 'twitter:title', props.title, tags);\n    if (props.description)\n      upsertMeta('name', 'twitter:description', props.description, tags);\n    if (props.ogImage)\n      upsertMeta('name', 'twitter:image', props.ogImage, tags);\n    if (props.twitterSite)\n      upsertMeta('name', 'twitter:site', props.twitterSite, tags);\n    if (props.twitterCreator)\n      upsertMeta('name', 'twitter:creator', props.twitterCreator, tags);\n\n    // Canonical\n    if (props.canonical) upsertLink('canonical', props.canonical, tags);\n\n    tracked.current = { title: prevTitle, tags };\n\n    // Cleanup: restore previous values on unmount / re-render\n    return () => {\n      if (tracked.current.title !== null) {\n        document.title = tracked.current.title;\n      }\n\n      for (const { element, previous } of tracked.current.tags) {\n        if (previous === null) {\n          // We created this tag — remove it\n          if (element.hasAttribute(MANIC_ATTR)) {\n            element.remove();\n          }\n        } else {\n          // We modified an existing tag — restore original value\n          const attr = element.hasAttribute('content') ? 'content' : 'href';\n          element.setAttribute(attr, previous);\n        }\n      }\n    };\n  }, [\n    props.title,\n    props.description,\n    props.author,\n    props.canonical,\n    props.ogImage,\n    props.ogType,\n    props.ogUrl,\n    props.ogLocale,\n    props.ogSiteName,\n    props.twitterCard,\n    props.twitterSite,\n    props.twitterCreator,\n  ]);\n\n  return null;\n}\n"
}
```

## User

**Tool Result:** `toolu_vrtx_01VJoaLVDYZgdayVf9Shp9Gj`

```
Successfully created file /Users/marban/Documents/Coding/manic/plugins/seo/src/metadata.tsx
```

## Assistant

Now add the export and peer dep for React:

**Tool Use:** `edit_file`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json",
  "new_str": "[... new_str omitted in markdown version ...]",
  "old_str": "[... old_str omitted in markdown version ...]"
}
```

## User

**Tool Result:** `toolu_vrtx_011LAMw9CsW53Cjjowjq6xRH`

```
{
  "diff": "```diff\nIndex: /Users/marban/Documents/Coding/manic/plugins/seo/package.json\n===================================================================\n--- /Users/marban/Documents/Coding/manic/plugins/seo/package.json\toriginal\n+++ /Users/marban/Documents/Coding/manic/plugins/seo/package.json\tmodified\n@@ -23,8 +23,12 @@\n   \"exports\": {\n     \".\": {\n       \"types\": \"./src/index.ts\",\n       \"import\": \"./src/index.ts\"\n+    },\n+    \"./metadata\": {\n+      \"types\": \"./src/metadata.tsx\",\n+      \"import\": \"./src/metadata.tsx\"\n     }\n   },\n   \"publishConfig\": {\n     \"access\": \"public\"\n```",
  "lineRange": [
    23,
    32
  ]
}
```

## Assistant

**Tool Use:** `edit_file`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/plugins/seo/package.json",
  "new_str": "[... new_str omitted in markdown version ...]",
  "old_str": "[... old_str omitted in markdown version ...]"
}
```

## User

**Tool Result:** `toolu_vrtx_01TqZVzzkiCyJ7E7mHwnjTfC`

```
{
  "diff": "```diff\nIndex: /Users/marban/Documents/Coding/manic/plugins/seo/package.json\n===================================================================\n--- /Users/marban/Documents/Coding/manic/plugins/seo/package.json\toriginal\n+++ /Users/marban/Documents/Coding/manic/plugins/seo/package.json\tmodified\n@@ -33,9 +33,10 @@\n   \"publishConfig\": {\n     \"access\": \"public\"\n   },\n   \"peerDependencies\": {\n-    \"manicjs\": \"^0.7.4\"\n+    \"manicjs\": \"^0.7.4\",\n+    \"react\": \">=18\"\n   },\n   \"devDependencies\": {\n     \"@shikijs/transformers\": \"^4.0.2\",\n     \"@types/mdx\": \"^2.0.13\",\n```",
  "lineRange": [
    36,
    39
  ]
}
```

## Assistant

Now update the SEO docs page to accurately reflect the actual implementation AND document the new `Metadata` component:

**Tool Use:** `create_file`

```json
{
  "path": "/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/seo.mdx",
  "content": "---\ntitle: SEO\ndescription: Global meta tags, Open Graph, Twitter Cards, robots.txt, and per-page metadata.\n---\n\n# SEO\n\nGlobal SEO defaults (meta tags, Open Graph, Twitter Cards, robots.txt) plus a `<Metadata>` component for per-page overrides.\n\n## Installation\n\n```bash\nbun add @manicjs/seo\n```\n\n## Quick Start\n\n### 1. Configure Global Defaults\n\n```ts\n// manic.config.ts\nimport { defineConfig } from 'manicjs/config';\nimport { seo } from '@manicjs/seo';\n\nexport default defineConfig({\n  plugins: [\n    seo({\n      hostname: 'https://example.com',\n      title: 'My App',\n      description: 'Build amazing apps with Manic',\n    }),\n  ],\n});\n```\n\n### 2. Override Per Page\n\n```tsx\n// app/routes/about.tsx\nimport { Metadata } from '@manicjs/seo/metadata';\n\nexport default function About() {\n  return (\n    <>\n      <Metadata\n        title=\"About Us\"\n        description=\"Learn more about our company\"\n        ogImage=\"/images/about-og.png\"\n      />\n      <h1>About Us</h1>\n    </>\n  );\n}\n```\n\nThe `<Metadata>` component overrides the global defaults for that page. When the user navigates away, the previous values are restored automatically.\n\n---\n\n## Global Options\n\n<TypeTable\n  type={{\n    hostname: {\n      type: 'string',\n      required: true,\n      description: 'Base URL of the site (e.g. \"https://example.com\")',\n    },\n    title: {\n      type: 'string',\n      description: 'Default page title',\n    },\n    description: {\n      type: 'string',\n      description: 'Default meta description',\n    },\n    author: {\n      type: 'string',\n      description: 'Author name',\n    },\n    twitter: {\n      type: 'TwitterConfig',\n      description: 'Twitter Card settings',\n    },\n    openGraph: {\n      type: 'OpenGraphConfig',\n      description: 'Open Graph settings',\n    },\n    rules: {\n      type: 'RobotRule[]',\n      description: 'Crawler rules for robots.txt (defaults to allow all)',\n    },\n    sitemaps: {\n      type: 'string[]',\n      description: 'Additional sitemap URLs for robots.txt',\n    },\n    autoSitemap: {\n      type: 'boolean',\n      default: 'true',\n      description: 'Auto-add /sitemap.xml to robots.txt when @manicjs/sitemap is used',\n    },\n    linkHeaders: {\n      type: 'LinkHeader[]',\n      description: 'Extra RFC 8288 Link headers added to all HTML responses',\n    },\n    contentSignals: {\n      type: 'ContentSignals',\n      description: 'Content-Signal directives appended to robots.txt',\n    },\n  }}\n/>\n\n### TwitterConfig\n\n<TypeTable\n  type={{\n    card: {\n      type: \"'summary' | 'summary_large_image' | 'app' | 'player'\",\n      description: 'Card type',\n    },\n    site: {\n      type: 'string',\n      description: '@username for the site',\n    },\n    creator: {\n      type: 'string',\n      description: '@username of content creator',\n    },\n  }}\n/>\n\n### OpenGraphConfig\n\n<TypeTable\n  type={{\n    type: {\n      type: 'string',\n      description: 'OG type (e.g. \"website\", \"article\")',\n    },\n    locale: {\n      type: 'string',\n      description: 'Locale (e.g. \"en_US\")',\n    },\n    image: {\n      type: 'string',\n      description: 'Default OG image URL',\n    },\n    siteName: {\n      type: 'string',\n      description: 'Site name for OG',\n    },\n  }}\n/>\n\n### RobotRule\n\n<TypeTable\n  type={{\n    userAgent: {\n      type: 'string',\n      description: 'User agent pattern (e.g. \"*\", \"GoogleBot\")',\n    },\n    allow: {\n      type: 'string[]',\n      description: 'Allowed paths',\n    },\n    disallow: {\n      type: 'string[]',\n      description: 'Disallowed paths',\n    },\n    crawlDelay: {\n      type: 'number',\n      description: 'Crawl delay in seconds',\n    },\n  }}\n/>\n\n### ContentSignals\n\n<TypeTable\n  type={{\n    'ai-train': {\n      type: \"'yes' | 'no'\",\n      description: 'Allow AI training on content',\n    },\n    search: {\n      type: \"'yes' | 'no'\",\n      description: 'Allow search engine indexing',\n    },\n    'ai-input': {\n      type: \"'yes' | 'no'\",\n      description: 'Allow AI input from content',\n    },\n  }}\n/>\n\n---\n\n## Full Example\n\n```ts\n// manic.config.ts\nimport { defineConfig } from 'manicjs/config';\nimport { seo } from '@manicjs/seo';\n\nexport default defineConfig({\n  plugins: [\n    seo({\n      hostname: 'https://example.com',\n      title: 'My App',\n      description: 'Build amazing apps with Manic',\n      author: 'John Doe',\n      twitter: {\n        card: 'summary_large_image',\n        site: '@myapp',\n        creator: '@johndoe',\n      },\n      openGraph: {\n        type: 'website',\n        locale: 'en_US',\n        image: 'https://example.com/og.png',\n        siteName: 'My App',\n      },\n      rules: [\n        { userAgent: '*', allow: ['/'], disallow: ['/admin'] },\n      ],\n      contentSignals: {\n        'ai-train': 'no',\n        search: 'yes',\n      },\n    }),\n  ],\n});\n```\n\n## Generated Output\n\nThe plugin generates:\n\n### Meta Tags (injected into `<head>`)\n\n```html\n<meta name=\"title\" content=\"My App\">\n<meta name=\"description\" content=\"Build amazing apps with Manic\">\n<meta name=\"author\" content=\"John Doe\">\n\n<!-- Open Graph -->\n<meta property=\"og:title\" content=\"My App\">\n<meta property=\"og:description\" content=\"Build amazing apps with Manic\">\n<meta property=\"og:url\" content=\"https://example.com\">\n<meta property=\"og:type\" content=\"website\">\n<meta property=\"og:image\" content=\"https://example.com/og.png\">\n<meta property=\"og:site_name\" content=\"My App\">\n\n<!-- Twitter Card -->\n<meta name=\"twitter:card\" content=\"summary_large_image\">\n<meta name=\"twitter:site\" content=\"@myapp\">\n<meta name=\"twitter:title\" content=\"My App\">\n<meta name=\"twitter:description\" content=\"Build amazing apps with Manic\">\n```\n\n### robots.txt\n\n```\nUser-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: https://example.com/sitemap.xml\n\nContent-Signal: ai-train=no, search=yes\n```\n\n---\n\n## Per-Page Metadata\n\nThe `<Metadata>` component lets you override global SEO defaults on individual pages. It renders nothing visible — it manages `<head>` tags via side effects.\n\n```tsx\nimport { Metadata } from '@manicjs/seo/metadata';\n```\n\n### Props\n\n<TypeTable\n  type={{\n    title: {\n      type: 'string',\n      description: 'Page title — sets <title>, og:title, and twitter:title',\n    },\n    description: {\n      type: 'string',\n      description: 'Sets name=\"description\", og:description, twitter:description',\n    },\n    author: {\n      type: 'string',\n      description: 'Sets name=\"author\"',\n    },\n    canonical: {\n      type: 'string',\n      description: 'Canonical URL — creates <link rel=\"canonical\">',\n    },\n    ogImage: {\n      type: 'string',\n      description: 'OG image URL — sets og:image and twitter:image',\n    },\n    ogType: {\n      type: 'string',\n      description: 'OG type override',\n    },\n    ogUrl: {\n      type: 'string',\n      description: 'OG URL override',\n    },\n    ogLocale: {\n      type: 'string',\n      description: 'OG locale override',\n    },\n    ogSiteName: {\n      type: 'string',\n      description: 'OG site name override',\n    },\n    twitterCard: {\n      type: \"'summary' | 'summary_large_image' | 'app' | 'player'\",\n      description: 'Twitter card type override',\n    },\n    twitterSite: {\n      type: 'string',\n      description: 'Twitter site handle override',\n    },\n    twitterCreator: {\n      type: 'string',\n      description: 'Twitter creator handle override',\n    },\n  }}\n/>\n\n### Usage Examples\n\n#### Static Metadata\n\n```tsx\n// app/routes/about.tsx\nimport { Metadata } from '@manicjs/seo/metadata';\n\nexport default function About() {\n  return (\n    <>\n      <Metadata\n        title=\"About Us\"\n        description=\"Learn more about our company\"\n        canonical=\"https://example.com/about\"\n      />\n      <h1>About Us</h1>\n    </>\n  );\n}\n```\n\n#### Dynamic Metadata\n\nUse variables and state to set metadata dynamically:\n\n```tsx\n// app/routes/blog/[slug].tsx\nimport { Metadata } from '@manicjs/seo/metadata';\nimport { useRouter } from 'manicjs';\n\nconst posts = {\n  'hello-world': { title: 'Hello World', excerpt: 'My first post', image: '/images/hello.png' },\n  'react-tips': { title: 'React Tips', excerpt: 'Useful React patterns', image: '/images/react.png' },\n};\n\nexport default function BlogPost() {\n  const { params } = useRouter();\n  const post = posts[params.slug];\n\n  if (!post) return <div>Post not found</div>;\n\n  return (\n    <>\n      <Metadata\n        title={post.title}\n        description={post.excerpt}\n        ogImage={post.image}\n        ogType=\"article\"\n      />\n      <article>\n        <h1>{post.title}</h1>\n        <p>{post.excerpt}</p>\n      </article>\n    </>\n  );\n}\n```\n\n#### With Fetched Data\n\n```tsx\nimport { Metadata } from '@manicjs/seo/metadata';\nimport { useState, useEffect } from 'react';\n\nexport default function Product() {\n  const [product, setProduct] = useState(null);\n\n  useEffect(() => {\n    fetch('/api/product/1').then(r => r.json()).then(setProduct);\n  }, []);\n\n  return (\n    <>\n      {product && (\n        <Metadata\n          title={product.name}\n          description={product.description}\n          ogImage={product.image}\n        />\n      )}\n      <div>{product?.name ?? 'Loading...'}</div>\n    </>\n  );\n}\n```\n\n### How It Works\n\n1. On mount, `<Metadata>` updates existing `<meta>` / `<link>` tags or creates new ones in `<head>`\n2. It saves the previous values of any tags it modifies\n3. On unmount (when navigating away), it restores the original values — so global SEO defaults come back automatically\n4. Tags created by `<Metadata>` that didn't exist before are removed on cleanup\n\n---\n\n## Integration with Sitemap\n\nWorks with `@manicjs/sitemap` for complete SEO:\n\n```ts\nimport { defineConfig } from 'manicjs/config';\nimport { seo } from '@manicjs/seo';\nimport { sitemap } from '@manicjs/sitemap';\n\nexport default defineConfig({\n  plugins: [\n    seo({\n      hostname: 'https://example.com',\n      title: 'My App',\n    }),\n    sitemap({\n      hostname: 'https://example.com',\n    }),\n  ],\n});\n```\n\nWhen `autoSitemap` is `true` (the default), the SEO plugin automatically adds `/sitemap.xml` to `robots.txt` and emits a `Link` header for sitemap discovery.\n\n## See Also\n\n- [Sitemap](/docs/framework/plugins/sitemap) - Auto-generate sitemap.xml\n- [Theme API](/docs/api/theme) - Dark mode integration\n"
}
```

## User

**Tool Result:** `toolu_vrtx_01EufYjq4cKrUZ9j9TQ5HCF1`

```
Successfully created file /Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/seo.mdx
```

## Assistant

Now let me verify the component builds properly:

**Tool Use:** `Bash`

```json
{
  "cmd": "bun build plugins/seo/src/metadata.tsx --no-bundle --target=browser 2>&1 | head -20",
  "cwd": "/Users/marban/Documents/Coding/manic"
}
```

## User

**Tool Result:** `toolu_vrtx_0184gmmA1iLznudaoBMEr4tQ`

```
{
  "output": "import { useEffect, useRef } from \"react\";\nconst MANIC_ATTR = \"data-manic-seo\";\nfunction upsertMeta(attr, key, value, tracker) {\n  const selector = `meta[${attr}=\"${key}\"]`;\n  let el = document.head.querySelector(selector);\n  const previous = el?.getAttribute(\"content\") ?? null;\n  if (el) {\n    el.setAttribute(\"content\", value);\n  } else {\n    el = document.createElement(\"meta\");\n    el.setAttribute(attr, key);\n    el.setAttribute(\"content\", value);\n    el.setAttribute(MANIC_ATTR, \"\");\n    document.head.appendChild(el);\n  }\n  tracker.push({ element: el, previous });\n}\nfunction upsertLink(rel, href, tracker) {\n  const selector = `link[rel=\"${rel}\"]`;\n  let el = document.head.querySelector(selector);\n",
  "exitCode": 0
}
```

## Assistant

Builds clean. Let me also verify the full SEO plugin resolves:

**Tool Use:** `Bash`

```json
{
  "cmd": "bun -e \"import { seo } from '@manicjs/seo'; console.log('seo:', typeof seo); import { Metadata } from '@manicjs/seo/metadata'; console.log('Metadata:', typeof Metadata);\" 2>&1",
  "cwd": "/Users/marban/Documents/Coding/manic"
}
```

## User

**Tool Result:** `toolu_vrtx_01PjM15xHzWQh6zUwSbHyMwP`

```
{
  "output": "error: Cannot find module '@manicjs/seo' from '/Users/marban/Documents/Coding/manic/[eval]'\n\nBun v1.3.13 (macOS arm64)\n",
  "exitCode": 1
}
```

## Assistant

**Tool Use:** `Bash`

```json
{
  "cmd": "bun install 2>&1 | tail -5",
  "cwd": "/Users/marban/Documents/Coding/manic"
}
```

## User

*(interrupted)*

**Tool Result:** `toolu_vrtx_01H1dsWuWbudVT52oc22xWpD`

```
{
  "output": "Resolving dependencies\nResolved, downloaded and extracted [28]\nSaved lockfile\n\nChecked 556 installs across 756 packages (no changes) [4.51s]\n",
  "exitCode": 0
}
```

## User

ok lets compare the docs and add stuff. do remaining later

## Assistant

I'll fix all remaining plugin docs in parallel — each one is independent:

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/tailwind.mdx` to match the actual implementation.\n\nThe ACTUAL implementation in `plugins/tailwind/src/index.ts` is:\n```ts\nexport function tailwind(): ManicPlugin {\n  return {\n    name: '@manicjs/tailwind',\n    bunfig: `[serve.static]\\nplugins = [\"bun-plugin-tailwind\"]`,\n  };\n}\n```\n\nIt takes NO options. It's a zero-config wrapper around `bun-plugin-tailwind`. The current docs falsely document `content`, `darkMode`, and `safelist` options that don't exist.\n\nRewrite the docs to:\n- Show `tailwind()` takes no options\n- Explain it's a zero-config wrapper around `bun-plugin-tailwind`\n- Keep the CSS import example (`@import \"tailwindcss\"`)\n- Keep the dark mode usage guidance (it's valid Tailwind usage, just not plugin options)\n- Keep the `useTheme` integration example (it's real, exported from `manicjs`)\n- Remove the fake Options TypeTable\n- Remove the fake Example Configuration with options\n- Keep CSS Functions and JIT Mode sections as-is (they're Tailwind features, not plugin config)\n- Customize Tailwind via standard `@theme` CSS directives or `tailwind.config.ts`",
  "description": "Fix Tailwind plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/unocss.mdx` to match the actual implementation.\n\nThe ACTUAL implementation in `plugins/unocss/src/index.ts` is:\n```ts\nexport function unocss(config?: UserConfig): ManicPlugin {\n  return {\n    name: '@manicjs/unocss',\n    bunfig: `[serve.static]\\nplugins = [\"bun-plugin-unocss\"]`,\n  };\n}\n```\n\nThe `config` param is accepted but UNUSED. Config is read from `uno.config.ts` in the project root.\n\nThe current docs falsely document inline `presets`, `rules`, `shortcuts`, `theme` options as if they're passed to `unocss()`.\n\nRewrite the docs to:\n- Show `unocss()` takes no meaningful options\n- Explain all UnoCSS configuration goes in `uno.config.ts` at the project root\n- Remove the fake Options TypeTable\n- Keep the presets/rules/shortcuts/icons/theme examples but reframe them as `uno.config.ts` configuration, NOT as `unocss()` plugin options\n- Keep the comparison table vs Tailwind\n- Update all code examples to show `uno.config.ts` instead of `manic.config.ts` for UnoCSS-specific config\n- The `manic.config.ts` only needs `unocss()` with no args",
  "description": "Fix UnoCSS plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mdx.mdx` to match the actual implementation.\n\nThe ACTUAL implementation has two layers:\n\n1. `plugins/mdx/src/index.ts` - The `mdx()` Manic plugin function. Accepts `MdxPluginOptions` but can only serialize non-function options to env:\n   - `filter` (RegExp)\n   - `frontmatterName` (string, default 'frontmatter')\n   - `disableGfm` (boolean, default false)\n   - `disableFrontmatter` (boolean, default false)\n   - `toc` (boolean, default false) — uses fumadocs-core\n   - `highlight` (boolean | { light: string; dark: string }, default false) — uses rehype-pretty-code\n   - `mdxOptions` (CompileOptions minus plugins)\n\n2. `plugins/mdx/src/bun-plugin.ts` - The `mdxBunPlugin()` escape hatch at `@manicjs/mdx/bun-plugin`. This ALSO accepts `remarkPlugins` and `rehypePlugins` (function arrays that can't be serialized).\n\nThe current docs are WRONG:\n- Uses `gfm` option name — actual is `disableGfm` (inverted logic)\n- Uses `frontmatter` option name — actual is `disableFrontmatter` (inverted logic)  \n- Claims `remarkPlugins`/`rehypePlugins` work via `mdx()` — they DON'T (can't serialize functions). Must use `mdxBunPlugin()` directly\n- Claims \"Code blocks use Shiki by default\" — false, `highlight` defaults to `false`\n- Shows a fictional `MDX` runtime component and `~/toc` import\n\nRewrite to:\n- Document the real options with correct names\n- Show the `mdx()` config for serializable options\n- Add a section explaining `@manicjs/mdx/bun-plugin` for custom remark/rehype plugins\n- Fix the TOC usage — it exports `toc` from the MDX file itself via fumadocs-core\n- Fix highlighting — it's opt-in via `highlight: true`\n- Keep the GFM, frontmatter, and component usage examples (they're valid)\n- Remove the fictional MDX runtime component example",
  "description": "Fix MDX plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/sitemap.mdx` to match the actual implementation.\n\nThe ACTUAL implementation in `plugins/sitemap/src/index.ts` and `generate.ts`:\n\n```ts\nexport interface SitemapConfig {\n  hostname: string;       // REQUIRED\n  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; // default \"weekly\"\n  priority?: number;      // default 0.8\n  exclude?: string[];     // routes to exclude\n}\n```\n\nIt uses `createPlugin` with `staticFiles` to emit `/sitemap.xml`. Dynamic routes are automatically excluded.\n\nThe current docs are massively over-documented with features that DON'T EXIST:\n- `outDir`, `filename` — output is always `/sitemap.xml`\n- `ignoreRoutes` — actual option is `exclude`\n- `extraRoutes` — not implemented\n- `lastmod` — not implemented\n- `trailingSlash` — not implemented\n- `priority` as boolean auto-calc — it's actually a number\n- Sitemap index / multiple sitemaps — not implemented\n- `robotsTxt` integration — not implemented (that's the SEO plugin's job)\n- Multi-language support — not implemented\n- `maxUrlsPerSitemap` — not implemented\n- Quick start shows `sitemap()` with no hostname but hostname is REQUIRED\n\nRewrite to:\n- Document only the 4 real options\n- Show hostname is required in all examples\n- Explain dynamic routes are auto-excluded\n- Show integration with `@manicjs/seo` for robots.txt\n- Remove ALL fictional advanced features\n- Keep it concise and accurate",
  "description": "Fix Sitemap plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/mcp.mdx` to match the actual implementation.\n\nThe ACTUAL implementation in `plugins/mcp/src/`:\n\nMcpConfig interface:\n```ts\nexport interface McpConfig {\n  name?: string;     // default \"manic-mcp\"\n  version?: string;  // default \"1.0.0\"\n  path?: string;     // default \"/mcp\"\n  tools?: McpTool[]; // additional tools\n}\n```\n\nMcpTool interface (from tool.ts):\n```ts\nexport interface McpTool {\n  name: string;\n  description: string;\n  inputSchema: { type: 'object'; properties?: Record<string, unknown>; required?: string[] };\n  execute(args: Record<string, unknown>): Promise<unknown> | unknown;\n}\n```\n\n`defineTool(name, { description, input, execute })` — typed tool definition with Zod schema.\n\nBuilt-in tools (from default-tools.ts):\n- `get_routes` — returns all page routes\n- `get_api_routes` — returns all API routes\n- `get_page_meta` — fetches a page, extracts title/meta/canonical\n- `get_rendered_elements` — fetches a page, returns simplified element list\n- `get_console_logs` — (dev only) returns captured browser console logs\n\nDiscovery endpoints:\n- `/.well-known/mcp.json`\n- `/.well-known/mcp/server-card.json`\n- `/.well-known/agent-skills/index.json`\n- `/.well-known/agent-skills/use-mcp/SKILL.md`\n\nAlso serves `/webmcp.js` and injects `<script src=\"/webmcp.js\"></script>` for browser-side WebMCP integration.\n\nThe current docs are WRONG:\n- Uses `enabled` option — doesn't exist\n- Uses `route` option — actual is `path`\n- Default is `/mcp`, NOT `/api/mcp`\n- Documents `resources`, `prompts`, `auth` — NONE exist\n- Tool examples use `handler` — actual is `execute`\n- Shows inline tool definitions without Zod — should show `defineTool()` as the primary API\n- Doesn't document built-in tools or discovery endpoints\n\nRewrite to:\n- Document the real 4 options\n- Show `defineTool()` with Zod as primary tool creation API\n- Also show raw `McpTool` interface for non-Zod usage\n- Document built-in tools\n- Document discovery endpoints\n- Document WebMCP browser integration\n- Remove resources/prompts/auth sections entirely\n- Remove the \"Supported AI Clients\" table (misleading)",
  "description": "Fix MCP plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Rewrite `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/plugins/api-docs.mdx` to match the actual implementation.\n\nThe ACTUAL implementation in `plugins/api-docs/src/index.ts`:\n\n```ts\nexport interface ApiDocsOptions {\n  path?: string;     // default \"/docs\"\n  specUrl?: string;  // default \"/openapi.json\"\n  theme?: string;    // Scalar theme, default \"default\"\n}\n\nexport function apiDocs(options: ApiDocsOptions = {}): ManicPlugin {\n  // Mounts Scalar UI at the given path using @scalar/hono-api-reference\n  // Only has configureServer hook — NO build hook\n}\n```\n\nThe current docs are massively over-documented:\n- Uses `route` — actual is `path`\n- Default is `/docs`, NOT `/api/docs`\n- `spec` (inline OpenAPI) — not implemented\n- `output` — not implemented\n- `title` — not implemented\n- `favicon` — not implemented\n- `autoGenerate` — not implemented\n- `auth` — not implemented\n- `colors` — not implemented\n- `enabled` — not implemented\n- `generateFile` — not implemented\n- Multiple themes (`scalar`, `openapi`, `stoplight`) — only passes through to Scalar\n\nRewrite to:\n- Document only the 3 real options: `path`, `specUrl`, `theme`\n- Explain it mounts Scalar UI and points at a spec URL\n- The OpenAPI spec itself must be provided separately (e.g. via an API route that returns the spec)\n- Mention it has NO build hook (dev/server only currently)\n- Remove ALL fictional features\n- Keep it concise",
  "description": "Fix API Docs plugin docs"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Fix `/Users/marban/Documents/Coding/manic/docs/content/docs/framework/advanced/plugins.mdx` — it has wrong imports throughout.\n\nIssues to fix:\n1. All plugin imports use `import X from '...'` (default imports) but actual exports are named: `import { tailwind } from '@manicjs/tailwind'`, `import { mdx } from '@manicjs/mdx'`, etc.\n2. `import tailwind from '@manicjs/tailwind'` → `import { tailwind } from '@manicjs/tailwind'`\n3. `import mdx from '@manicjs/mdx'` → `import { mdx } from '@manicjs/mdx'`\n4. `import sitemap from '@manicjs/sitemap'` → `import { sitemap } from '@manicjs/sitemap'`\n5. `import seo from '@manicjs/seo'` → `import { seo } from '@manicjs/seo'`\n6. `import apiDocs from '@manicjs/api-docs'` → `import { apiDocs } from '@manicjs/api-docs'`\n7. `import unocss from '@manicjs/unocss'` → `import { unocss } from '@manicjs/unocss'`\n8. The SEO example uses `openGraph: { images: [...] }` — actual is `openGraph: { image: '...' }` (single string, not array)\n9. The SEO example is missing required `hostname` field\n10. The sitemap example calls `sitemap()` with no args but `hostname` is required\n11. The ManicPluginContext interface shown is wrong — `pageRoutes` type is `PageRoute[]` not `string[]`, `emitClientFile` is on `ManicBuildPluginContext` not `ManicPluginContext`\n12. The `createPlugin` custom plugin example uses `enabled` which is not a real createPlugin option\n13. Line 248: `ctx.emitClientFile('/assets/custom.css', ...)` — path should not have leading slash\n\nFix all these issues. Use `edit_file` for targeted replacements.",
  "description": "Fix advanced/plugins.mdx imports"
}
```

**Tool Use:** `Task`

```json
{
  "prompt": "Fix `/Users/marban/Documents/Coding/manic/docs/content/docs/core/architecture.mdx` — it has wrong imports and examples.\n\nIssues to fix:\n1. Line 324: `import { defineTool } from 'manicjs/config'` → should be `import { defineConfig } from 'manicjs/config'`\n2. Line 325-327: `import tailwind from '@manicjs/tailwind'` → `import { tailwind } from '@manicjs/tailwind'`, same for seo and sitemap (named exports, not default)\n3. Line 330: `defineTool({` → `defineConfig({`\n4. Lines 333-335: `seo({ robots: 'follow', canonical: '...' })` — these are not real options. Replace with `seo({ hostname: 'https://example.com', title: 'My App' })`\n5. Line 336: `sitemap()` — missing required `hostname`. Replace with `sitemap({ hostname: 'https://example.com' })`\n6. Lines 348-349: `name: 'My App'` and `description: 'Built with Manic'` are not top-level config options — they belong under `app: { name: '...' }`. Remove `description` entirely (not in config).\n7. Line 355: `sourcemaps: false` → should be `sourcemap: false` (no 's')\n8. Line 360: `host: '0.0.0.0'` — `host` is not a real server config option. Remove it.\n9. Line 349: `import tailwind from '@manicjs/tailwind'` → `import { tailwind } from '@manicjs/tailwind'`\n\nUse `edit_file` for targeted replacements. Read the file first to confirm exact line content.",
  "description": "Fix architecture.mdx wrong imports/examples"
}
```

## User

**Tool Result:** `toolu_vrtx_01KndKvi3j3W6TtzcHf8de1F`

```
Done. Removed the fake `Options` TypeTable and the example configuration with non-existent `content`/`darkMode`/`safelist` options. Added a **Customization** section explaining that configuration happens via standard Tailwind CSS v4 mechanisms (`@theme` directives and `tailwind.config.ts`), and kept all the real usage sections intact.
```

**Tool Result:** `toolu_vrtx_016Rr19ZMwCGTdoqAa4kQBYA`

```
Rewrote the docs to match the actual implementation: `unocss()` is called with no args in `manic.config.ts`, the fake `Options` TypeTable is removed, and all UnoCSS configuration examples (presets, rules, shortcuts, icons, theme) now correctly show `uno.config.ts` as the configuration source. The comparison table and See Also links are preserved.
```

**Tool Result:** `toolu_vrtx_014LGeuFp6ix1VxkUm1Etfk4`

```
Rewrote the docs to match the actual implementation — fixed option names (`disableGfm`/`disableFrontmatter`), documented the serialization boundary between `mdx()` and `mdxBunPlugin()`, corrected TOC usage (named export from the MDX file via fumadocs-core), made highlighting opt-in, and removed the fictional `<MDX>` component and `~/toc` import.
```

**Tool Result:** `toolu_vrtx_017eaQMX51GsJLYHaR9HbcD2`

```
Rewritten to match the actual implementation. Removed all fictional features (`outDir`, `filename`, `ignoreRoutes`, `extraRoutes`, `lastmod`, `trailingSlash`, `robotsTxt`, sitemap index, multi-language, `maxUrlsPerSitemap`) and documented only the 4 real options (`hostname`, `changefreq`, `priority`, `exclude`), with `hostname` required in every example. Added a section explaining automatic dynamic route exclusion and kept the SEO integration reference accurate.
```

**Tool Error:** `toolu_vrtx_019yf8jrksEPtQ8EDLT1AJQ9`

**Error:** {"message":"Subagent error: Out of Credits - Add credits to keep using Amp."}

**Tool Result:** `toolu_vrtx_01PYjXX4cRhzu9GWsM6SJnu7`

```
Rewrote the docs to match the actual implementation — only the 3 real options (`path`, `specUrl`, `theme`), a note that the spec must be provided separately, and a callout about the dev-only limitation. All fictional features removed.
```

**Tool Error:** `toolu_vrtx_01EUYBMi1797AzqKdgJqa3WM`

**Error:** {"message":"Subagent error: Out of Credits - Add credits to keep using Amp."}

**Tool Result:** `toolu_vrtx_01EvCQLKCDpF4d9oPtVg9NBn`

```
All 9 issues fixed: `defineTool`→`defineConfig`, default→named imports for plugins, corrected `seo()`/`sitemap()` options, moved `name` under `app: {}`, removed `description`, `sourcemaps`→`sourcemap`, and removed invalid `host` option.
```
