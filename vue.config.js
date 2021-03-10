const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

// 代理列表
const PROXY_LIST = {
	"/dev": {
		target: "http://127.0.0.1:8001",
		changeOrigin: true,
		pathRewrite: {
			"^/dev": ""
		}
	},

	"/ap": {
		target: "https://admin.cool-js.cool",
		changeOrigin: true,
		pathRewrite: {
			"^/ap": ""
		}
	},

	"/fz": {
		target: "http://xfz520231.utools.club",
		changeOrigin: true,
		pathRewrite: {
			"^/fz": ""
		}
	},

	"/oss-upload": {
		target: "https://cool-admin-pro.oss-cn-shanghai.aliyuncs.com",
		changeOrigin: true,
		pathRewrite: {
			"^/oss-upload": ""
		}
	},

	"/pro": {
		target: "https://show.cool-admin.com",
		changeOrigin: true,
		pathRewrite: {
			"^/pro": "/api"
		}
	}
}

module.exports = {
	publicPath: "/",
	lintOnSave: true,
	productionSourceMap: false,
	parallel: require("os").cpus().length > 1,

	css: {
		extract: isProduction,
		sourceMap: false,
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/css/common.scss";`
			}
		}
	},

	devServer: {
		port: 9000,
		open: false,
		compress: false,
		overlay: {
			warnings: false,
			errors: true
		},
		disableHostCheck: true,
		proxy: PROXY_LIST
	},

	chainWebpack: config => {
		// svg
		config.module.rule("svg").uses.clear();

		config.module
			.rule("svg-sprite-loader")
			.test(/.svg$/)
			.exclude.add(/node_modules/)
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "[name]"
			});

		// 去掉元素之间空格
		config.module
			.rule("vue")
			.use("vue-loader")
			.loader("vue-loader")
			.tap(options => {
				options.compilerOptions.preserveWhitespace = true;
				return options;
			})
			.end();

		// 移除 prefetch 插件
		config.plugins.delete("prefetch-index");

		// 移除 preload 插件，避免加载多余的资源
		config.plugins.delete("preload-index");

		// 设置环境变量
		config.plugin('define').tap(args => {
			args[0]['process.env'].PROXY_LIST = JSON.stringify(PROXY_LIST)
			return args
		})

		// 生产模式下
		if (isProduction) {
			config.performance.set("hints", false);

			config.optimization.splitChunks({
				chunks: "all",
				cacheGroups: {
					// 公用模块抽离
					common: {
						chunks: "initial",
						minSize: 0,
						minChunks: 2
					},
					// 第三方库抽离
					vendor: {
						priority: 1,
						test: /node_modules/,
						chunks: "initial",
						minSize: 0,
						minChunks: 2
					}
				}
			});
		}
	},

	configureWebpack: config => {
		// config.plugins.push(new HardSourceWebpackPlugin());
	}
};
