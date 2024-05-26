/// <reference types="../index" />
import { type PropType } from "vue";
declare const ClContextMenu: import("vue").DefineComponent<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: PropType<ClContextMenu.Event>;
        default: () => {};
    };
}, () => any, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    show: BooleanConstructor;
    options: {
        type: PropType<ClContextMenu.Options>;
        default: () => {};
    };
    event: {
        type: PropType<ClContextMenu.Event>;
        default: () => {};
    };
}>>, {
    options: ClContextMenu.Options;
    show: boolean;
    event: ClContextMenu.Event;
}, {}>;
export declare const ContextMenu: {
    open(event: ClContextMenu.Event, options: ClContextMenu.Options): ClContextMenu.Exposed;
};
export default ClContextMenu;
