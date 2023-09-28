/// <reference types="../index" />
import { PropType } from "vue";
declare const _default: import("vue").DefineComponent<{
    data: {
        type: ObjectConstructor;
        default: () => {};
    };
    items: {
        type: PropType<ClForm.Item[]>;
        default: () => never[];
    };
    resetBtn: {
        type: BooleanConstructor;
        default: boolean;
    };
    onLoad: FunctionConstructor;
    onSearch: FunctionConstructor;
}, () => true | JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: ObjectConstructor;
        default: () => {};
    };
    items: {
        type: PropType<ClForm.Item[]>;
        default: () => never[];
    };
    resetBtn: {
        type: BooleanConstructor;
        default: boolean;
    };
    onLoad: FunctionConstructor;
    onSearch: FunctionConstructor;
}>>, {
    items: ClForm.Item[];
    data: Record<string, any>;
    resetBtn: boolean;
}, {}>;
export default _default;
