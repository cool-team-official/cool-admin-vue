/// <reference types="../index" />
export declare function useAction({ config, form, Form }: {
    config: ClForm.Config;
    form: obj;
    Form: Vue.Ref<any>;
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
