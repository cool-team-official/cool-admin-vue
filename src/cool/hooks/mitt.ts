import Mitt, { Emitter } from "mitt";
import { hmr } from "./hmr";

const mitt: Emitter<any> = hmr.getData("mitt", Mitt());

export function useMitt() {
	return mitt;
}
