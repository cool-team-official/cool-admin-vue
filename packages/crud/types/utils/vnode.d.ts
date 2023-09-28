import { VNode } from "vue";
interface Options {
    prop?: string;
    scope?: any;
    item?: any;
    slots?: any;
    children?: any[] & any;
    custom?: (vnode: any) => any;
    render?: "slot" | null;
    [key: string]: any;
}
export declare function parseNode(vnode: any, options: Options): VNode;
export declare function renderNode(vnode: any, options: Options): any;
export {};
