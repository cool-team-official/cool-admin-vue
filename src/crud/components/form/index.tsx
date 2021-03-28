import { defineComponent, h, inject, nextTick, provide, reactive, ref, watch } from "vue";
import cloneDeep from "clone-deep";
import { useRefs, useForm } from "../../hooks/core";
import { deepMerge, isBoolean, isEmpty, isFunction, isObject, isString } from "../../utils";
import Parse from "../../utils/parse";
import { renderNode } from "../../utils/vnode";
import { useAction } from "./helper";
import { Browser } from "@/crud/types";

export default defineComponent({
	name: "cl-form",

	props: {
		modelValue: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const { refs, setRefs }: any = useRefs();

		// 设置表单值
		const { setFormData } = useForm(props);

		// 表单是否可见
		const visible = ref<boolean>(false);

		// 表单提交保存状态
		const saving = ref<boolean>(false);

		// 选项卡
		const tabActive = ref<any>(null);

		// 表单数据
		const form = setFormData();

		// 表单配置
		const conf = reactive<any>({
			title: "自定义表单",
			width: "50%",
			props: {
				size: "small",
				labelWidth: "100px"
			},
			on: {
				open: null,
				submit: null,
				close: null
			},
			op: {
				hidden: false,
				saveButtonText: "保存",
				closeButtonText: "取消",
				buttons: ["close", "save"]
			},
			dialog: {
				props: {
					fullscreen: false,
					"close-on-click-modal": false,
					"append-to-body": true
				},
				hiddenControls: false,
				controls: ["fullscreen", "close"]
			},
			items: [],
			_data: {}
		});

		// 表单动作
		const {
			loading,
			showLoading,
			hiddenLoading,
			collapseItem,
			getForm,
			setForm,
			setData,
			setOptions,
			toggleItem,
			hiddenItem,
			showItem,
			resetFields,
			clearValidate,
			validateField,
			validate
		} = useAction({ conf, form, refs });

		// 更新绑定值
		watch(form, (val: any) => {
			emit("update:modelValue", val);
		});

		// 提供
		provide("form", form);

		// 请求表单保存状态
		function done() {
			saving.value = false;
		}

		// 关闭表单
		function close() {
			visible.value = false;
			done();
		}

		// 表单关闭前事件
		function beforeClose() {
			if (conf.on.close) {
				conf.on.close(close);
			} else {
				close();
			}
		}

		// 清空表单验证
		function clear() {
			for (const i in form) {
				delete form[i];
			}

			clearValidate();
		}

		// 表单提交
		function submit() {
			// 验证表单
			refs.value.form.validate(async (valid: boolean) => {
				if (valid) {
					saving.value = true;

					// 表单提交钩子
					if (isFunction(conf.on.submit)) {
						const d = cloneDeep(form);

						// 过滤隐藏的表单项
						conf.items.forEach((e: any) => {
							if (e._hidden) {
								delete d[e.prop];
							}
						});

						conf.on.submit(d, {
							done,
							close
						});
					} else {
						console.error("Submit is not found");
					}
				}
			});
		}

		// 打开表单
		function open(options?: any) {
			if (!options) {
				options = {};
			}

			clear();

			// Merge conf
			for (const i in conf) {
				switch (i) {
					case "items":
						conf.items = options.items || [];
						break;
					case "title":
					case "width":
						conf[i] = options[i];
						break;
					case "props":
					case "on":
					case "dialog":
					case "_data":
						conf[i] = deepMerge(conf[i], options[i] || {});
						break;
				}
			}

			// 显示对话框
			visible.value = true;

			// 预设表单值
			if (options.form) {
				for (const i in options.form) {
					form[i] = options.form[i];
				}
			}

			// 设置表单数据
			conf.items.map((e: any) => {
				if (e.prop) {
					form[e.prop] = form[e.prop] || cloneDeep(e.value);
				}
			});

			// 打开回调
			if (conf.on.open) {
				nextTick(() => {
					conf.on.open(form, {
						close,
						submit,
						done
					});
				});
			}

			return {
				showLoading,
				hiddenLoading,
				collapseItem,
				getForm,
				setForm,
				setData,
				setOptions,
				toggleItem,
				hiddenItem,
				showItem,
				resetFields,
				clearValidate,
				validateField,
				validate
			};
		}

		return {
			visible,
			saving,
			tabActive,
			form,
			refs,
			setRefs,
			conf,
			loading,
			open,
			beforeClose,
			close,
			done,
			clear,
			submit,
			showLoading,
			hiddenLoading,
			collapseItem,
			getForm,
			setForm,
			setData,
			setOptions,
			toggleItem,
			hiddenItem,
			showItem,
			resetFields,
			clearValidate,
			validateField,
			validate
		};
	},

	render(ctx: any) {
		const browser = inject("browser") as Browser;
		const { props, op, title, width, dialog, _data } = ctx.conf;

		// 渲染表单及表单项
		const renderForm = () => {
			// 表单项列表
			const children = ctx.conf.items.map((e: any) => {
				if (e.type == "tabs") {
					return (
						<cl-form-tabs
							v-model={ctx.tabActive}
							{...e.props}
							onChange={() => {
								ctx.clearValidate();
							}}></cl-form-tabs>
					);
				}

				// 隐藏处理
				e._hidden = Parse("hidden", {
					value: e.hidden,
					scope: ctx.form,
					data: _data
				});

				// 分组
				e._group =
					isEmpty(ctx.tabActive) || isEmpty(e.group) ? true : e.group === ctx.tabActive;

				// Flex handler
				if (isEmpty(e.flex)) {
					e._flex = true;
				}

				return (
					e._group &&
					!e._hidden && (
						<el-col span={24} {...e}>
							{e.component &&
								h(
									<el-form-item></el-form-item>,
									{
										prop: e.prop,
										rules: e.rules,
										...e.props
									},
									{
										label: () => {
											let d: any = {
												text: "",
												tip: "",
												icon: ""
											};

											if (isString(e.label)) {
												d.text = e.label;
											} else if (isObject(e.label)) {
												d = e.label;
											}

											return (
												<el-tooltip
													effect="dark"
													placement="top"
													content={d.tip}
													disabled={!d.tip}>
													<span>
														{d.text}
														{d.icon && <i class={d.icon}></i>}
													</span>
												</el-tooltip>
											);
										},
										default: () => {
											return (
												<div>
													{/* Form item */}
													<div class="cl-form-item">
														{["prepend", "component", "append"].map(
															name => {
																return (
																	e[name] && (
																		<div
																			v-show={!e.collapse}
																			class={[
																				`cl-form-item__${name}`,
																				{
																					"is-flex":
																						e._flex
																				}
																			]}>
																			{renderNode(e[name], {
																				prop: e.prop,
																				scope: ctx.form,
																				slots: ctx.$slots
																			})}
																		</div>
																	)
																);
															}
														)}
													</div>
													{/* Collapse button */}
													{isBoolean(e.collapse) && (
														<div
															class="cl-form-item__collapse"
															onClick={() => {
																ctx.collapseItem(e);
															}}>
															<el-divider content-position="center">
																{e.collapse ? (
																	<span>
																		查看更多
																		<i class="el-icon-arrow-down"></i>
																	</span>
																) : (
																	<span>
																		隐藏内容
																		<i class="el-icon-arrow-up"></i>
																	</span>
																)}
															</el-divider>
														</div>
													)}
												</div>
											);
										}
									}
								)}
						</el-col>
					)
				);
			});

			// el-form
			const ElForm = (
				<el-form
					ref={ctx.setRefs("form")}
					label-position={browser.isMini ? "top" : ""}
					size="small"
					label-width="100px"
					disabled={ctx.saving}
					model={ctx.form}></el-form>
			);

			return h(ElForm, props, {
				default: () => {
					return (
						<el-row gutter={10} v-loading={ctx.loading}>
							{children}
						</el-row>
					);
				}
			});
		};

		// 渲染表单按钮
		function renderFooter() {
			const { hidden, buttons, saveButtonText, closeButtonText } = op;
			const { size = "small" } = props;

			return hidden
				? null
				: buttons.map((vnode: any) => {
						if (vnode == "save") {
							return (
								<el-button
									{...{
										size,
										type: "success",
										disabled: ctx.loading,
										loading: ctx.saving,
										onClick: () => {
											ctx.submit();
										}
									}}>
									{saveButtonText}
								</el-button>
							);
						} else if (vnode == "close") {
							return (
								<el-button
									{...{
										size,
										onClick: () => {
											ctx.beforeClose();
										}
									}}>
									{closeButtonText}
								</el-button>
							);
						} else {
							return renderNode(vnode, {
								scope: ctx.form,
								slots: ctx.$slots
							});
						}
				  });
		}

		return h(
			<cl-dialog v-model={ctx.visible}></cl-dialog>,
			{
				title,
				width,
				...dialog,
				props: {
					...dialog.props,
					"before-close": ctx.beforeClose
				}
			},
			{
				default() {
					return (
						<div class="cl-form">
							<div class="cl-form__container">{renderForm()}</div>
							<div class="cl-form__footer">{renderFooter()}</div>
						</div>
					);
				}
			}
		);
	}
});
