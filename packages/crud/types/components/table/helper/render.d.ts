/// <reference types="../index" />
export declare function useRender(): {
    renderColumn: (columns: ClTable.Column[]) => (import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null)[];
    renderEmpty: (emptyText: String) => any;
    renderAppend: () => any;
};
