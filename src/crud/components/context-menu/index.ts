import { h, render } from "vue";
import ContextMenuConstructor from "./context-menu";

class ContextMenu {
	ctx: any = null;

	open(event: any, options: any) {
		const vm: any = h(ContextMenuConstructor, {
			visible: true
		});

		// 渲染节点
		render(vm, document.createElement("div"));
		this.ctx = vm.component.ctx;

		return this.ctx.open(event, options);
	}

	close() {
		if (this.ctx) {
			this.ctx.close();
		}
	}
}

export default new ContextMenu();
