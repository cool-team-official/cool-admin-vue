import { useDictStore } from "./dict";

export function useStore() {
	const dict = useDictStore();

	return {
		dict
	};
}
