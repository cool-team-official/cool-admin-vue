/// <reference types="../index" />
export declare const format: {
    [key: string]: Hook.fn;
};
declare const formHook: {
    bind(data: any): void;
    submit(data: any): void;
};
export declare function registerFormHook(name: string, fn: Hook.fn): void;
export default formHook;
