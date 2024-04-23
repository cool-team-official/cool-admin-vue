/// <reference types="@cool-vue/crud/index.d.ts" />
/// <reference types="@cool-vue/vite-plugin/eps.d.ts" />

interface ImportMetaEnv {
	readonly VITE_NAME: string;
	readonly VITE_TIMEOUT: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
