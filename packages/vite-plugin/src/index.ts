import { base } from "./base";
import { config } from "./config";
import { demo } from "./demo";
import type { Type } from "./types";
import { virtual } from "./virtual";

export function cool(options: { type: Type; proxy: any; demo?: boolean }) {
	config.type = options.type;
	config.reqUrl = options.proxy["/dev/"].target;

	return [base(), virtual(), demo(options.demo)];
}
