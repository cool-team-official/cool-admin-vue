import { inject } from "vue";
import { Dp } from "../types";

export function useDp() {
	const dp = inject("dp") as Dp.Provide;

	return { dp };
}
