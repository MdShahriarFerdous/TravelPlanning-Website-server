import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

import { getDirName } from './src/utils/dirname'

// Getting the dirname ('__dirname')
const dirName = getDirName(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@app': path.resolve(dirName, './src'),
      '@store': path.resolve(dirName, './src/store'),
      '@components': path.resolve(dirName, './src/components'),
      '@modules': path.resolve(dirName, './src/modules'),
      '@pages': path.resolve(dirName, './src/pages'),
    },
  },
});
