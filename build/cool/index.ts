import { base } from "./base";
import { virtual } from "./virtual";

export function cool() {
	return [base(), virtual()];
}
