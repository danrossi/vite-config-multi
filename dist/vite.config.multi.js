import path, { resolve } from "path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createLogger } from "vite";
//#region src/vite-plugin-multi-manifest.ts
/**
* Vite Config Multi Manifest Plugin
* Append a distribution manifest from the multiple entries as the manifest is overwritten per build..
* Put this plugin after vite-plugin-manifest-sri to get the manifest with the generated hash
* 
* @author danielr <danielr@electroteque.org>
*/
var logger = createLogger();
function vitePluginMultiManifest(manifestPath = path.resolve("build/manifest.json")) {
	return {
		name: "vite-plugin-multi-manifest",
		enforce: "post",
		async writeBundle(options, bundle) {
			const [fileName, chunk] = Object.entries(bundle).filter(([key, entry]) => entry.type === "asset" && ["manifest.json", ".vite/manifest.json"].includes(key))[0];
			if (!chunk) return;
			let existingManifest = {};
			try {
				existingManifest = await readFile(manifestPath, "utf-8").then(JSON.parse, () => void 0);
			} catch (e) {}
			const newManifest = await readFile(resolve(options.dir, fileName), "utf-8").then(JSON.parse, () => void 0);
			const mergedManifest = {
				...existingManifest,
				...newManifest
			};
			await mkdir(path.dirname(manifestPath), { recursive: true });
			await writeFile(manifestPath, JSON.stringify(mergedManifest, null, 2));
			logger.info(`Completed Updating Manifest ${manifestPath}`);
		}
	};
}
//#endregion
//#region src/vite.config.multi.ts
/**
* Vite Config Multi Entry Build System
* Provides a build system tp accept multiple entries in the one config with different plugins and configs
* 
* @author danielr <danielr@electroteque.org>
*/
function getEntry(entries) {
	const entryEnv = process.env.ENTRY && process.env.ENTRY;
	const entrySource = entries[entryEnv];
	if (entrySource === void 0) throw new Error("ENTRY is not defined or is not valid");
	entrySource.name = entryEnv;
	return entrySource;
}
function defineMultiConfig(mode, options) {
	let isDev = mode == "dev";
	const config = Object.assign({
		rootDir: "./",
		srcDir: "src",
		outDir: "dist",
		entryName: `[name].js`,
		plugins: [],
		entries: {},
		pkg: {},
		alias: {},
		globals: {},
		external: [],
		define: {},
		mangle: true,
		compress: true,
		minify: true,
		manifest: false,
		comments: isDev ? true : false
	}, options);
	const cwd = process.cwd();
	const input = {};
	let entry = process.env.ENTRY && getEntry(config.entries || {}) || config.entry;
	if (entry) {
		let lib;
		if (entry.lib) lib = entry.lib;
		else if (entry.entry) input[entry.name] = entry.entry;
		if (entry.entryName) config.entryName = entry.entryName;
		if (entry.plugins) config.plugins.push(...entry.plugins);
		let oxcMinify = {
			mangle: config.mangle,
			compress: config.compress
		};
		if (options.minify && options.minify == "terser") oxcMinify = void 0;
		return {
			entry,
			config: {
				root: path.join(cwd, config.srcDir),
				envDir: cwd,
				plugins: config.plugins,
				define: config.define,
				resolve: {
					preserveSymlinks: true,
					tsconfigPaths: true,
					alias: config.alias
				},
				build: {
					minify: isDev ? false : config.minify,
					outDir: config.outDir,
					emptyOutDir: false,
					sourcemap: false,
					manifest: !isDev ? config.manifest : false,
					target: "esnext",
					lib,
					rolldownOptions: {
						cwd,
						input,
						external: config.external,
						experimental: { attachDebugInfo: isDev ? "full" : "none" },
						output: {
							globals: config.globals,
							format: "es",
							entryFileNames: config.entryName,
							comments: config.comments,
							minify: isDev ? false : oxcMinify
						}
					}
				}
			}
		};
	} else return {
		entry: null,
		config: {}
	};
}
//#endregion
export { defineMultiConfig, getEntry, vitePluginMultiManifest };
