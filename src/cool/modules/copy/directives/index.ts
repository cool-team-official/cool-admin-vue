import { ElMessage } from "element-plus";
import Clipboard from "clipboard";

function copyboard() {
	const clipboard = new Clipboard("._copy-btn");

	clipboard.on("success", e => {
		ElMessage.success("复制成功");
		e.clearSelection();
	});

	clipboard.on("error", err => {
		console.error(err);
		ElMessage.success("复制失败");
	});
}

copyboard();

export default {
	mounted: (el: HTMLElement, binding: any) => {
		el.className = el.className + " _copy-btn";
		el.setAttribute("data-clipboard-text", binding.value);
	},
	beforeUpdate: (el: HTMLElement, binding: any) => {
		console.log(el);
		el.setAttribute("data-clipboard-text", binding.value);
	}
};
