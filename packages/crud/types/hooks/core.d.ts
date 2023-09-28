/// <reference types="../index" />
import { Browser } from "./browser";
export declare function useRefs(): {
    refs: {
        [key: string]: obj;
    };
    setRefs: (name: string) => (el: any) => void;
};
export declare function useGlobal(): GlobalOptions;
export declare function useTools(): {
    slots: Readonly<{
        [name: string]: import("vue").Slot | undefined;
    }>;
    getValue: (data: any, params?: any) => any;
    dict: ClCrud.Dict;
    permission: ClCrud.Permission;
    style: {
        size: ElementPlus.Size;
    };
    events: {
        [key: string]: (...args: any[]) => any;
    };
    render: {
        autoHeight: boolean;
        functionSlots: {
            exclude: string[];
        };
    };
    crud: any;
    browser: Browser;
};
export declare function useCore(): {
    crud: ClCrud.Provide;
    mitt: Emitter;
};
export declare function useElApi(keys: string[], el: any): {
    [key: string]: any;
};
export declare function useConfig({ props }: any): any;
export declare function useEventListener(name: string, cb: () => any): void;
