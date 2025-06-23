import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuração do Vite
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    fs: {
      strict: true
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
