/// <reference types="../index" />
declare type Emit = (name: "selection-change" | "sort-change", ...args: any[]) => void;
declare type Table = Vue.Ref<any>;
declare type Config = ClTable.Config;
declare interface Sort {
    defaultSort: {
        prop?: string;
        order?: string;
    };
    changeSort(prop: string, order: string): void;
}
export declare function useSort({ config, emit, Table }: {
    config: Config;
    emit: Emit;
    Table: Table;
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
export declare function useRow({ Table, config, Sort }: {
    Table: Table;
    config: Config;
    Sort: Sort;
}): {
    onRowContextMenu: (row: any, column: any, event: any) => void;
};
export declare function useHeight({ config, Table }: {
    Table: Table;
    config: Config;
}): {
    isAuto: import("vue").ComputedRef<boolean>;
    maxHeight: import("vue").Ref<number>;
    calcMaxHeight: (this: any, ...args: any[]) => any;
};
export declare function useSelection({ emit }: {
    emit: Emit;
}): {
    selection: obj[];
    onSelectionChange: (selection: any[]) => void;
};
export declare function useData({ config, Table }: {
    config: Config;
    Table: Table;
}): {
    data: import("vue").Ref<any[]>;
    setData: (list: any[]) => void;
};
export declare function useOp({ config }: {
    config: Config;
}): {
    visible: import("vue").Ref<boolean>;
    reBuild: (cb?: fn) => Promise<void>;
    showColumn: (prop: string | string[], status?: boolean) => void;
    hideColumn: (prop: string | string[]) => void;
    setColumns: (list: ClTable.Column[]) => void;
};
export declare function useRender(): {
    renderColumn: (columns: ClTable.Column[]) => (import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null)[];
    renderEmpty: (emptyText: String) => JSX.Element;
    renderAppend: () => JSX.Element;
};
export {};
