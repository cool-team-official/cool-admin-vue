/// <reference types="../index" />
export declare function useTable(props: any): {
    Table: import("vue").Ref<any>;
    config: {
        columns: {
            [x: string]: any;
            type: "op" | "expand" | "selection" | "index";
            hidden: boolean | {
                value: boolean;
            };
            component: {
                [x: string]: any;
                name?: string | undefined;
                options?: {
                    [x: string]: any;
                    label: string;
                    value: any;
                    color?: string | undefined;
                    type?: string | undefined;
                }[] | {
                    value: {
                        [x: string]: any;
                        label: string;
                        value: any;
                        color?: string | undefined;
                        type?: string | undefined;
                    }[];
                } | undefined;
                props?: {
                    [x: string]: any;
                    onChange?: ((value: any) => void) | undefined;
                } | {
                    value: {
                        [x: string]: any;
                        onChange?: ((value: any) => void) | undefined;
                    };
                } | undefined;
                style?: obj | undefined;
                functionSlot?: boolean | undefined;
                vm?: any;
            };
            dict: {
                [x: string]: any;
                label: string;
                value: any;
                color?: string | undefined;
                type?: string | undefined;
            }[] | {
                value: {
                    [x: string]: any;
                    label: string;
                    value: any;
                    color?: string | undefined;
                    type?: string | undefined;
                }[];
            };
            dictFormatter: (values: DictOptions) => string;
            dictColor: boolean;
            buttons: ((options: {
                scope: obj;
            }) => ClTable.OpButton) | ("info" | "delete" | "edit" | `slot-${string}` | {
                [x: string]: any;
                label: string;
                type?: string | undefined;
                hidden?: boolean | undefined;
                onClick: (options: {
                    scope: obj;
                }) => void;
            })[];
            align: "center" | "left" | "right";
            label: string | {
                value: string;
            };
            className: string;
            prop: string;
            orderNum: number;
            width: number;
            minWidth: string | number;
            renderHeader: (options: {
                column: any;
                $index: number;
            }) => any;
            sortable: boolean | "asc" | "desc" | "custom" | "descending" | "ascending";
            sortMethod: fn;
            sortBy: string | any[] | ((row: any, index: number) => any);
            resizable: boolean;
            columnKey: string;
            headerAlign: string;
            showOverflowTooltip: boolean;
            fixed: string | boolean;
            formatter: (row: any, column: any, value: any, index: number) => any;
            selectable: (row: any, index: number) => boolean;
            reserveSelection: boolean;
            filterMethod: fn;
            filteredValue: unknown[];
            filters: unknown[];
            filterPlacement: string;
            filterMultiple: boolean;
            index: number | ((index: number) => number);
            sortOrders: unknown[];
            children: any[];
        }[];
        autoHeight: boolean;
        height: string | number;
        contextMenu: ("info" | "update" | "delete" | "edit" | "refresh" | {
            [x: string]: any;
            label: string;
            icon?: string | undefined;
            prefixIcon?: string | undefined;
            suffixIcon?: string | undefined;
            ellipsis?: boolean | undefined;
            disabled?: boolean | undefined;
            hidden?: boolean | undefined;
            children?: any[] | undefined;
            showChildren?: boolean | undefined;
            callback?: ((done: fn) => void) | undefined;
        } | ((row: obj, column: obj, event: PointerEvent) => ClContextMenu.Item) | "check" | "order-desc" | "order-asc")[];
        defaultSort: {
            prop: string;
            order: "descending" | "ascending";
        };
        sortRefresh: boolean;
        emptyText: string;
        rowKey: string;
        onRowContextmenu?: ((row: any, column: any, event: any) => void) | undefined;
    };
};
export * from "./data";
export * from "./height";
export * from "./op";
export * from "./render";
export * from "./row";
export * from "./selection";
export * from "./sort";
