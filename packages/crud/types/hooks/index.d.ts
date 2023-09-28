/// <reference types="../index" />
import { Mitt } from "../utils/mitt";
export declare function useCore(): {
    crud: ClCrud.Ref;
    mitt: Mitt;
};
export declare function useConfig(): Config;
export declare function useBrowser(): Browser;
export declare function useRefs(): {
    refs: {
        [key: string]: obj;
    };
    setRefs: (name: string) => (el: any) => void;
};
export declare function useProxy(ctx: any): any;
export declare function useElApi(keys: string[], el: any): obj;
export declare function useEventListener(name: string, cb: () => any): void;
export * from "./crud";
