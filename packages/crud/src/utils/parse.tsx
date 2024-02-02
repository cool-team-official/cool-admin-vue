import { h, useSlots } from "vue";
import { useConfig, useCore } from "../hooks";
import { isBoolean, isFunction, isArray, isString, cloneDeep } from "lodash-es";
import { renderNode } from "./vnode";
import { deepFind, getValue, isObject } from ".";

/**
 * 解析 form.hidden
 */
export function parseFormHidden(value: any, { scope }: any) {
	if (isBoolean(value)) {
		return value;
	} else if (isFunction(value)) {
		return value({ scope });
	}

	return false;
}

/**
 * 解析 table.dict
 */
export function parseTableDict(value: any, item: ClTable.Column) {
	const { style } = useConfig();

	// 选项列表
	const list: DictOptions = cloneDeep(getValue(item.dict || []));

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
			delete d.children;

			return d;
		});

	// 格式化返回
	if (item.dictFormatter) {
		return item.dictFormatter(result);
	} else {
		// tag 返回
		return result.map((e) => {
			return h(
				<el-tag disable-transitions effect="dark" style="margin: 2px; border: 0" />,
				e,
				{
					default: () => e.label
				}
			);
		});
	}
}

/**
 * 解析 table.op.buttons
 */
export function parseTableOpButtons(buttons: any[], { scope }: any) {
	const { crud } = useCore();
	const { style } = useConfig();
	const slots = useSlots();

	const list: any[] = getValue(buttons, { scope }) || ["edit", "delete"];

	return list.map((vnode) => {
		if (vnode === "info") {
			return (
				<el-button
					text
					bg
					size={style.size}
					v-show={crud.getPermission("info")}
					onClick={() => {
						crud.rowInfo(scope.row);
					}}>
					{crud.dict.label?.info}
				</el-button>
			);
		} else if (vnode === "edit") {
			return (
				<el-button
					text
					bg
					type="primary"
					size={style.size}
					v-show={crud.getPermission("update")}
					onClick={() => {
						crud.rowEdit(scope.row);
					}}>
					{crud.dict.label?.update}
				</el-button>
			);
		} else if (vnode === "delete") {
			return (
				<el-button
					text
					bg
					type="danger"
					size={style.size}
					v-show={crud.getPermission("delete")}
					onClick={() => {
						crud.rowDelete(scope.row);
					}}>
					{crud.dict.label?.delete}
				</el-button>
			);
		} else {
			return (
				!vnode.hidden &&
				renderNode(vnode, {
					scope,
					slots,
					custom(vnode) {
						return (
							<el-button
								text
								type={vnode.type}
								bg
								{...vnode?.props}
								onClick={() => {
									vnode.onClick({ scope });
								}}>
								{vnode.label}
							</el-button>
						);
					}
				})
			);
		}
	});
}

/**
 * 解析扩展组件
 */
export function parseExtensionComponent(vnode: any) {
	if (["el-select", "el-radio-group", "el-checkbox-group"].includes(vnode.name)) {
		const list = getValue(vnode.options) || [];

		const children = (
			<div>
				{list.map((e: any, i: number) => {
					let label: any;
					let value: any;

					if (isString(e)) {
						label = value = e;
					} else if (isObject(e)) {
						label = e.label;
						value = e.value;
					} else {
						return <cl-error-message title={`Component options error`} />;
					}

					switch (vnode.name) {
						case "el-select":
							return <el-option key={i} label={label} value={value} {...e.props} />;
						case "el-radio-group":
							return (
								<el-radio key={i} label={value} {...e.props}>
									{label}
								</el-radio>
							);
						case "el-checkbox-group":
							return (
								<el-checkbox key={i} label={value} {...e.props}>
									{label}
								</el-checkbox>
							);
						default:
							return null;
					}
				})}
			</div>
		);

		return {
			children
		};
	} else {
		return {};
	}
}
