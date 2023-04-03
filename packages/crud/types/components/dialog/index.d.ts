declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: ObjectConstructor;
    customClass: StringConstructor;
    title: {
        type: StringConstructor;
        default: string;
    };
    height: {
        type: StringConstructor;
        default: null;
    };
    width: {
        type: StringConstructor;
        default: string;
    };
    keepAlive: BooleanConstructor;
    fullscreen: BooleanConstructor;
    controls: {
        type: ArrayConstructor;
        default: () => string[];
    };
    hideHeader: BooleanConstructor;
    beforeClose: FunctionConstructor;
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "fullscreen-change")[], "update:modelValue" | "fullscreen-change", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: ObjectConstructor;
    customClass: StringConstructor;
    title: {
        type: StringConstructor;
        default: string;
    };
    height: {
        type: StringConstructor;
        default: null;
    };
    width: {
        type: StringConstructor;
        default: string;
    };
    keepAlive: BooleanConstructor;
    fullscreen: BooleanConstructor;
    controls: {
        type: ArrayConstructor;
        default: () => string[];
    };
    hideHeader: BooleanConstructor;
    beforeClose: FunctionConstructor;
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onFullscreen-change"?: ((...args: any[]) => any) | undefined;
}, {
    height: string;
    title: string;
    width: string;
    keepAlive: boolean;
    hideHeader: boolean;
    controls: unknown[];
    fullscreen: boolean;
    modelValue: boolean;
}>;
export default _default;
