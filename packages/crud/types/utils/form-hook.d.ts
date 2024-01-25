/// <reference types="../index" />
export declare const format: {
    [key: string]: ClForm.HookFn;
};
declare const formHook: {
    bind(data: any): void;
    submit(data: any): void;
};
export declare function registerFormHook(name: string, fn: ClForm.HookFn): void;
export default formHook;
