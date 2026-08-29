import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  base: "/foothill/bandreview-2024/",
  build: {
    format: 'preserve',
  },
  integrations: [preact()],
  vite: {
    plugins: [{
      name: 'strip-all-unused-client-js',
      generateBundle(_, bundle) {
        for (const fileName in bundle) {
          // Drops preact, signals, client, and any standalone JS chunks in the asset folder
          if (
            fileName.includes('preact') ||
            fileName.includes('signals') ||
            fileName.includes('client') ||
            fileName.endsWith('.js')
          ) {
            delete bundle[fileName];
          }
        }
      }
    }]
  }
});