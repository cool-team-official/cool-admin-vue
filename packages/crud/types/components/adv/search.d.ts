/// <reference types="../index" />
import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    items: {
        type: PropType<ClForm.Item<any>[]>;
        default: () => never[];
    };
    title: StringConstructor;
    size: {
        type: (NumberConstructor | StringConstructor)[];
        default: string;
    };
    op: {
        type: ArrayConstructor;
        default: () => string[];
    };
    onSearch: FunctionConstructor;
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("clear" | "reset")[], "clear" | "reset", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    items: {
        type: PropType<ClForm.Item<any>[]>;
        default: () => never[];
    };
    title: StringConstructor;
    size: {
        type: (NumberConstructor | StringConstructor)[];
        default: string;
    };
    op: {
        type: ArrayConstructor;
        default: () => string[];
    };
    onSearch: FunctionConstructor;
}>> & {
    onReset?: ((...args: any[]) => any) | undefined;
    onClear?: ((...args: any[]) => any) | undefined;
}, {
    size: string | number;
    items: ClForm.Item<any>[];
    op: unknown[];
}, {}>;
export default _default;
