import { h, render } from "vue";
import ContextMenuConstructor from "./context-menu";

class ContextMenu {
	open(event: any, options: any) {
		const vm: any = h(ContextMenuConstructor, {
			visible: true,
			event,
			options
		});

		render(vm, document.createElement("div"));
	}
}

export default new ContextMenu();
