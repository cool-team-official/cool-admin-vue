import { isFunction, isRegExp, isString } from "lodash-es";
import { Colors, PropRules } from "../dict";
import { Entity } from "../types";

// 处理器
const handler = {
	// 单选
	dict({ comment }: Entity) {
		const [label, ...arr] = comment.split(" ");

		// 选择列表
		const list = arr.map((e: string, i: number) => {
			const [value, label] = e.split("-");
			const d = {
				label,
				value: isNaN(Number(value)) ? value : Number(value),
				color: undefined as any
			};

			if (i > 0 && Colors[i]) {
				d.color = Colors[i];
			}

			return d;
		});

		const d = {
			table: {
				label,
				dict: list
			},
			form: {
				label,
				component: {
					name: "",
					options: list
				}
			} as ClForm.Item
		};

		// 默认值
		if (list[0]) {
			d.form.value = list[0].value;
		}

		// 匹配组件
		d.form.component!.name = arr.length > 4 ? "el-select" : "el-radio-group";

		return d;
	},

	// 多选
	dict_multiple(entity: Entity) {
		const { table, form } = this.dict(entity);

		if (!form.component?.props) {
			form.component!.props = {};
		}

		if (!form.value) {
			form.value = [];
		}

		switch (form.component?.name) {
			case "el-select":
				form.component.props.multiple = true;
				form.component.props.filterable = true;
				break;

			case "el-radio-group":
				form.component.name = "el-checkbox-group";
				break;
		}

		return {
			table,
			form
		};
	}
};

// 创建组件
export function createComponent(entity: Entity, columns: Entity[]) {
	const prop = entity.propertyName;
	let label = entity.comment;
	let d: any;
	let isHidden = false;

	PropRules.find((r) => {
		let s = false;

		if (r.test) {
			s = !!r.test.find((e) => {
				if (isRegExp(e)) {
					return e.test(prop);
				}

				if (isFunction(e)) {
					return e(prop);
				}

				if (isString(e)) {
					if (e == prop) {
						return true;
					}

					const re = new RegExp(`${e}$`);
					return re.test(prop.toLocaleLowerCase());
				}

				return false;
			});
		}

		if (r.group) {
			if (
				r.group.includes(prop) &&
				r.group.some((e) => columns.find((c) => c.propertyName == e))
			) {
				if (r.group[0] == prop) {
					s = true;
				} else {
					isHidden = true;
				}
			}
		}

		if (s) {
			if (r.handler) {
				const fn = isString(r.handler) ? handler[r.handler] : r.handler;

				if (isFunction(fn)) {
					d = fn(entity);
				}
			} else {
				d = {
					...r,
					test: undefined
				};
			}
		}

		return s;
	});

	function parse(v: any) {
		label = label.split(" ")[0];

		if (v?.name) {
			return {
				prop,
				label,
				component: v
			};
		} else {
			return {
				prop,
				label,
				...v
			};
		}
	}

	return {
		column: parse(d?.table),
		item: parse(d?.form),
		isHidden
	};
}

// 转成代码字符串
export function toCodeString(data: any) {
	const arr: string[][] = [];

	let code = JSON.stringify(data, (key, value) => {
		if (isFunction(value)) {
			const str = value.toString();
			arr.push([JSON.stringify({ [key]: str }), str]);
			return str;
		} else {
			return value;
		}
	});

	arr.forEach((e) => {
		code = code.replace(e[0].substring(1, e[0].length - 1), e[1]);
	});

	return code;
}
