import { languages } from "monaco-editor";
import { keys } from "lodash-es";

export function addDeclare({ path, content }: { path: string; content: string }) {
	const defaults = languages.typescript.typescriptDefaults;

	const filePath = `file:///node_modules/${path}`;
	const loaded = defaults.getExtraLibs();
	const libs = keys(loaded).map((e) => {
		return {
			filePath: e,
			content: loaded[e].content
		};
	});

	const item = libs.find((e) => e.filePath.includes(path));
	try {
		if (item) {
			item.content = content;
			defaults.setExtraLibs(libs);
		} else {
			defaults.addExtraLib(content, filePath);
		}
	} catch (err) {
		console.error(err);
	}
}

export function clearDeclare() {
	const defaults = languages.typescript.typescriptDefaults;
	defaults.setExtraLibs([]);
}
