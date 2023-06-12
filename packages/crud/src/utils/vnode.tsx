import { h, resolveComponent, toRaw, VNode } from "vue";
import { useGlobal } from "../hooks";
import { isFunction, isString, isObject } from "./index";
import { parseExtensionComponent } from "./parse";
import temp from "./temp";

// 配置
interface Options {
	// 标识
	prop?: string;
	// 数据值
	scope?: any;
	// 当前行
	item?: any;
	// 插槽
	slots?: any;
	// 子集
	children?: any[] & any;
	// 自定义
	custom?: (vnode: any) => any;
	// 渲染方式
	render?: "slot" | null;
	// 其他
	[key: string]: any;
}

// 临时注册组件列表
const regs: Map<string, any> = new Map();

// 解析节点
export function parseNode(vnode: any, options: Options): VNode {
	const { scope, prop, slots, children, _data } = options || [];
	const global = useGlobal();

	// 渲染后组件
	let comp: VNode | null = null;

	// 插槽模式渲染
	if (vnode.name.includes("slot-")) {
		const rn = slots[vnode.name];

		if (rn) {
			return rn({ scope, prop, ..._data });
		} else {
			return <cl-error-message title={`${vnode.name} is not found`} />;
		}
	}

	// 实例模式下，先注册到全局，再分解组件渲染
	if (vnode.vm && !regs.get(vnode.name)) {
		temp.vue.component(vnode.name, { ...vnode.vm });
		regs.set(vnode.name, { ...vnode.vm });
	}

	// 处理 props
	if (isFunction(vnode.props)) {
		vnode.props = vnode.props({ scope, prop, ..._data });
	}

	// 组件参数
	const props = {
		...vnode.props,
		..._data,
		prop,
		scope
	};

	// 是否禁用
	props.disabled = _data?.isDisabled || props.disabled;

	// 添加双向绑定
	if (props && scope) {
		if (prop) {
			props.modelValue = scope[prop];
			props["onUpdate:modelValue"] = function (val: any) {
				scope[prop] = val;
			};
		}
	}

	// 组件实例渲染
	if (vnode.vm) {
		comp = h(regs.get(vnode.name), props);
	} else {
		// 是否函数式插槽
		const isFunctionSlot =
			!global.render.functionSlots.exclude?.includes(vnode.name) &&
			(vnode.functionSlot === undefined ? true : vnode.functionSlot);

		// 渲染组件
		comp = h(
			toRaw(resolveComponent(vnode.name)),
			props,
			isFunctionSlot ? () => children : children
		);
	}

	// 挂载到 refs 中
	if (isFunction(vnode.ref)) {
		setTimeout(() => {
			vnode.ref(comp?.component?.exposed);
		}, 0);
	}

	return comp;
}

// 渲染节点
export function renderNode(vnode: any, options: Options) {
	const { item, scope, children, _data, render } = options || {};

	if (!vnode) {
		return null;
	}

	if (vnode.__v_isVNode) {
		return vnode;
	}

	// 默认参数配置
	if (item) {
		if (item.component) {
			if (!item.component.props) {
				item.component.props = {};
			}

			// 占位符
			let placeholder = "";

			switch (item.component?.name) {
				case "el-input":
					placeholder = "请填写";
					break;

				case "el-select":
					placeholder = "请选择";
					break;

				default:
					break;
			}

			if (placeholder) {
				if (!item.component.props.placeholder) {
					item.component.props.placeholder = placeholder + item.label;
				}
			}
		}
	}

	// 组件实例
	if (vnode.vm) {
		if (!vnode.name) {
			vnode.name = vnode.vm?.name || vnode.vm?.__hmrId;
		}

		return parseNode(vnode, options);
	}

	// 组件名渲染
	if (isString(vnode)) {
		if (render == "slot") {
			if (!vnode.includes("slot-")) {
				return vnode;
			}
		}

		return parseNode({ name: vnode }, options);
	}

	// 方法回调
	if (isFunction(vnode)) {
		return vnode({ scope, h, ..._data });
	}

	// jsx 模式
	if (isObject(vnode)) {
		if (vnode.name) {
			return parseNode(vnode, { ...options, children, ...parseExtensionComponent(vnode) });
		} else {
			if (options.custom) {
				return options.custom(vnode);
			}

			return <cl-error-message title={`组件渲染失败，组件 name 不能为空`} />;
		}
	}
}
