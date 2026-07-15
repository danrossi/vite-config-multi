/**
 * Vite Config Multi Entry Build System
 * Provides a build system tp accept multiple entries in the one config with different plugins and configs
 *
 * @author danielr <danielr@electroteque.org>
 */
import { BuildEnvironmentOptions, LibraryOptions, PluginOption, UserConfig } from 'vite';
export { vitePluginMultiManifest } from './vite-plugin-multi-manifest';
export interface PackageJson {
    name: string;
    version: string;
    license: string;
    author: string;
    description: string;
    [key: string]: any;
}
export interface EntryItem {
    entry?: string;
    description: string;
    name?: string;
    entryName?: string;
    plugins?: PluginOption[];
    lib?: LibraryOptions;
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
    compress?: boolean;
    comments?: boolean;
    minify?: BuildEnvironmentOptions["minify"];
    manifest?: boolean | string;
}
export interface MultiConfig {
    entry: EntryItem | null;
    config: UserConfig;
}
export interface InputItem {
    [key: string]: string;
}
export declare function getEntry(entries: EntrySources): EntryItem;
export declare function defineMultiConfig(mode: string, options: BuildConfig): MultiConfig;
