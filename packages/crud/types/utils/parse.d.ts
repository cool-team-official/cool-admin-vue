/// <reference types="../index" />
/**
 * 解析 form.hidden
 */
export declare function parseFormHidden(value: any, { scope }: any): any;
/**
 * 解析 table.dict
 */
export declare function parseTableDict(value: any, item: ClTable.Column): string | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[];
/**
 * 解析 table.op.buttons
 */
export declare function parseTableOpButtons(buttons: any[], { scope }: any): any[];
/**
 * 解析扩展组件
 */
export declare function parseExtensionComponent(vnode: any): {
    children: any;
} | {
    children?: undefined;
};
