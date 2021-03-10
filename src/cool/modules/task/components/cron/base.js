/**
 * 表单项基础类, 所有输入组件都继承Base
 * @module $ui/components/my-form/src/Base
 */

import { FormItem } from "element-ui";
import { setStyle } from "element-ui/lib/utils/dom";
import { addResizeListener, removeResizeListener } from "element-ui/lib/utils/resize-event";

const _get = require("lodash/get");
const _set = require("lodash/set");
const _isEqual = require("lodash/isEqual");
const _cloneDeep = require("lodash/cloneDeep");

/**
 * 深拷贝
 * @param {*} value  要深拷贝的值
 * @return {*} 返回拷贝后的值
 */
export function cloneDeep(value) {
	return _cloneDeep(value);
}

/**
 * 判断两个对象是否相等
 * @param {*} object 对象1
 * @param {*} other 对象2
 * @return {boolean}
 */
export function isEqual(object, other) {
	return _isEqual(object, other);
}
/**
 * 插槽
 * @member slots
 * @property {string} before 输入组件前面的内容，仅当父组件是MyForm有效
 * @property {string} after 输入组件后面的内容，仅当父组件是MyForm有效
 * @property {string} label 定义字段的label内容，仅当父组件是MyForm有效
 * @property {string} error 作用域插槽，定义验证错误提示内容，仅当父组件是MyForm有效
 */

export default {
	inject: {
		myForm: {
			default: null
		}
	},
	components: {
		FormItem
	},
	/**
	 * 属性参数
	 * @member props
	 * @property {string} [name] 表单域 model 字段名称, 等价于 el-form-item 的 prop 参数
	 * @property {string} [width] 宽度，css属性，支持像素，百分比和表达式，也可以在MyForm中统一设置itemWidth
	 * @property {object} [props] 输入组件参数对象，即 element 组件的参数
	 * @property {Array} [options] 选项数据，数据优先顺序，options > loader > form.dictMap > form.loader
	 * @property {Object} [keyMap] 选项数据对象属性名称映射, 默认：{id, parentId, label, value}
	 * @property {boolean} [collapsible] 可收起
	 * @property {boolean} [stopEnterEvent] 阻止回车事件冒泡
	 * @property {string} [depend] 依赖字段名称
	 * @property {*} [dependValue] 依赖字段的值，即依赖字段的值等于该值才会显示
	 * @property {string} [cascade] 级联的上级字段名称，需要与loader配合加载数据
	 * @property {Function} [loader] 加载数据函数,必须返回Promise
	 * @property {string} [dict] 字典名称，只是标识，需要与loader配合 或 表单的dictMap加载数据
	 * @property {boolean} [disabled] 禁用
	 * @property {boolean} [readonly] 只读
	 * @property {string} [placeholder] 占位文本
	 *
	 */
	props: {
		// 表单域 model 字段名称
		name: String,
		// 宽度，支持像素，百分比和表达式
		width: String,
		// 输入组件参数对象
		props: Object,
		// 选项数据，数据优先顺序，options > loader > form.dictMap > form.loader
		options: Array,
		// 选项数据对象属性名称映射
		keyMap: {
			type: Object,
			default() {
				return {
					id: "id",
					label: "label",
					value: "value",
					disabled: "disabled",
					parentId: "parentId"
				};
			}
		},
		// 可折叠
		collapsible: Boolean,

		// 阻止回车事件冒泡
		stopEnterEvent: Boolean,

		// 依赖字段名称
		depend: String,

		// 依赖字段的值，即依赖字段的值等于该值才会显示
		dependValue: [String, Number, Boolean, Object, Array, Function],

		// 级联的上级字段名称，需要与loader配合加载数据
		cascade: String,

		// 加载数据函数,必须返回Promise
		loader: Function,

		// 字典名称，只是标识，需要与loader配合 或 表单的dictMap加载数据
		dict: String,

		// 禁用
		disabled: Boolean,
		// 只读
		readonly: Boolean,

		// 占位文本
		placeholder: String,

		// 尺寸
		size: String
	},
	data() {
		return {
			// 级联的值缓存
			cascadeValue: null,
			// 当前选项数据
			currentOptions: [],

			// 正在调用loader
			loading: false
		};
	},
	computed: {
		// 如果有name参数，并且是MyForm的子组件，即与MyForm的currentModel作双向绑定
		// 否则与组件自身的value作双向绑定
		fieldValue: {
			get() {
				if (this.name && this.myForm) {
					const { currentModel } = this.myForm;
					return _get(currentModel, this.name, this.getDefaultValue());
				} else {
					return this.value || this.getDefaultValue();
				}
			},
			set(val) {
				if (this.name && this.myForm) {
					const { currentModel } = this.myForm;
					const model = cloneDeep(currentModel);
					_set(model, this.name, val);
					if (!isEqual(currentModel, model)) {
						this.myForm.currentModel[this.name] = model[this.name];
						this.myForm.currentModel = model;
					}
				} else {
					this.$emit("input", val);
				}
			}
		},
		// 字段域的宽度
		itemWidth() {
			// 优先取自身设置的宽度，没有就取父组件设置的公共设置宽度
			return (
				this.width || (this.myForm && this.myForm.itemWidth ? this.myForm.itemWidth : null)
			);
		},
		// 字段域样式
		itemStyle() {
			return {
				width: this.itemWidth
			};
		},
		// 输入框组件参数
		innerProps() {
			return {
				disabled: this.disabled,
				readonly: this.readonly,
				placeholder: this.placeholder,
				size: this.size,
				...this.props
			};
		}
	},
	watch: {
		itemWidth: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					this.setContentWidth();
				});
			}
		},
		"myForm.currentCollapsed"(val) {
			const { resetCollapsed, model } = this.myForm;
			// 收起时重置表单项值
			if (val && resetCollapsed && model && this.collapsible) {
				this.$nextTick(() => {
					// this.fieldValue = this.myForm.model[this.name]
					this.fieldValue = _get(this.myForm.model, this.name, this.getDefaultValue());
				});
			}
			// 开启了折叠功能
			if (this.collapsible) {
				// 折叠时先要清除事件句柄，因为原先的dom即将发生改变
				if (val) {
					removeResizeListener(this.$el, this.setContentWidth);
				} else {
					// 如果没有加载过选项数据，触发加载函数
					if (!this.currentOptions || this.currentOptions.length === 0) {
						this.loadOptions(this.myForm.currentModel, this);
					}
					// 展开时，待DOM生成后，重新注册事件句柄
					this.$nextTick(() => {
						addResizeListener(this.$el, this.setContentWidth);
						this.setContentWidth();
					});
				}
			}
		},
		// options 为了提高性能，不设置deep
		options: {
			immediate: true,
			handler(val) {
				this.currentOptions = cloneDeep(val) || [];
				// options改变后，会触发表单验证，这里需要清楚验证错误信息
				this.$nextTick(() => {
					this.clearValidate();
				});
			}
		}
	},
	methods: {
		// 获取表单项的默认值，不同组件有不同的默认值，可在具体的组件重写这个函数
		getDefaultValue() {
			return "";
		},
		// 重置字段
		resetField() {
			this.$refs.elItem && this.$refs.elItem.resetField();
		},
		// 清除验证错误信息
		clearValidate() {
			this.$refs.elItem && this.$refs.elItem.clearValidate();
		},
		isCollapsed() {
			if (!this.myForm) return false;

			const { collapsible, currentCollapsed } = this.myForm;
			// 是否已收起
			return collapsible && currentCollapsed && this.collapsible;
		},
		isMatchDepend() {
			// 没有设置依赖，即忽略，当已匹配处理
			if (!this.depend || !this.myForm) return true;
			const model = this.myForm.currentModel;
			// 依赖不支持 按路径查找
			const value = model[this.depend];
			let isMatch = true;
			// 如果 dependValue 是函数，执行回调函数返回布尔值
			if (typeof this.dependValue === "function") {
				isMatch = this.dependValue(value, model, this);
			} else {
				// 以上都不符合，即检验 dependValue 与 currentModel中的依赖属性是否一致
				isMatch = isEqual(this.dependValue, value);
			}

			// 清除依赖不符合字段的值
			if (!isMatch && this.name && model[this.name]) {
				this.fieldValue = this.getDefaultValue();
				delete model[this.name];
			}
			return isMatch;
		},
		// 传递给输入组件的插槽
		createSlots(slots = []) {
			return slots.map(name => {
				return <template slot={name}>{this.$slots[name]}</template>;
			});
		},
		// 渲染输入组件
		renderComponent(vnode) {
			// 如果组件不是MyForm的子组件，不需要包裹Item组件
			if (!this.myForm) {
				return vnode;
			}
			// el-form-item 作用域插槽
			const scopedSlots = this.$scopedSlots.error
				? {
						error: props => (
							<div class="el-form-item__error my-from__custom-error">
								{this.$scopedSlots.error(props)}
							</div>
						)
				  }
				: null;

			// 是否已收起
			const collapsed = this.isCollapsed();
			// 是否符合依赖项
			const isMatched = this.isMatchDepend();

			return (
				<transition name={this.myForm.collapseEffect}>
					{!collapsed && isMatched ? (
						<FormItem
							ref="elItem"
							class="my-form-item"
							{...{
								props: this.$attrs,
								scopedSlots: scopedSlots,
								style: this.itemStyle
							}}
							// 停止回车键事件冒泡
							nativeOnKeyup={this.stopEvent}
							// el-form-item 的prop用name代替
							prop={this.name}>
							{// label 插槽
							this.$slots.label ? (
								<template slot="label">{this.$slots.label}</template>
							) : null}
							{this.$slots.before}
							{vnode}
							{this.$slots.after}
						</FormItem>
					) : (
						// Vue组件必须要有一个根DOM，创建一个隐藏占位元素
						<div style={{ display: "none" }}>{this.name}</div>
					)}
				</transition>
			);
		},
		// 继承输入组件暴露的方法
		extendMethods(ref, names = []) {
			if (!ref) return;

			names.forEach(name => {
				// 子组件的方法加到实例
				this[name] = (...args) => {
					ref[name].apply(ref, args);
				};
			});
		},
		// 设置el-form-item内部的内容区宽度
		setContentWidth() {
			// 字段域没有设置宽度，默认自适应，不需要处理
			if (!this.itemWidth || !this.$el) return;
			const content = this.$el.querySelector(".el-form-item__content");
			const label = this.$el.querySelector(".el-form-item__label");
			if (content) {
				const rect = label ? label.getBoundingClientRect() : { width: 0 };
				const itemWidth = this.$el.getBoundingClientRect().width;
				const contentWidth = itemWidth - rect.width;
				setStyle(content, { width: `${contentWidth}px` });
			}
		},
		// 阻止回车事件冒泡
		stopEvent(e) {
			if (this.stopEnterEvent) {
				e.stopPropagation();
			}
		},
		// 加载选项数据
		loadOptions(model) {
			// 已收起的，不需要处理
			if (this.isCollapsed()) return;

			// 如果不符合依赖，不处理
			if (!this.isMatchDepend()) return;

			// 数据优先顺序，options > loader > form.dictMap > form.loader
			if (this.options) {
				this.currentOptions = cloneDeep(this.options);
				return;
			}

			if (this.loader) {
				this.loading = true;
				this.loader(model, this)
					.then(res => {
						this.currentOptions = cloneDeep(res);
					})
					.finally(() => {
						this.loading = false;
					});
				return;
			}

			// 无form容器，终止
			if (!this.myForm) return;

			if (this.dict) {
				const { dictMap } = this.myForm;
				const options = (dictMap || {})[this.dict];
				// 建立与表单的字典数据引用
				if (options) {
					this.currentOptions = options;
					return;
				}
			}

			if (this.myForm.loader) {
				this.loading = true;
				this.myForm
					.loader(model, this)
					.then(res => {
						this.currentOptions = cloneDeep(res);
					})
					.finally(() => {
						this.loading = false;
					});
			}
		},
		// 响应currentModel改变处理级联加载数据
		handleWatch(model) {
			// 级联上级的值
			const val = model[this.cascade];
			// 与上次的值不一致即重新获取数据
			if (!isEqual(this.cascadeValue, val)) {
				this.fieldValue = this.getDefaultValue();
				this.cascadeValue = val;
				this.loadOptions(model);
			}
		},
		// 绑定级联
		bindCascade() {
			if (this.cascade && this.myForm) {
				const model = this.myForm.currentModel;
				this.cascadeValue = model[this.cascade];
				this.unwatch = this.$watch("myForm.currentModel", this.handleWatch, { deep: true });
			}
		},
		// 销毁级联事件句柄
		unbindCascade() {
			this.unwatch && this.unwatch();
		}
	},
	mounted() {
		addResizeListener(this.$el, this.setContentWidth);
	},
	created() {
		let model = null;
		if (this.myForm) {
			this.myForm.addItem(this);
			model = this.myForm.currentModel;
		}

		this.loadOptions(model, this);
		this.bindCascade();
	},
	beforeDestroy() {
		removeResizeListener(this.$el, this.setContentWidth);
		this.unbindCascade();
		if (this.myForm) {
			this.myForm.removeItem(this);
		}
	}
};
