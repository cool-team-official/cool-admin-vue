import { languages } from "monaco-editor";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import parserTypescript from "prettier/parser-typescript";
import parserPostcss from "prettier/parser-postcss";

const options: { [key: string]: { parser: string; plugins: any[] } } = {
	html: {
		parser: "html",
		plugins: [parserHtml, parserTypescript, parserPostcss]
	},
	typescript: {
		parser: "typescript",
		plugins: [parserTypescript]
	},
	css: {
		parser: "css",
		plugins: [parserPostcss]
	},
	scss: {
		parser: "scss",
		plugins: [parserPostcss]
	}
};

export function useFormat() {
	function register() {
		for (const i in options) {
			languages.registerDocumentFormattingEditProvider(i, {
				provideDocumentFormattingEdits(model) {
					let text = model.getValue();

					try {
						text = prettier.format(text, {
							parser: options[i].parser,
							plugins: options[i].plugins,
							semi: true,
							printWidth: 100,
							tabWidth: 2,
							useTabs: false,
							singleQuote: true,
							trailingComma: "none"
						});
					} catch (e) {
						console.error("代码格式化失败", e);
					}

					return [
						{
							range: model.getFullModelRange(),
							text
						}
					];
				}
			});
		}
	}

	return {
		register
	};
}
