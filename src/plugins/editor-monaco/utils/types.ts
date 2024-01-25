import { languages } from "monaco-editor";
import { Declares } from "./declare";

export function addExtraLib({ path, content }: { path: string; content: string }) {
	const fullpath = `file:///node_modules/${path}`;
	const defaults = languages.typescript.typescriptDefaults;

	const loaded = defaults.getExtraLibs();
	const keys = Object.keys(loaded);

	if (!keys.includes(fullpath)) {
		try {
			defaults.addExtraLib(content, fullpath);
		} catch (error) {
			console.log(error, fullpath, keys);
			throw error;
		}
	}
}

export function useTypes() {
	function loadDeclares() {
		addExtraLib({ path: "globals.d.ts", content: Declares });
	}

	return {
		loadDeclares
	};
}
