/**
 * Vite Config Multi Manifest Plugin
 * Append a distribution manifest from the multiple entries as the manifest is overwritten per build..
 * Put this plugin after vite-plugin-manifest-sri to get the manifest with the generated hash
 *
 * @author danielr <danielr@electroteque.org>
 */
import { type Plugin } from 'vite';
export declare function vitePluginMultiManifest(manifestPath?: string): Plugin;
