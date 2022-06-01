import { useStore } from "./store";
import "./static/css/index.scss";

export function useBase() {
	return {
		...useStore()
	};
}

export * from "./common";
