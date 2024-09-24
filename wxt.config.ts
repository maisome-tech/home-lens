import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: [
      // Add any necessary permissions here
      "activeTab",
      "storage"
    ],
    // ... other manifest configurations
  },
  modules: ['@wxt-dev/module-react'],
});
