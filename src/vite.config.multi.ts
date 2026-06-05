
/**
 * Vite Config Multi Entry Build System
 * Provides a build system tp accept multiple entries in the one config with different plugins and configs
 * 
 * @author danielr <danielr@electroteque.org>
 */

import path from 'path';
import { PluginOption, UserConfig } from 'vite';

export interface PackageJson {
  name: string;
  version: string;
  license: string;
  author: string;
  description: string;
  [key: string]: any; // Allows other unknown package.json properties
}

export interface EntryItem {
  entry: string;
  description: string;
  name?:string;
  entryName?:string;
  plugins?: PluginOption[];
}

export interface EntrySources {
  [key: string]: EntryItem;
}

export interface BuildConfig {
  rootDir?: string;
  srcDir?: string;
  outDir?: string;
  plugins?: PluginOption[];
  entries?: EntrySources;
  entry?: EntryItem;
  entryName?: string;
  pkg?: PackageJson;
  alias?: any;
  external?: string[];
  globals?: any;
  define?: any;
  mangle?: boolean;
  compress?:boolean;
  comments?:boolean;
}

export interface MultiConfig {
  entry: EntryItem | null,
  config: UserConfig,
}

export interface InputItem {
  [key: string]: string;
}


export function getEntry(entries: EntrySources): EntryItem {
  const entryEnv = process.env.ENTRY && (process.env.ENTRY as string);
  const entrySource = entries[entryEnv!] as EntryItem;
  if (entrySource === undefined) {
    throw new Error('ENTRY is not defined or is not valid');
  }

  entrySource.name = entryEnv;

  return entrySource;
  
}

export function defineMultiConfig(mode: string, options: BuildConfig): MultiConfig {

  let isDev = mode == 'dev';

  const defaults: BuildConfig = {
    rootDir: './',
    srcDir: 'src',
    outDir: 'dist',
    //distDir: 'build',
    entryName: `[name].js`,
    plugins: [],
    entries: {},
    pkg: {} as PackageJson,
    alias: {},
    globals: {},
    external: [],
    define: {},
    mangle: true,
    compress: true,
    comments: isDev ? true : false
  };


  const config = Object.assign(defaults, options);

  const cwd = process.cwd();

  
  const input: InputItem = {};

  //get entry from entries and ENTRY env or a single entry
  let entry: EntryItem | undefined = process.env.ENTRY && getEntry(config.entries || {}) || config.entry;

  if (entry) {
    input[entry.name!] = entry.entry;
      

    if (entry.entryName) config.entryName = entry.entryName;

    if (entry.plugins) {
      config.plugins!.push(...entry.plugins);
    } 

    

    
    return {
      entry: entry,
      config: {
        root: path.join(cwd, config.srcDir!),
        envDir: cwd,
        plugins: config.plugins,
        define: config.define,
        resolve: {
          preserveSymlinks: true,
          tsconfigPaths: true,
          alias: config.alias,
        },
        build: {
          minify: false,
          outDir: config.outDir,
          emptyOutDir: false,
          sourcemap: false,
          target: 'esnext',
          rolldownOptions: {
            cwd: cwd,
            input: input,
            external: config.external,
            experimental: {
              attachDebugInfo: isDev ? 'full' : 'none',
            },
            output: {
              globals: config.globals,
              format: 'es',
              entryFileNames: config.entryName,
              comments: config.comments,
              minify: isDev ? false : { mangle: config.mangle, compress: config.compress }
            },
          },
        },
      } as UserConfig
    } as MultiConfig;
  } else {
    return {
      entry: null,
      config: {} as UserConfig
    } as MultiConfig;
  }

}
