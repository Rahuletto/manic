import fumadocsMdx from "fumadocs-mdx/vite";
import vinext from "vinext";
import { defineConfig } from "vite";
import fumadocsConfig, { docs } from "./source.config";

export default defineConfig(async () => ({
	plugins: [
		await fumadocsMdx({ default: fumadocsConfig, docs }),
		vinext(),
	],
	resolve: {
		dedupe: [
			"fumadocs-core",
			"fumadocs-ui",
			"fumadocs-mdx",
			"react",
			"react-dom",
		],
	},
	optimizeDeps: {
		exclude: ["fumadocs-core", "fumadocs-ui"],
	},
	ssr: {
		noExternal: ["fumadocs-core", "fumadocs-ui", "fumadocs-mdx"],
	},
}));
