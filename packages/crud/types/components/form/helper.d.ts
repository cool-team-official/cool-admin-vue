/// <reference types="../index" />
import { Ref } from "vue";
declare type Config = ClForm.Config;
declare type Form = Vue.Ref<any>;
export declare function useAction({ config, form, Form }: {
    config: Config;
    form: obj;
    Form: Form;
}): {
    getForm: (prop: string) => any;
    setForm: (prop: string, value: any) => void;
    setData: (prop: string, value: any) => void;
    setConfig: (path: string, value: any) => void;
    setOptions: (prop: string, value: any[]) => void;
    setProps: (prop: string, value: any) => void;
    toggleItem: (prop: string, value?: boolean) => void;
    hideItem: (...props: string[]) => void;
    showItem: (...props: string[]) => void;
    setTitle: (value: string) => void;
    collapseItem: (e: any) => void;
};
export declare function useTabs({ config, Form }: {
    config: Config;
    Form: Form;
}): {
    active: Ref<any>;
    get: () => ClForm.Item | undefined;
    set: (data: any) => void;
    change: (value: any, isValid?: boolean) => Promise<unknown>;
    clear: () => void;
    mergeProp: (item: ClForm.Item) => void;
};
export declare function useApi({ Form }: {
    Form: Form;
}): {
    [key: string]: any;
};
export declare function usePlugins({ visible }: {
    visible: Ref<boolean>;
}): {
    create: (plugins?: ClForm.Plugin[]) => void;
    submit: (data: any) => Promise<any>;
};
export {};
