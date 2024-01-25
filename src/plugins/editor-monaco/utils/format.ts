import { languages } from "monaco-editor";
import prettier from "prettier/standalone";
import pluginHtml from "prettier/plugins/html";
import pluginTypescript from "prettier/plugins/typescript";
import pluginPostcss from "prettier/plugins/postcss";
import pluginEstree from "prettier/plugins/estree";

const options: { [key: string]: { parser: string; plugins: any[] } } = {
	html: {
		parser: "html",
		plugins: [pluginHtml, pluginTypescript, pluginPostcss, pluginEstree]
	},
	typescript: {
		parser: "typescript",
		plugins: [pluginTypescript, pluginEstree]
	},
	css: {
		parser: "css",
		plugins: [pluginPostcss]
	},
	scss: {
		parser: "scss",
		plugins: [pluginPostcss]
	}
};

export function useFormat() {
	function register() {
		for (const i in options) {
			languages.registerDocumentFormattingEditProvider(i, {
				async provideDocumentFormattingEdits(model) {
					let text = model.getValue();

					try {
						text = await prettier.format(text, {
							parser: options[i].parser,
							plugins: options[i].plugins,
							semi: true,
							printWidth: 100,
							tabWidth: 4,
							useTabs: true,
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
