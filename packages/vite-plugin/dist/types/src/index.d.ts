import type { Type } from "./types";
export declare function cool(options: {
    type: Type;
    proxy: any;
    demo?: boolean;
}): (import("vite").Plugin<any> | Promise<import("vite").Plugin<any>>)[];
