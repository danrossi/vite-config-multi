
/**
 * Vite Config Multi Manifest Plugin
 * Append a distribution manifest from the multiple entries as the manifest is overwritten per build..
 * Put this plugin after vite-plugin-manifest-sri to get the manifest with the generated hash
 * 
 * @author danielr <danielr@electroteque.org>
 */

import { promises as fs } from 'fs';
import path, { resolve } from 'path';
import { OutputAsset } from 'rolldown';
import type { Plugin } from 'vite';

export function vitePluginMultiManifest(manifestPath: string = path.resolve('build/manifest.json')): Plugin {
  return {
    name: 'vite-plugin-multi-manifest',
    enforce: 'post',
   
    async writeBundle(options, bundle) {
      const [fileName, chunk] = Object.entries(bundle).filter(([key, entry]) => entry.type === 'asset' && ["manifest.json", ".vite/manifest.json"].includes(key))[0];
      const manifestChunk = chunk as OutputAsset;

      if (!manifestChunk) return;
      
      let existingManifest = {};

      try {
        existingManifest = await fs.readFile(manifestPath, "utf-8").then(JSON.parse, () => void 0);
      } catch (e) {
         
      }


      const newManifest = await fs.readFile(resolve(options.dir!,fileName), "utf-8").then(JSON.parse, () => void 0);
      const mergedManifest = { ...existingManifest, ...newManifest };

      //console.log(mergedManifest);

      await fs.mkdir(path.dirname(manifestPath), { recursive: true });
      await fs.writeFile(manifestPath, JSON.stringify(mergedManifest, null, 2));

    }
  };
}