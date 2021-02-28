const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

function resolve(dir) {
	return path.join(__dirname, dir);
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
		proxy: {
			"/dev": {
				target: "http://127.0.0.1:8001",
				changeOrigin: true,
				pathRewrite: {
					"^/dev": ""
				}
			},

			"/test": {
				target: "https://admin.cn.utools.club",
				changeOrigin: true,
				pathRewrite: {
					"^/dev": ""
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
	},

	chainWebpack: (config) => {
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
			.tap((options) => {
				options.compilerOptions.preserveWhitespace = true;
				return options;
			})
			.end();

		// 移除 prefetch 插件
		config.plugins.delete("prefetch-index");

		// 移除 preload 插件，避免加载多余的资源
		config.plugins.delete("preload-index");

		// 设置别名
		config.resolve.alias.set("cool", resolve("cool"));

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
	}
};
