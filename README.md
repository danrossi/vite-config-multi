# vite-config-multi
Vite config helper that supporta a multi entry build system

A multi manifest plugin is provided to handle updating a distribution manifest with the multiple entries including hashes.

## Basic

```ts
import { defineConfig } from "vite";
import { defineMultiConfig, type BuildConfig, type EntryItem, type EntrySources, type PackageJson } from 'vite-config-multi';
import pkg from './package.json' with { type: 'json' };

const entries: EntrySources = {
  'entry1': {
    entry: 'entry1.ts',
    description: 'Entry 1',
  },
  'entry2': {
    entry: 'entry2.ts',
    description: 'Entry 2',
    plugins: [
      
    ],
  },
};

const config: BuildConfig = {
  plugins: [],
  entries: entries,
  pkg: pkg,
  external: [
  ],
  globals: {
  },
  alias: {
  },
};

export default defineConfig(({ mode }) => {
  return {
    ...defineMultiConfig(mode, config).config,
    ...{},
  } as UserConfig;
});
```

## Package Script Setup

```json
 "scripts": {
    "entry1:build": "ENTRY=entry1 vite --config vite.config.ts build",
    "entry1:dev": "ENTRY=entry1 vite --config vite.config.ts build --mode dev",
    "entry2:build": "ENTRY=entry2 vite --config vite.config.ts build",
    "entry2:dev": "ENTRY=entry2 vite --config vite.config.ts build --mode dev",
 }
```

## Build

```sh
npm run entry1:dev
npm run entry1:build
npm run entry2:dev
npm run entry2:build
```


# Multi Manifest Plugin

To support updating a distribution manifest from the multiple entries. Use the multi manifest plugin to take each generated manifest including hash
then merge with the current distribution manifest.

```
import { defineMultiConfig, type BuildConfig, type EntryItem, type EntrySources, type PackageJson, vitePluginMultiManifest } from 'vite-config-multi';
import manifestSRI from 'vite-plugin-manifest-sri'

const config: BuildConfig = {
  plugins: [
    manifestSRI(),
    vitePluginMultiManifest()
  ],
  entries: entries,
  pkg: pkg,
  external: [
  ],
  globals: {
  },
  alias: {
  },
};

export default defineConfig(({ mode }) => {
  return {
    ...defineMultiConfig(mode, config).config,
    ...{},
  } as UserConfig;
});

...


```