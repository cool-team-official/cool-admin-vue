declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: ObjectConstructor;
    title: {
        type: StringConstructor;
        default: string;
    };
    height: StringConstructor;
    width: {
        type: StringConstructor;
        default: string;
    };
    padding: {
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
    scrollbar: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "fullscreen-change")[], "update:modelValue" | "fullscreen-change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    props: ObjectConstructor;
    title: {
        type: StringConstructor;
        default: string;
    };
    height: StringConstructor;
    width: {
        type: StringConstructor;
        default: string;
    };
    padding: {
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
    scrollbar: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    "onFullscreen-change"?: ((...args: any[]) => any) | undefined;
}>, {
    title: string;
    padding: string;
    width: string;
    keepAlive: boolean;
    hideHeader: boolean;
    controls: unknown[];
    fullscreen: boolean;
    modelValue: boolean;
    scrollbar: boolean;
}, {}, {
    Close: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    FullScreen: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Minus: import("vue").DefineComponent<{}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
