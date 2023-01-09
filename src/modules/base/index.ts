import { useStore } from "./store";

export function useBase() {
	return {
		...useStore()
	};
}

export * from "./common";
export * from "./hooks";
export * from "./types/index.d";
