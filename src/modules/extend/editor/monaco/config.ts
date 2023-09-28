import { languages } from "monaco-editor";

languages.typescript.typescriptDefaults.setEagerModelSync(true);

languages.typescript.typescriptDefaults.setCompilerOptions({
	target: languages.typescript.ScriptTarget.ES2016,
	allowNonTsExtensions: true,
	moduleResolution: languages.typescript.ModuleResolutionKind.NodeJs,
	module: languages.typescript.ModuleKind.CommonJS,
	experimentalDecorators: true,
	noEmit: true,
	allowJs: false,
	typeRoots: ["node_modules/@types"]
});

languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: true
});
