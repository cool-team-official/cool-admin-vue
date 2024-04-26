export declare function rootDir(path: string): string;
export declare function firstUpperCase(value: string): string;
export declare function toCamel(str: string): string;
export declare function createDir(path: string, recursive?: boolean): void;
export declare function readFile(path: string, json?: boolean): any;
export declare function writeFile(path: string, data: any): void | "";
export declare function parseJson(req: any): Promise<any>;
export declare function error(message: string): void;
export declare function success(message: string): void;
