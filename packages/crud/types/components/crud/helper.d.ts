/// <reference types="../index" />
import Mitt from "../../utils/mitt";
interface Options {
    mitt: Mitt;
    config: ClCrud.Config;
    crud: ClCrud.Ref;
}
export declare function useHelper({ mitt, config, crud }: Options): {
    proxy: (name: string, data?: any[]) => void;
    set: (key: string, value: any) => void;
    on: (name: string, callback: fn) => void;
    rowInfo: (data: any) => void;
    rowAdd: () => void;
    rowEdit: (data: any) => void;
    rowAppend: (data: any) => void;
    rowDelete: (...selection: any[]) => void;
    rowClose: () => void;
    refresh: (params?: obj) => Promise<unknown>;
    getPermission: (key: "page" | "list" | "info" | "update" | "add" | "delete") => boolean;
    paramsReplace: (params: obj) => any;
    getParams: () => obj;
};
export {};
