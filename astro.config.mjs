import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.serendipity.org',
  base: "/foothill/bandreview-2026/",
  build: {
    format: 'preserve',
  },
});