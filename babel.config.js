module.exports = {
	presets: ["@vue/app"],
	plugins: [
		["jsx-v-model"],
		[
			"component",
			{
				libraryName: "element-ui",
				styleLibraryName: "theme-chalk"
			}
		]
	]
};
