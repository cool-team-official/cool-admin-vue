/// <reference types="../index" />
export declare function useRow({ Table, config, Sort }: {
    Table: Vue.Ref<any>;
    config: ClTable.Config;
    Sort: {
        defaultSort: {
            prop?: string;
            order?: string;
        };
        changeSort(prop: string, order: string): void;
    };
}): {
    onRowContextMenu: (row: obj, column: obj, event: PointerEvent) => void;
};
