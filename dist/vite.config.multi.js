import path from "path";
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
		comments: isDev ? true : false
	}, options);
	const cwd = process.cwd();
	const input = {};
	let entry = process.env.ENTRY && getEntry(config.entries || {}) || config.entry;
	if (entry) {
		input[entry.name] = entry.entry;
		if (entry.entryName) config.entryName = entry.entryName;
		if (entry.plugins) config.plugins.push(...entry.plugins);
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
					minify: false,
					outDir: config.outDir,
					emptyOutDir: false,
					sourcemap: false,
					target: "esnext",
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
							minify: isDev ? false : {
								mangle: false,
								compress: true
							}
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
export { defineMultiConfig, getEntry };
