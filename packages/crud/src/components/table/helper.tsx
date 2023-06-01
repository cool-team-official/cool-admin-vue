import { computed, h, nextTick, onActivated, onMounted, ref } from "vue";
import { useCore, useTools } from "../../hooks";
import {
	addClass,
	cloneDeep,
	debounce,
	isArray,
	isBoolean,
	isEmpty,
	isFunction
} from "../../utils";
import { renderNode } from "../../utils/vnode";
import { parseTableDict, parseTableOpButtons } from "../../utils/parse";
import { ContextMenu } from "../context-menu";
import { orderBy } from "lodash-es";

declare type Emit = (name: "selection-change" | "sort-change", ...args: any[]) => void;
declare type Table = Vue.Ref<any>;
declare type Config = ClTable.Config;
declare interface Sort {
	defaultSort: {
		prop?: string;
		order?: string;
	};
	changeSort(prop: string, order: string): void;
}

// 排序
export function useSort({ config, emit, Table }: { config: Config; emit: Emit; Table: Table }) {
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

		Table.value.sort(prop, order);
	}

	return {
		defaultSort,
		onSortChange,
		changeSort
	};
}

// 单元行事件
export function useRow({ Table, config, Sort }: { Table: Table; config: Config; Sort: Sort }) {
	const { crud } = useCore();

	// 右键菜单
	function onRowContextMenu(row: any, column: any, event: any) {
		// 菜单配置
		const cm: any =
			isEmpty(config.contextMenu) && !isArray(config.contextMenu)
				? crud.table.contextMenu
				: config.contextMenu;

		// 菜单按钮
		let buttons = ["refresh", "check", "edit", "delete", "order-asc", "order-desc"];
		// 是否开启
		let enable = false;

		if (cm) {
			if (isArray(cm)) {
				buttons = cm || [];
				enable = Boolean(buttons.length > 0);
			} else {
				enable = true;
			}
		}

		if (enable) {
			// 高亮
			Table.value.setCurrentRow(row);

			// 解析按钮
			const list = buttons
				.map((e: any) => {
					switch (e) {
						case "refresh":
							return {
								label: "刷新",
								callback(done: fn) {
									crud.refresh();
									done();
								}
							};
						case "edit":
						case "update":
							return {
								label: "编辑",
								hidden: !crud.getPermission("update"),
								callback(done: fn) {
									crud.rowEdit(row);
									done();
								}
							};
						case "delete":
							return {
								label: "删除",
								hidden: !crud.getPermission("delete"),
								callback(done: fn) {
									crud.rowDelete(row);
									done();
								}
							};
						case "info":
							return {
								label: "详情",
								hidden: !crud.getPermission("info"),
								callback(done: fn) {
									crud.rowInfo(row);
									done();
								}
							};
						case "check":
							return {
								label: crud.selection.find((e) => e.id == row.id)
									? "取消选择"
									: "选择",
								hidden: !config.columns.find((e) => e.type === "selection"),
								callback(done: fn) {
									Table.value.toggleRowSelection(row);
									done();
								}
							};
						case "order-desc":
							return {
								label: `${column.label} - 降序`,
								hidden: !column.sortable,
								callback(done: fn) {
									Sort.changeSort(column.property, "desc");
									done();
								}
							};
						case "order-asc":
							return {
								label: `${column.label} - 升序`,
								hidden: !column.sortable,
								callback(done: fn) {
									Sort.changeSort(column.property, "asc");
									done();
								}
							};
						default:
							if (isFunction(e)) {
								return e(row, column, event);
							} else {
								return e;
							}
					}
				})
				.filter((e) => Boolean(e) && !e.hidden);

			// 打开菜单
			if (list.length > 0) {
				ContextMenu.open(event, {
					list
				});
			}
		}

		// 回调
		if (config.onRowContextmenu) {
			config.onRowContextmenu(row, column, event);
		}
	}

	return {
		onRowContextMenu
	};
}

// 表格高度
export function useHeight({ config, Table }: { Table: Table; config: Config }) {
	const { mitt } = useCore();
	const { render } = useTools();

	// 是否自动计算
	const isAuto = computed(() =>
		isBoolean(config.autoHeight) ? config.autoHeight : render.autoHeight
	);

	// 最大高度
	const maxHeight = ref(0);

	// 计算表格最大高度
	const update = debounce(async () => {
		if (!isAuto.value) {
			return false;
		}

		await nextTick();

		let vm: any = Table.value;
		let r: any = null;

		if (vm) {
			while (!vm.$parent?.$el.className.includes("cl-crud")) {
				vm = vm.$parent;
				r = vm.$parent.$el;
			}

			// 设置序号
			r.querySelectorAll(".el-row").forEach((e: any, i: number, arr: any[]) => {
				if (i == arr.length - 1) {
					addClass(e, "cl-row--last");
				}
			});

			// 获取上高度
			let h = vm.$el.offsetTop;

			// 获取下高度
			let n = vm.$el.nextSibling;

			while (n && (n.className || "").includes("cl-row")) {
				h += n.clientHeight;
				n = n.nextSibling;
			}

			// 设置最大高度
			maxHeight.value = r.clientHeight - h - 10;
		}
	}, 100);

	// 窗口大小改变事件
	mitt.on("crud.resize", () => {
		update();
	});

	onMounted(function () {
		update();
	});

	onActivated(function () {
		update();
	});

	return {
		isAuto,
		maxHeight,
		calcMaxHeight: update
	};
}

// 多选框
export function useSelection({ emit }: { emit: Emit }) {
	const { crud } = useCore();

	// 选择项发生变化
	function onSelectionChange(selection: any[]) {
		crud.selection.splice(0, crud.selection.length, ...selection);
		emit("selection-change", crud.selection);
	}

	return {
		selection: crud.selection,
		onSelectionChange
	};
}

// 数据处理
export function useData({ config, Table }: { config: Config; Table: Table }) {
	const { mitt, crud } = useCore();

	// 列表数据
	const data = ref<any[]>([]);

	// 设置数据
	function setData(list: any[]) {
		data.value = list;
	}

	// 监听刷新
	mitt.on("crud.refresh", ({ list }: { list: any[] }) => {
		data.value = list;

		// 显示选中行
		nextTick(() => {
			crud.selection.forEach((e) => {
				const d = list.find((a) => a[config.rowKey] == e[config.rowKey]);

				if (d) {
					Table.value.toggleRowSelection(d, true);
				}
			});
		});
	});

	return {
		data,
		setData
	};
}

// 表格操作
export function useOp({ config }: { config: Config }) {
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

		mitt.emit("crud.resize");
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

// 渲染
export function useRender() {
	const { getValue, browser, slots } = useTools();
	const { crud } = useCore();

	// 渲染列
	function renderColumn(columns: ClTable.Column[]) {
		const arr = columns.map((e) => {
			const d = getValue(e);

			if (!d.orderNum) {
				d.orderNum = 0;
			}

			return d;
		});

		return orderBy(arr, "orderNum", "asc")
			.map((item, index) => {
				if (item.hidden) {
					return null;
				}

				const ElTableColumn = (
					<el-table-column key={`cl-table-column__${index}`} align="center" />
				);

				// 操作按钮
				if (item.type === "op") {
					return h(
						ElTableColumn,
						{
							label: crud.dict.label.op,
							width: "160px",
							fixed: browser.isMini ? null : "right",
							...item
						},
						{
							default: (scope: any) => {
								return (
									<div class="cl-table__op">
										{parseTableOpButtons(item.buttons, { scope })}
									</div>
								);
							}
						}
					);
				}
				// 多选，序号
				else if (["selection", "index"].includes(item.type)) {
					return h(ElTableColumn, item);
				}
				// 默认
				else {
					function deep(item: ClTable.Column) {
						if (item.hidden) {
							return null;
						}

						const props: obj = cloneDeep(item);

						// Cannot set property children of #<Element>
						delete props.children;

						return h(ElTableColumn, props, {
							header(scope: any) {
								const slot = slots[`header-${item.prop}`];

								if (slot) {
									return slot({
										scope
									});
								} else {
									return scope.column.label;
								}
							},
							default(scope: any) {
								if (item.children) {
									return item.children.map(deep);
								}

								// 使用插槽
								const slot = slots[`column-${item.prop}`];

								if (slot) {
									return slot({
										scope,
										item
									});
								} else {
									// 绑定值
									let value = scope.row[item.prop];

									// 格式化
									if (item.formatter) {
										value = item.formatter(
											scope.row,
											scope.column,
											value,
											scope.$index
										);
									}

									// 自定义渲染
									if (item.component) {
										return renderNode(item.component, {
											prop: item.prop,
											scope: scope.row,
											_data: {
												column: scope.column,
												index: scope.$index,
												row: scope.row
											}
										});
									}
									// 字典状态
									else if (item.dict) {
										return parseTableDict(value, item.dict);
									}
									// 空数据
									else if (isEmpty(value)) {
										return scope.emptyText;
									} else {
										return value;
									}
								}
							}
						});
					}

					return deep(item);
				}
			})
			.filter(Boolean);
	}

	// 插槽 empty
	function renderEmpty(emptyText: String) {
		return (
			<div class="cl-table__empty">
				{slots.empty ? (
					slots.empty()
				) : (
					<el-empty image-size={100} description={emptyText}></el-empty>
				)}
			</div>
		);
	}

	// 插槽 append
	function renderAppend() {
		return <div class="cl-table__append">{slots.append && slots.append()}</div>;
	}

	return {
		renderColumn,
		renderEmpty,
		renderAppend
	};
}
