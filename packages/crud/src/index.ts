import { App } from "vue";
import { useComponent } from "./components";
import { useProvide } from "./provide";
import temp from "./utils/temp";
import "./static/index.scss";

const Crud = {
	install(app: App, options?: Options) {
		// 临时
		temp.set("__CrudApp__", app);

		// 穿透值
		useProvide(app, options);

		// 设置组件
		useComponent(app);

		return {
			name: "cl-crud"
		};
	}
};

export default Crud;

export * from "./emitter";
export * from "./hooks";
export * from "./plugins";
export * from "./locale";
export { registerFormHook } from "./utils/form-hook";
export { ContextMenu } from "./components/context-menu";
