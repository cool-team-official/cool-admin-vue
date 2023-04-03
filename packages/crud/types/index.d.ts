/// <reference types="../index" />
import { App } from "vue";
import "./static/index.scss";
declare const Crud: {
    install(app: App, options?: Options): {
        name: string;
    };
};
export default Crud;
export * from "./emitter";
export * from "./hooks/crud";
export * from "./hooks/plugins";
export * from "./locale";
export { registerFormHook } from "./utils/form-hook";
export { ContextMenu } from "./components/context-menu";
