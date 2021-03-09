import { Message } from "element-ui";
import Clipboard from "clipboard";

function copyboard() {
	const clipboard = new Clipboard("._copy-btn");

	clipboard.on("success", e => {
		Message.success("复制成功");
		e.clearSelection();
	});

	clipboard.on("error", err => {
		console.error(err);
		Message.success("复制失败");
	});
}

copyboard();

export default {
	inserted: (el, binding) => {
		el.className = el.className + " _copy-btn";
		el.setAttribute("data-clipboard-text", binding.value);
	},
	update: (el, binding) => {
		el.setAttribute("data-clipboard-text", binding.value);
	}
};
