/// <reference types="../index" />
import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    data: {
        type: ObjectConstructor;
        default: () => {};
    };
    items: {
        type: PropType<ClForm.Item<any>[]>;
        default: () => never[];
    };
    resetBtn: {
        type: BooleanConstructor;
        default: boolean;
    };
    onLoad: FunctionConstructor;
    onSearch: FunctionConstructor;
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "reset"[], "reset", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: ObjectConstructor;
        default: () => {};
    };
    items: {
        type: PropType<ClForm.Item<any>[]>;
        default: () => never[];
    };
    resetBtn: {
        type: BooleanConstructor;
        default: boolean;
    };
    onLoad: FunctionConstructor;
    onSearch: FunctionConstructor;
}>> & {
    onReset?: ((...args: any[]) => any) | undefined;
}, {
    items: ClForm.Item<any>[];
    data: Record<string, any>;
    resetBtn: boolean;
}, {}>;
export default _default;
