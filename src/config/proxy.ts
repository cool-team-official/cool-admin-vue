export const proxy = {
	"/dev/": {
		// target: "http://127.0.0.1:8001",
		target: "http://192.168.0.119:8001",
		// target: "https://dev-admin.cool-js.cloud",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, "")
	},

	"/prod/": {
		target: "https://show.cool-admin.com",
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, "/api")
	}
};
