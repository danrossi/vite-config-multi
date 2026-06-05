import { PluginOption, UserConfig } from 'vite';
export interface PackageJson {
    name: string;
    version: string;
    license: string;
    author: string;
    description: string;
    [key: string]: any;
}
export interface EntryItem {
    entry: string;
    description: string;
    name?: string;
    entryName?: string;
    exclude_libraries?: string[];
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
    compress?: boolean;
    comments?: boolean;
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
