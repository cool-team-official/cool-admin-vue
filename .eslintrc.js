module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "@vue/prettier"],
	rules: {
		"no-console": "off",
		"comma-dangle": [2, "never"]
	},
	parserOptions: {
		parser: "@typescript-eslint/parser"
	}
};
