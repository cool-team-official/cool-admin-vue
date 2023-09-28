/// <reference types="../index" />
export declare function useTabs({ config, Form }: {
    config: ClForm.Config;
    Form: Vue.Ref<any>;
}): {
    active: import("vue").Ref<any>;
    get: () => ClForm.Item | undefined;
    set: (data: any) => void;
    change: (value: any, isValid?: boolean) => Promise<unknown>;
    clear: () => void;
    mergeProp: (item: ClForm.Item) => void;
};
