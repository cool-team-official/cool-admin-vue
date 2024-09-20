declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    columns: {
        type: ArrayConstructor;
        default: () => never[];
    };
    autoHeight: {
        type: BooleanConstructor;
        default: null;
    };
    height: null;
    contextMenu: {
        type: (BooleanConstructor | ArrayConstructor)[];
        default: null;
    };
    defaultSort: ObjectConstructor;
    sortRefresh: {
        type: BooleanConstructor;
        default: boolean;
    };
    emptyText: StringConstructor;
    rowKey: {
        type: StringConstructor;
        default: string;
    };
}>, () => false | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("selection-change" | "sort-change")[], "selection-change" | "sort-change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    columns: {
        type: ArrayConstructor;
        default: () => never[];
    };
    autoHeight: {
        type: BooleanConstructor;
        default: null;
    };
    height: null;
    contextMenu: {
        type: (BooleanConstructor | ArrayConstructor)[];
        default: null;
    };
    defaultSort: ObjectConstructor;
    sortRefresh: {
        type: BooleanConstructor;
        default: boolean;
    };
    emptyText: StringConstructor;
    rowKey: {
        type: StringConstructor;
        default: string;
    };
}>> & Readonly<{
    "onSelection-change"?: ((...args: any[]) => any) | undefined;
    "onSort-change"?: ((...args: any[]) => any) | undefined;
}>, {
    columns: unknown[];
    autoHeight: boolean;
    contextMenu: boolean | unknown[];
    sortRefresh: boolean;
    rowKey: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
