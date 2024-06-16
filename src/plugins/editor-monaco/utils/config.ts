import { languages } from "monaco-editor";

languages.typescript.typescriptDefaults.setEagerModelSync(true);

languages.typescript.typescriptDefaults.setCompilerOptions({
	target: languages.typescript.ScriptTarget.ES2018,
	allowNonTsExtensions: true,
	experimentalDecorators: true,
	jsx: languages.typescript.JsxEmit.Preserve,
	esModuleInterop: true,
	noEmit: true,
	allowSyntheticDefaultImports: true,
	noImplicitAny: false,
	emitDecoratorMetadata: true,
	inlineSourceMap: true,
	noImplicitThis: true,
	noUnusedLocals: false,
	stripInternal: true,
	skipLibCheck: true,
	resolveJsonModule: true,
	pretty: true,
	declaration: true
});

languages.typescript.typescriptDefaults.setDiagnosticsOptions({
	noSemanticValidation: true,
	noSyntaxValidation: true
});
