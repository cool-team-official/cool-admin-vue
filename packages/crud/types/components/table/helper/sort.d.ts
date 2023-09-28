/// <reference types="../index" />
export declare function useSort({ config, Table, emit }: {
    config: ClTable.Config;
    Table: Vue.Ref<any>;
    emit: Vue.Emit;
}): {
    defaultSort: {
        prop: string;
        order: "descending" | "ascending";
    } | {
        prop?: undefined;
        order?: undefined;
    };
    onSortChange: ({ prop, order }: {
        prop: string | undefined;
        order: string;
    }) => void;
    changeSort: (prop: string, order: string) => void;
};
