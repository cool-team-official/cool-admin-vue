// vite.config.mts
import { fileURLToPath, URL } from "node:url";
import vue from "file:///D:/coding/cool/admin/front-next/node_modules/.pnpm/@vitejs+plugin-vue@5.0.3_vite@5.3.4_vue@3.4.15/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/coding/cool/admin/front-next/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.3.4_vue@3.4.15/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import compression from "file:///D:/coding/cool/admin/front-next/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.3.4/node_modules/vite-plugin-compression/dist/index.mjs";
import { visualizer } from "file:///D:/coding/cool/admin/front-next/node_modules/.pnpm/rollup-plugin-visualizer@5.9.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";

// src/config/proxy.ts
var proxy = {
  "/dev/": {
    target: "http://127.0.0.1:8001",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/dev/, "")
  },
  "/prod/": {
    target: "https://show.cool-admin.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/prod/, "/api")
  }
};

// vite.config.mts
import { cool } from "file:///D:/coding/cool/admin/front-next/node_modules/.pnpm/@cool-vue+vite-plugin@7.1.7/node_modules/@cool-vue/vite-plugin/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/coding/cool/admin/front-next/vite.config.mts";
function toPath(dir) {
  return fileURLToPath(new URL(dir, __vite_injected_original_import_meta_url));
}
var vite_config_default = ({ mode }) => {
  const isDev = mode === "development";
  return {
    plugins: [
      vue(),
      compression(),
      vueJsx(),
      // vueDevTools(),
      cool({
        type: "admin",
        proxy
      }),
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true
      })
    ],
    base: "/ttt/",
    server: {
      port: 9e3,
      proxy,
      hmr: {
        overlay: true
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false
        }
      }
    },
    resolve: {
      alias: {
        "/@": toPath("./src"),
        "/$": toPath("./src/modules"),
        "/#": toPath("./src/plugins"),
        "/~": toPath("./packages")
      }
    },
    esbuild: {
      // drop: isDev ? [] : ["console", "debugger"]
    },
    build: {
      minify: "esbuild",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: true,
      // 		drop_debugger: true
      // 	}
      // },
      sourcemap: isDev,
      rollupOptions: {
        output: {
          chunkFileNames: "static/js/[name]-[hash].js",
          entryFileNames: "static/js/[name]-[hash].js",
          assetFileNames: "static/[ext]/[name]-[hash].[ext]",
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (!["@cool-vue/crud"].find((e) => id.includes(e))) {
                if (id.includes("prettier")) {
                  return;
                }
                return id.toString().split("node_modules/")[1].replace(".pnpm/", "").split("/")[0];
              } else {
                return "comm";
              }
            }
          }
        }
      }
    }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIiwgInNyYy9jb25maWcvcHJveHkudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjb2RpbmdcXFxcY29vbFxcXFxhZG1pblxcXFxmcm9udC1uZXh0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RpbmdcXFxcY29vbFxcXFxhZG1pblxcXFxmcm9udC1uZXh0XFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY29kaW5nL2Nvb2wvYWRtaW4vZnJvbnQtbmV4dC92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB2dWVKc3ggZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZS1qc3hcIjtcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXCI7XG5pbXBvcnQgY29tcHJlc3Npb24gZnJvbSBcInZpdGUtcGx1Z2luLWNvbXByZXNzaW9uXCI7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xuaW1wb3J0IHsgcHJveHkgfSBmcm9tIFwiLi9zcmMvY29uZmlnL3Byb3h5XCI7XG5pbXBvcnQgeyBjb29sIH0gZnJvbSBcIkBjb29sLXZ1ZS92aXRlLXBsdWdpblwiO1xuXG5mdW5jdGlvbiB0b1BhdGgoZGlyOiBzdHJpbmcpIHtcblx0cmV0dXJuIGZpbGVVUkxUb1BhdGgobmV3IFVSTChkaXIsIGltcG9ydC5tZXRhLnVybCkpO1xufVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuXHRjb25zdCBpc0RldiA9IG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIjtcblxuXHRyZXR1cm4ge1xuXHRcdHBsdWdpbnM6IFtcblx0XHRcdHZ1ZSgpLFxuXHRcdFx0Y29tcHJlc3Npb24oKSxcblx0XHRcdHZ1ZUpzeCgpLFxuXHRcdFx0Ly8gdnVlRGV2VG9vbHMoKSxcblx0XHRcdGNvb2woe1xuXHRcdFx0XHR0eXBlOiBcImFkbWluXCIsXG5cdFx0XHRcdHByb3h5XG5cdFx0XHR9KSxcblx0XHRcdHZpc3VhbGl6ZXIoe1xuXHRcdFx0XHRvcGVuOiBmYWxzZSxcblx0XHRcdFx0Z3ppcFNpemU6IHRydWUsXG5cdFx0XHRcdGJyb3RsaVNpemU6IHRydWVcblx0XHRcdH0pXG5cdFx0XSxcblx0XHRiYXNlOiBcIi90dHQvXCIsXG5cdFx0c2VydmVyOiB7XG5cdFx0XHRwb3J0OiA5MDAwLFxuXHRcdFx0cHJveHksXG5cdFx0XHRobXI6IHtcblx0XHRcdFx0b3ZlcmxheTogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y3NzOiB7XG5cdFx0XHRwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG5cdFx0XHRcdHNjc3M6IHtcblx0XHRcdFx0XHRjaGFyc2V0OiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZXNvbHZlOiB7XG5cdFx0XHRhbGlhczoge1xuXHRcdFx0XHRcIi9AXCI6IHRvUGF0aChcIi4vc3JjXCIpLFxuXHRcdFx0XHRcIi8kXCI6IHRvUGF0aChcIi4vc3JjL21vZHVsZXNcIiksXG5cdFx0XHRcdFwiLyNcIjogdG9QYXRoKFwiLi9zcmMvcGx1Z2luc1wiKSxcblx0XHRcdFx0XCIvflwiOiB0b1BhdGgoXCIuL3BhY2thZ2VzXCIpXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRlc2J1aWxkOiB7XG5cdFx0XHQvLyBkcm9wOiBpc0RldiA/IFtdIDogW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdXG5cdFx0fSxcblxuXHRcdGJ1aWxkOiB7XG5cdFx0XHRtaW5pZnk6IFwiZXNidWlsZFwiLFxuXHRcdFx0Ly8gdGVyc2VyT3B0aW9uczoge1xuXHRcdFx0Ly8gXHRjb21wcmVzczoge1xuXHRcdFx0Ly8gXHRcdGRyb3BfY29uc29sZTogdHJ1ZSxcblx0XHRcdC8vIFx0XHRkcm9wX2RlYnVnZ2VyOiB0cnVlXG5cdFx0XHQvLyBcdH1cblx0XHRcdC8vIH0sXG5cdFx0XHRzb3VyY2VtYXA6IGlzRGV2LFxuXHRcdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0XHRvdXRwdXQ6IHtcblx0XHRcdFx0XHRjaHVua0ZpbGVOYW1lczogXCJzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qc1wiLFxuXHRcdFx0XHRcdGVudHJ5RmlsZU5hbWVzOiBcInN0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzXCIsXG5cdFx0XHRcdFx0YXNzZXRGaWxlTmFtZXM6IFwic3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIixcblx0XHRcdFx0XHRtYW51YWxDaHVua3MoaWQpIHtcblx0XHRcdFx0XHRcdGlmIChpZC5pbmNsdWRlcyhcIm5vZGVfbW9kdWxlc1wiKSkge1xuXHRcdFx0XHRcdFx0XHRpZiAoIVtcIkBjb29sLXZ1ZS9jcnVkXCJdLmZpbmQoKGUpID0+IGlkLmluY2x1ZGVzKGUpKSkge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChpZC5pbmNsdWRlcyhcInByZXR0aWVyXCIpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGlkXG5cdFx0XHRcdFx0XHRcdFx0XHQudG9TdHJpbmcoKVxuXHRcdFx0XHRcdFx0XHRcdFx0LnNwbGl0KFwibm9kZV9tb2R1bGVzL1wiKVsxXVxuXHRcdFx0XHRcdFx0XHRcdFx0LnJlcGxhY2UoXCIucG5wbS9cIiwgXCJcIilcblx0XHRcdFx0XHRcdFx0XHRcdC5zcGxpdChcIi9cIilbMF07XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIFwiY29tbVwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY29kaW5nXFxcXGNvb2xcXFxcYWRtaW5cXFxcZnJvbnQtbmV4dFxcXFxzcmNcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjb2RpbmdcXFxcY29vbFxcXFxhZG1pblxcXFxmcm9udC1uZXh0XFxcXHNyY1xcXFxjb25maWdcXFxccHJveHkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NvZGluZy9jb29sL2FkbWluL2Zyb250LW5leHQvc3JjL2NvbmZpZy9wcm94eS50c1wiO2V4cG9ydCBjb25zdCBwcm94eSA9IHtcblx0XCIvZGV2L1wiOiB7XG5cdFx0dGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6ODAwMVwiLFxuXHRcdGNoYW5nZU9yaWdpbjogdHJ1ZSxcblx0XHRyZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9kZXYvLCBcIlwiKVxuXHR9LFxuXG5cdFwiL3Byb2QvXCI6IHtcblx0XHR0YXJnZXQ6IFwiaHR0cHM6Ly9zaG93LmNvb2wtYWRtaW4uY29tXCIsXG5cdFx0Y2hhbmdlT3JpZ2luOiB0cnVlLFxuXHRcdHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZSgvXlxcL3Byb2QvLCBcIi9hcGlcIilcblx0fVxufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxlQUFlLFdBQVc7QUFFOVQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUVuQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLGtCQUFrQjs7O0FDTjhSLElBQU0sUUFBUTtBQUFBLEVBQ3RVLFNBQVM7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxJQUNkLFNBQVMsQ0FBQyxTQUFpQixLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsRUFDckQ7QUFBQSxFQUVBLFVBQVU7QUFBQSxJQUNULFFBQVE7QUFBQSxJQUNSLGNBQWM7QUFBQSxJQUNkLFNBQVMsQ0FBQyxTQUFpQixLQUFLLFFBQVEsV0FBVyxNQUFNO0FBQUEsRUFDMUQ7QUFDRDs7O0FESkEsU0FBUyxZQUFZO0FBUjJKLElBQU0sMkNBQTJDO0FBVWpPLFNBQVMsT0FBTyxLQUFhO0FBQzVCLFNBQU8sY0FBYyxJQUFJLElBQUksS0FBSyx3Q0FBZSxDQUFDO0FBQ25EO0FBR0EsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUE2QjtBQUNuRCxRQUFNLFFBQVEsU0FBUztBQUV2QixTQUFPO0FBQUEsSUFDTixTQUFTO0FBQUEsTUFDUixJQUFJO0FBQUEsTUFDSixZQUFZO0FBQUEsTUFDWixPQUFPO0FBQUE7QUFBQSxNQUVQLEtBQUs7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOO0FBQUEsTUFDRCxDQUFDO0FBQUEsTUFDRCxXQUFXO0FBQUEsUUFDVixNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixZQUFZO0FBQUEsTUFDYixDQUFDO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ047QUFBQSxNQUNBLEtBQUs7QUFBQSxRQUNKLFNBQVM7QUFBQSxNQUNWO0FBQUEsSUFDRDtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0oscUJBQXFCO0FBQUEsUUFDcEIsTUFBTTtBQUFBLFVBQ0wsU0FBUztBQUFBLFFBQ1Y7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ04sTUFBTSxPQUFPLE9BQU87QUFBQSxRQUNwQixNQUFNLE9BQU8sZUFBZTtBQUFBLFFBQzVCLE1BQU0sT0FBTyxlQUFlO0FBQUEsUUFDNUIsTUFBTSxPQUFPLFlBQVk7QUFBQSxNQUMxQjtBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQTtBQUFBLElBRVQ7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNOLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQU9SLFdBQVc7QUFBQSxNQUNYLGVBQWU7QUFBQSxRQUNkLFFBQVE7QUFBQSxVQUNQLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGFBQWEsSUFBSTtBQUNoQixnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQ2hDLGtCQUFJLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUc7QUFDcEQsb0JBQUksR0FBRyxTQUFTLFVBQVUsR0FBRztBQUM1QjtBQUFBLGdCQUNEO0FBRUEsdUJBQU8sR0FDTCxTQUFTLEVBQ1QsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUN4QixRQUFRLFVBQVUsRUFBRSxFQUNwQixNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQUEsY0FDZixPQUFPO0FBQ04sdUJBQU87QUFBQSxjQUNSO0FBQUEsWUFDRDtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0Q7IiwKICAibmFtZXMiOiBbXQp9Cg==
