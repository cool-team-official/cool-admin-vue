import { defineComponent, h, inject, nextTick, onMounted, ref } from "vue";
import { Crud, Mitt } from "@/crud/types";
import { useRefs } from "../../hooks/core";
import { cloneDeep, isArray, isEmpty, isFunction, isNull } from "../../utils";
import { renderNode } from "../../utils/vnode";
import ContextMenu from "../context-menu/index";
import { useElTableApi } from "./helper";
import { Browser } from "@/crud/types";

export default defineComponent({
	name: "cl-table",

	props: {
		columns: {
			type: Array,
			required: true,
			default: () => []
		},
		on: {
			type: Object,
			default: () => {
				return {};
			}
		},
		props: {
			type: Object,
			default: () => {
				return {};
			}
		},
		height: Number,
		// 是否自动计算表格高度
		autoHeight: {
			type: Boolean,
			default: true
		},
		// 开启右键菜单
		contextMenu: {
			type: [Boolean, Array],
			default: undefined
		}
	},

	emits: ["selection-change"],

	setup(props, { emit }) {
		const { refs, setRefs }: any = useRefs();

		// 参数注入
		const mitt = inject("mitt") as Mitt;
		const crud = inject("crud") as Crud;

		// el-table api
		const {
			clearSelection,
			toggleRowSelection,
			toggleAllSelection,
			toggleRowExpansion,
			setCurrentRow,
			clearSort,
			clearFilter,
			doLayout,
			sort
		} = useElTableApi({ refs });

		// 列表数据
		const data = ref<Array<any>>([]);

		// 最大高度
		const maxHeight = ref<number>(0);

		// 改变排序
		function changeSort(prop: string, order: string) {
			if (order === "desc") {
				order = "descending";
			}

			if (order === "asc") {
				order = "ascending";
			}

			sort(prop, order);
		}

		// 多选框选择
		function onSelectionChange(selection: Array<any>) {
			crud.selection.splice(0, crud.selection.length, ...selection);
			emit("selection-change", selection);
		}

		// 排序监听
		function onSortChange({ prop, order }: any) {
			if (order === "descending") {
				order = "desc";
			}

			if (order === "ascending") {
				order = "asc";
			}

			if (!order) {
				prop = null;
			}

			crud.refresh({
				prop,
				order,
				page: 1
			});
		}

		// 右键菜单
		function onRowContextMenu(row: any, column: any, event: any) {
			// 菜单配置
			const cm: any =
				isEmpty(props.contextMenu) && !isArray(props.contextMenu)
					? crud.table!["context-menu"]
					: props.contextMenu;

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
				// 解析按钮
				const list = buttons
					.map((e: any) => {
						switch (e) {
							case "refresh":
								return {
									label: "刷新",
									callback(_: any, done: Function) {
										crud.refresh();
										done();
									}
								};
							case "edit":
							case "update":
								return {
									label: "编辑",
									hidden: !crud.getPermission("update"),
									callback(_: any, done: Function) {
										crud.rowEdit(row);
										done();
									}
								};
							case "delete":
								return {
									label: "删除",
									hidden: !crud.getPermission("delete"),
									callback(_: any, done: Function) {
										crud.rowDelete(row);
										done();
									}
								};
							case "check":
								return {
									label: crud.selection.find((e: any) => e.id == row.id)
										? "取消选择"
										: "选择",
									hidden: !props.columns.find((e: any) => e.type === "selection"),
									callback(_: any, done: Function) {
										toggleRowSelection(row);
										done();
									}
								};
							case "order-desc":
								return {
									label: `${column.label} - 降序`,
									hidden: !column.sortable,
									callback(_: any, done: Function) {
										changeSort(column.property, "desc");
										done();
									}
								};
							case "order-asc":
								return {
									label: `${column.label} - 升序`,
									hidden: !column.sortable,
									callback(_: any, done: Function) {
										changeSort(column.property, "asc");
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
					.filter(e => Boolean(e) && !e.hidden);

				// 打开菜单
				if (list.length > 0) {
					ContextMenu.open(event, {
						list
					});
				}
			}

			// 回调
			if (props.props.onRowContextmenu) {
				props.props.onRowContextmenu(row, column, event);
			}
		}

		// 计算表格最大高度
		function calcMaxHeight() {
			if (!props.autoHeight) {
				return false;
			}

			nextTick(() => {
				let vm: any = refs.value.table;
				let h = 15;

				// 获取表格元素
				while (!vm.$parent?.$el.className.includes("cl-crud")) {
					vm = vm.$parent;
				}

				// 获取表格上的高度
				h += vm.$el.offsetTop;

				// 获取表格下的高度
				let n = vm.$el.nextSibling;

				while (n && (n.className || "").includes("el-row")) {
					h += n.clientHeight + 5;
					n = n.nextSibling;
				}

				// 设置表格最大高度
				maxHeight.value = crud.crudRef.clientHeight - h;
			});
		}

		// 监听事件
		(function mittEvent() {
			// 刷新事件
			mitt.on("crud.refresh", ({ list }: any) => {
				data.value = list;
			});

			// 窗口大小改变事件
			mitt.on("crud.resize", () => {
				calcMaxHeight();
			});
		})();

		// 设置请求参数
		(function setParams() {
			const { order, prop } = props.props["default-sort"] || {};

			if (order && prop) {
				crud.params.order = order === "descending" ? "desc" : "asc";
				crud.params.prop = prop;
			}
		})();

		onMounted(function() {
			calcMaxHeight();
		});

		return {
			refs,
			data,
			maxHeight,
			setRefs,
			onSelectionChange,
			onSortChange,
			onRowContextMenu,
			clearSelection,
			toggleRowSelection,
			toggleAllSelection,
			toggleRowExpansion,
			setCurrentRow,
			clearSort,
			clearFilter,
			doLayout,
			sort
		};
	},

	render(ctx: any) {
		const crud = inject("crud") as Crud;
		const browser = inject("browser") as Browser;

		// 渲染列
		const renderColumn = () => {
			return ctx.columns
				.filter((e: any) => !e.hidden)
				.map((item: any, index: number) => {
					const ElTableColumn = (
						<el-table-column
							key={`crud-table-column-${index}`}
							align="center"></el-table-column>
					);

					// 操作按钮
					if (item.type === "op") {
						return h(
							ElTableColumn,
							{
								label: "操作",
								width: "160px",
								fixed: browser.isMini ? null : "right",
								...item
							},
							{
								default: (scope: any) => {
									return (
										<div class="cl-table__op">
											{(item.buttons || ["edit", "delete"]).map(
												(vnode: any) => {
													if (vnode === "edit") {
														return (
															<el-button
																size="mini"
																type="text"
																v-show={crud.getPermission(
																	"update"
																)}
																onClick={() => {
																	crud.rowEdit(scope.row);
																}}>
																{crud.dict.label.update}
															</el-button>
														);
													} else if (vnode === "delete") {
														return (
															<el-button
																size="mini"
																type="text"
																v-show={crud.getPermission(
																	"delete"
																)}
																onClick={() => {
																	crud.rowDelete(scope.row);
																}}>
																{crud.dict.label.delete}
															</el-button>
														);
													} else {
														return renderNode(vnode, {
															scope,
															slots: ctx.$slots
														});
													}
												}
											)}
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
						const deep = (item: any) => {
							const props = cloneDeep(item);

							// Cannot set property children of #<Element>
							delete props.children;

							return h(ElTableColumn, props, {
								header: (scope: any) => {
									const slot = ctx.$slots[`header-${item.prop}`];

									if (slot) {
										return slot({
											scope
										});
									} else {
										return scope.column.label;
									}
								},
								default: (scope: any) => {
									if (item.children) {
										return <div>{item.children.map(deep)}</div>;
									}

									// Scope data
									const newScope = {
										...scope,
										...item
									};

									// 绑定值
									const value = scope.row[item.prop];

									// 使用插槽
									const slot = ctx.$slots[`column-${item.prop}`];

									if (slot) {
										return slot({
											scope: newScope
										});
									} else {
										// 判断是否自定义渲染
										if (item.component) {
											return renderNode(item.component, {
												prop: item.prop,
												scope: newScope.row
											});
										}
										// Formatter
										else if (item.formatter) {
											return item.formatter(
												newScope.row,
												newScope.column,
												newScope.row[item.prop],
												newScope.$index
											);
										}
										// 字典状态
										else if (item.dict) {
											const data = item.dict.find(
												(d: any) => d.value == value
											);

											if (data) {
												const ElTag = (
													<el-tag
														disable-transitions
														size="small"
														effect="dark"></el-tag>
												);

												// Use el-tag
												return h(ElTag, data, {
													default() {
														return data.label;
													}
												});
											} else {
												return value;
											}
										}
										// Empty text
										else if (isNull(value)) {
											return scope.emptyText;
										}
										// Value
										else {
											return value;
										}
									}
								}
							});
						};

						return deep(item);
					}
				});
		};

		const ElTable = (
			<el-table
				class="cl-table"
				ref={ctx.setRefs("table")}
				border
				size="mini"
				v-loading={crud.loading}
				data={ctx.data}></el-table>
		);

		return h(
			ElTable,
			{
				onSortChange: ctx.onSortChange,
				maxHeight: ctx.autoHeight ? ctx.maxHeight : null,
				...ctx.props,
				onSelectionChange: ctx.onSelectionChange,
				onRowContextmenu: ctx.onRowContextMenu
			},
			{
				default() {
					return renderColumn();
				},
				empty() {
					return (
						<div class="cl-table__empty">{ctx.$slots.empty && ctx.$slots.empty()}</div>
					);
				},
				append() {
					return (
						<div class="cl-table__append">
							{ctx.$slots.append && ctx.$slots.append()}
						</div>
					);
				}
			}
		);
	}
});
