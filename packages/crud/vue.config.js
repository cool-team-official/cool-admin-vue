const { defineConfig } = require("@vue/cli-service");

const isProduction = process.env.NODE_ENV === "production";

module.exports = defineConfig({
	configureWebpack() {
		return {
			externals: isProduction ? ["element-plus"] : []
		};
	}
});
