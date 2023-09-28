/// <reference types="../index" />
export declare function useData({ config, Table }: {
    config: ClTable.Config;
    Table: Vue.Ref<any>;
}): {
    data: import("vue").Ref<obj[]>;
    setData: (list: obj[]) => void;
};
