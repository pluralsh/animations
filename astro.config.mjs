import { defineConfig } from "astro/config";
import myConfig from "./src/siteConfig";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  integrations: [compress(), image()],
  ...myConfig,
});
