/// <reference types="@cool-vue/crud/index.d.ts" />
/// <reference types="./build/cool/eps.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_NAME: string;
	readonly VITE_TIMEOUT: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
