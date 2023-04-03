import { h, ref } from "vue";
import { useCore, useTools } from "../hooks";
import { isBoolean, isFunction, isArray, isString, isObject } from "./index";
import { renderNode } from "./vnode";

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
export function parseTableDict(value: any, data: any) {
	// 匹配列表
	let list: any = [];

	// 是否文本显示
	let isText = false;

	// 分割符
	let separator = ",";

	if (data?.options) {
		list = data.options;
		isText = data.text;
		separator = data.separator;
	} else {
		list = data;
	}

	// 多个值
	const values: any[] = isArray(value) ? value : [value];

	// 返回值
	const arr = values.map((v) => {
		const d = list.find((d: any) => d.value == v);

		if (d) {
			return isText
				? d.label
				: h(<el-tag disable-transitions effect="dark" style="margin: 2px"></el-tag>, d, {
						default: () => d.label
				  });
		} else {
			return v;
		}
	});

	return isText ? arr.join(separator) : arr;
}

/**
 * 解析 table.op.buttons
 */
export function parseTableOpButtons(buttons: any, { scope }: any) {
	const { style, getValue, slots } = useTools();
	const { crud } = useCore();

	const list = getValue(buttons, { scope }) || ["edit", "delete"];

	return list.map((vnode: any) => {
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
	const { getValue } = useTools();

	if (["el-select", "el-radio-group", "el-checkbox-group"].includes(vnode.name)) {
		const list = getValue(vnode.options) || [];

		const children = (
			<div>
				{list.map((e: any, i: number) => {
					// 下拉框
					if (vnode.name == "el-select") {
						let label: any, value: any;

						if (isString(e)) {
							label = value = e;
						} else if (isObject(e)) {
							label = e.label;
							value = e.value;
						} else {
							return <cl-error-message title={`组件渲染失败，options 参数错误`} />;
						}

						return <el-option key={i} label={label} value={value} {...e.props} />;
					}
					// 单选框组
					else if (vnode.name == "el-radio-group") {
						return (
							<el-radio key={i} label={e.value} {...e.props}>
								{e.label}
							</el-radio>
						);
					}
					// 多选框组
					else if (vnode.name == "el-checkbox-group") {
						return (
							<el-checkbox key={i} label={e.value} {...e.props}>
								{e.label}
							</el-checkbox>
						);
					} else {
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
