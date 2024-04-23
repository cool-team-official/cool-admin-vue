export default {
	parser: "@typescript-eslint/parser",
	extends: ["plugin:@typescript-eslint/recommended"],
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
		ecmaVersion: 2020,
		sourceType: "module",
		createDefaultProgram: true,
	},
	rules: {},
};
