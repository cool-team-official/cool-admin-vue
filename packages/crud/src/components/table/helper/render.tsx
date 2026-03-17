import { h, useSlots } from "vue";
import { useCore, useBrowser, useConfig } from "../../../hooks";
import { assign, cloneDeep, get, isArray, isEmpty, isObject, isString, orderBy } from "lodash-es";
import { deepFind, getValue } from "../../../utils";
import { renderNode } from "../../../utils/vnode";
import { renderHeader } from "./header";

// 渲染
export function useRender() {
	const browser = useBrowser();
	const slots = useSlots();
	const { crud } = useCore();
	const { style } = useConfig();

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
					<el-table-column
						key={`cl-table-column__${index}`}
						align={style.table.column.align}
						header-align={style.table.column.headerAlign}
						minWidth={style.table.column.minWidth}
					/>
				);

				// 操作按钮
				if (item.type === "op") {
					const props = assign(
						{
							label: crud.dict.label.op,
							width: style.table.column.opWidth,
							fixed: browser.isMini ? null : "right"
						},
						item
					);

					return h(ElTableColumn, props, {
						default: (scope: any) => {
							return (
								<div class="cl-table__op">
									{renderOpButtons(item.buttons, { scope })}
								</div>
							);
						}
					});
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
								return renderHeader(item, { scope, slots });
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
									let value = get(scope.row, item.prop as string);

									// 格式化
									if (item.formatter) {
										value = item.formatter(
											scope.row,
											scope.column,
											value,
											scope.$index
										);

										if (isObject(value)) {
											return value;
										}
									}

									// 自定义渲染
									if (item.render) {
										return item.render(
											scope.row,
											scope.column,
											value,
											scope.$index
										);
									}
									// 自定义渲染2
									else if (item.component) {
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
										return renderDict(value, item);
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

	// 渲染操作按钮
	function renderOpButtons(buttons: any, { scope }: any) {
		const list = getValue(buttons || ["edit", "delete"], { scope }) as ClTable.OpButton;

		return list.map((vnode) => {
			if (vnode === "info") {
				return (
					<el-button
						plain
						size={style.size}
						v-show={crud.getPermission("info")}
						onClick={(e: MouseEvent) => {
							crud.rowInfo(scope.row);
							e.stopPropagation();
						}}>
						{crud.dict.label?.info}
					</el-button>
				);
			} else if (vnode === "edit") {
				return (
					<el-button
						text
						type="primary"
						size={style.size}
						v-show={crud.getPermission("update")}
						onClick={(e: MouseEvent) => {
							crud.rowEdit(scope.row);
							e.stopPropagation();
						}}>
						{crud.dict.label?.update}
					</el-button>
				);
			} else if (vnode === "delete") {
				return (
					<el-button
						text
						type="danger"
						size={style.size}
						v-show={crud.getPermission("delete")}
						onClick={(e: MouseEvent) => {
							crud.rowDelete(scope.row);
							e.stopPropagation();
						}}>
						{crud.dict.label?.delete}
					</el-button>
				);
			} else {
				if (typeof vnode === "object") {
					if (vnode.hidden) {
						return null;
					}
				}

				return renderNode(vnode, {
					scope,
					slots,
					custom(vnode) {
						return (
							<el-button
								text
								type={vnode.type}
								{...vnode?.props}
								onClick={(e: MouseEvent) => {
									vnode.onClick({ scope });
									e.stopPropagation();
								}}>
								{vnode.label}
							</el-button>
						);
					}
				});
			}
		});
	}

	// 渲染字典
	function renderDict(value: any, item: ClTable.Column) {
		// 选项列表
		const list = cloneDeep(item.dict || []) as DictOptions;

		// 字符串分隔符
		const separator = item.dictSeparator === undefined ? "," : item.dictSeparator;

		// 设置颜色
		if (item.dictColor) {
			list.forEach((e, i) => {
				if (!e.color) {
					e.color = style.colors[i];
				}
			});
		}

		// 绑定值
		let values: any[] = [];

		// 格式化值
		if (isArray(value)) {
			values = value;
		} else if (isString(value)) {
			if (separator) {
				values = value.split(separator);
			} else {
				values = [value];
			}
		} else {
			values = [value];
		}

		// 返回值
		const result = values
			.filter((e) => e !== undefined && e !== null && e !== "")
			.map((v) => {
				const d = deepFind(v, list, { allLevels: item.dictAllLevels }) || {
					label: v,
					value: v
				};

				return {
					...d,
					children: []
				};
			});

		// 格式化返回
		if (item.dictFormatter) {
			return item.dictFormatter(result);
		} else {
			// tag 返回
			return result.map((e) => {
				return h(
					<el-tag disable-transitions style="margin: 2px; border: 0" />,
					{
						type: e.type,
						closable: e.closable,
						hit: e.hit,
						color: e.color,
						size: e.size,
						effect: e.effect || "dark",
						round: e.round
					},
					{
						default: () => <span>{e.label}</span>
					}
				);
			});
		}
	}

	// 插槽 empty
	function renderEmpty(emptyText: string) {
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
