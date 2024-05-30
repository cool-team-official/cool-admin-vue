/// <reference types="../index" />
import { type PropType } from "vue";
declare const ClContextMenu: import("vue").DefineComponent<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: ObjectConstructor;
        default: () => {};
    };
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    options: ClContextMenu.Options;
    show: boolean;
    event: Record<string, any>;
}, {}>;
export declare const ContextMenu: {
    open(event: any, options: ClContextMenu.Options): ClContextMenu.Exposed;
};
export default ClContextMenu;
