import { useCore } from "../../../hooks";

// 排序
export function useSort({
	config,
	Table,
	emit
}: {
	config: ClTable.Config;
	Table: Vue.Ref<any>;
	emit: Vue.Emit;
}) {
	const { crud } = useCore();

	// 设置默认排序Ï
	const defaultSort = (function () {
		let { prop, order } = config.defaultSort || {};

		const item = config.columns.find((e) =>
			["desc", "asc", "descending", "ascending"].find((a) => a == e.sortable)
		);

		if (item) {
			prop = item.prop;
			order = ["descending", "desc"].find((a) => a == item.sortable)
				? "descending"
				: "ascending";
		}

		if (order && prop) {
			crud.params.order = ["descending", "desc"].includes(order) ? "desc" : "asc";
			crud.params.prop = prop;

			return {
				prop,
				order
			};
		}

		return {};
	})();

	// 排序监听
	function onSortChange({ prop, order }: { prop: string | undefined; order: string }) {
		if (config.sortRefresh) {
			if (order === "descending") {
				order = "desc";
			}

			if (order === "ascending") {
				order = "asc";
			}

			if (!order) {
				prop = undefined;
			}

			crud.refresh({
				prop,
				order,
				page: 1
			});
		}

		emit("sort-change", { prop, order });
	}

	// 改变排序
	function changeSort(prop: string, order: string) {
		if (order === "desc") {
			order = "descending";
		}

		if (order === "asc") {
			order = "ascending";
		}

		Table.value?.sort(prop, order);
	}

	return {
		defaultSort,
		onSortChange,
		changeSort
	};
}
