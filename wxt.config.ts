import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  manifest: {
    name: "Carbon Quest",
    permissions: ["storage", "webRequest", "alarms"],
    host_permissions: ["<all_urls>"],
  },
});
