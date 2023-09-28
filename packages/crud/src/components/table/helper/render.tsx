import { h, useSlots } from "vue";
import { useCore, useBrowser, useConfig } from "../../../hooks";
import { cloneDeep, isEmpty, orderBy } from "lodash-es";
import { getValue } from "../../../utils";
import { parseTableDict, parseTableOpButtons } from "../../../utils/parse";
import { renderNode } from "../../../utils/vnode";

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
										return parseTableDict(value, item);
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
