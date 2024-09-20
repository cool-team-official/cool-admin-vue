/// <reference types="../index" />
import { type PropType } from "vue";
declare const ClContextMenu: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: ObjectConstructor;
        default: () => {};
    };
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: ObjectConstructor;
        default: () => {};
    };
}>> & Readonly<{}>, {
    options: ClContextMenu.Options;
    show: boolean;
    event: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const ContextMenu: {
    open(event: any, options: ClContextMenu.Options): ClContextMenu.Exposed;
};
export default ClContextMenu;
