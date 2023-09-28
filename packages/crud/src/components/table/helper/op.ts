import { nextTick, ref } from "vue";
import { useCore } from "../../../hooks";
import { isArray, isBoolean } from "lodash-es";

export function useOp({ config }: { config: ClTable.Config }) {
	const { mitt } = useCore();

	// 是否可见，用于解决一些显示隐藏的副作用
	const visible = ref(true);

	// 重新构建
	async function reBuild(cb?: fn) {
		visible.value = false;

		await nextTick();

		if (cb) {
			cb();
		}

		visible.value = true;

		await nextTick();

		mitt.emit("resize");
	}

	// 显示列
	function showColumn(prop: string | string[], status?: boolean) {
		const keys = isArray(prop) ? prop : [prop];

		// 多级表头
		function deep(list: ClTable.Column[]) {
			list.forEach((e) => {
				if (e.prop && keys.includes(e.prop)) {
					e.hidden = isBoolean(status) ? !status : false;
				}

				if (e.children) {
					deep(e.children);
				}
			});
		}

		deep(config.columns);
	}

	// 隐藏列
	function hideColumn(prop: string | string[]) {
		showColumn(prop, false);
	}

	// 设置列
	function setColumns(list: ClTable.Column[]) {
		if (list) {
			reBuild(() => {
				config.columns.splice(0, config.columns.length, ...list);
			});
		}
	}

	return {
		visible,
		reBuild,
		showColumn,
		hideColumn,
		setColumns
	};
}
