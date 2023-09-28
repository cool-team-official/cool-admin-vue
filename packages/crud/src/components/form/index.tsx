import { defineComponent, h, nextTick } from "vue";
import { cloneDeep, isBoolean, isEmpty, merge } from "lodash-es";
import { useAction, useForm, usePlugins, useTabs } from "./helper";
import { useBrowser, useConfig, useElApi } from "../../hooks";
import { getValue } from "../../utils";
import formHook from "../../utils/form-hook";
import { renderNode } from "../../utils/vnode";
import { parseFormHidden } from "../../utils/parse";

export default defineComponent({
	name: "cl-form",

	props: {
		inner: Boolean,
		inline: Boolean
	},

	setup(props, { expose, slots }) {
		const { style, dict } = useConfig();
		const browser = useBrowser();
		const { Form, config, form, visible, saving, loading, disabled } = useForm();

		// 关闭的操作类型
		let closeAction: ClForm.CloseAction = "close";

		// 旧表单数据
		let defForm: obj | undefined;

		// 选项卡
		const Tabs = useTabs({ config, Form });

		// 操作
		const Action = useAction({ config, form, Form });

		// 方法
		const ElFormApi = useElApi(
			["validate", "validateField", "resetFields", "scrollToField", "clearValidate"],
			Form
		);

		// 插件
		const plugin = usePlugins({ visible });

		// 显示加载中
		function showLoading() {
			loading.value = true;
		}

		// 隐藏加载
		function hideLoading() {
			loading.value = false;
		}

		// 设置是否禁用
		function setDisabled(val: boolean = true) {
			disabled.value = val;
		}

		// 请求表单保存状态
		function done() {
			saving.value = false;
		}

		// 关闭表单
		function close(action?: ClForm.CloseAction) {
			if (action) {
				closeAction = action;
			}

			beforeClose(() => {
				visible.value = false;
				done();
			});
		}

		// 关闭前
		function beforeClose(done: fn) {
			if (config.on?.close) {
				config.on.close(closeAction, done);
			} else {
				done();
			}
		}

		// 关闭后
		function onClosed() {
			Tabs.clear();
			Form.value?.clearValidate();
		}

		// 清空表单验证
		function clear() {
			for (const i in form) {
				delete form[i];
			}

			setTimeout(() => {
				Form.value?.clearValidate();
			}, 0);
		}

		// 重置
		function reset() {
			if (defForm) {
				for (const i in defForm) {
					form[i] = cloneDeep(defForm[i]);
				}
			}
		}

		// 表单提交
		function submit(callback?: fn) {
			// 验证表单
			Form.value.validate(async (valid: boolean, error: any) => {
				if (valid) {
					saving.value = true;

					// 拷贝表单值
					const d = cloneDeep(form);

					// 过滤隐藏的表单项
					config.items.forEach((e) => {
						if (e._hidden) {
							if (e.prop) {
								delete d[e.prop];
							}
						}

						if (e.hook) {
							formHook.submit({
								...e,
								value: e.prop ? d[e.prop] : undefined,
								form: d
							});
						}
					});

					// 处理 "-" 多层级
					for (const i in d) {
						if (i.includes("-")) {
							// 结构参数
							const [a, ...arr] = i.split("-");

							// 关键值的key
							const k: string = arr.pop() || "";

							if (!d[a]) {
								d[a] = {};
							}

							let f: any = d[a];

							// 设置默认值
							arr.forEach((e: any) => {
								if (!f[e]) {
									f[e] = {};
								}

								f = f[e];
							});

							// 设置关键值
							f[k] = d[i];

							delete d[i];
						}
					}

					const submit = callback || config.on?.submit;

					// 提交事件
					if (submit) {
						submit(await plugin.submit(d), {
							close() {
								close("save");
							},
							done
						});
					} else {
						done();
					}
				} else {
					// 判断是否使用form-tabs，切换到对应的选项卡
					const keys = Object.keys(error);

					if (Tabs.active.value) {
						const item = config.items.find((e) => e.prop === keys[0]);

						if (item) {
							Tabs.set(item.group);
						}
					}
				}
			});
		}

		// 打开表单
		function open(options?: ClForm.Options, plugins?: ClForm.Plugin[]) {
			if (!options) {
				return console.error("Options is not null");
			}

			// 清空
			if (options.isReset !== false) {
				clear();
			}

			// 显示对话框
			visible.value = true;

			// 默认关闭方式
			closeAction = "close";

			// 合并配置
			for (const i in config) {
				switch (i) {
					// 表单项
					case "items":
						function deep(arr: any[]): any[] {
							return arr.map((e) => {
								const d = getValue(e);

								return {
									...d,
									children: d?.children ? deep(d.children) : undefined
								};
							});
						}

						config.items = deep(options.items || []);
						break;
					// 事件、参数、操作
					case "on":
					case "op":
					case "props":
					case "dialog":
					case "_data":
						merge(config[i], options[i] || {});
						break;
					// 其他
					default:
						config[i] = options[i];
						break;
				}
			}

			// 预设表单值
			if (options?.form) {
				for (const i in options.form) {
					form[i] = options.form[i];
				}
			}

			// 设置表单数据
			config.items.map((e) => {
				function deep(e: ClForm.Item) {
					if (e.prop) {
						// 解析 prop
						if (e.prop.includes(".")) {
							e.prop = e.prop.replace(/\./g, "-");
						}

						// prop 合并
						Tabs.mergeProp(e);

						// 绑定值
						formHook.bind({
							...e,
							value: form[e.prop] !== undefined ? form[e.prop] : cloneDeep(e.value),
							form
						});

						// 表单验证
						if (e.required) {
							e.rules = {
								required: true,
								message: `${e.label}${dict.label.nonEmpty}`
							};
						}

						// 子集
						if (e.children) {
							e.children.forEach(deep);
						}
					}

					// 设置 tabs 默认值
					if (e.type == "tabs") {
						Tabs.set(e.value);
					}
				}

				deep(e);
			});

			// 设置默认值
			if (!defForm) {
				defForm = cloneDeep(form);
			}

			// 创建插件
			plugin.create(plugins);

			// 打开回调
			nextTick(() => {
				setTimeout(() => {
					// 打开事件
					if (config.on?.open) {
						config.on.open(form);
					}
				}, 10);
			});
		}

		// 绑定表单数据
		function bindForm(data: any) {
			config.items.forEach((e) => {
				formHook.bind({
					...e,
					value: e.prop ? data[e.prop] : undefined,
					form: data
				});
			});

			Object.assign(form, data);
		}

		// 渲染表单项
		function renderFormItem(e: ClForm.Item) {
			const { isDisabled } = config._data;

			if (e.type == "tabs") {
				return <cl-form-tabs v-model={Tabs.active.value} {...e.props} />;
			}

			// 是否隐藏
			e._hidden = parseFormHidden(e.hidden, {
				scope: form
			});

			// 分组显示
			const inGroup =
				isEmpty(Tabs.active.value) || isEmpty(e.group)
					? true
					: e.group === Tabs.active.value;

			// 表单项
			const FormItem = e.component
				? h(
						<el-form-item
							class={{
								"no-label": !(e.renderLabel || e.label),
								"has-children": !!e.children
							}}
							label-width={props.inline ? "auto" : ""}
							label={e.label}
							prop={e.prop}
							rules={isDisabled ? null : e.rules}
							v-show={inGroup}
						/>,
						e.props,
						{
							label() {
								return e.renderLabel
									? renderNode(e.renderLabel, {
											scope: form,
											render: "slot",
											slots
									  })
									: e.label;
							},
							default() {
								return (
									<div>
										<div class="cl-form-item">
											{["prepend", "component", "append"]
												.filter((k) => e[k])
												.map((name) => {
													const children = e.children && (
														<div class="cl-form-item__children">
															<el-row gutter={10}>
																{e.children.map(renderFormItem)}
															</el-row>
														</div>
													);

													const Item = renderNode(e[name], {
														item: e,
														prop: e.prop,
														scope: form,
														slots,
														children,
														_data: {
															isDisabled
														}
													});

													return (
														<div
															v-show={!e.collapse}
															class={[
																`cl-form-item__${name}`,
																{
																	flex1: e.flex !== false
																}
															]}
															style={e[name].style}>
															{Item}
														</div>
													);
												})}
										</div>

										{isBoolean(e.collapse) && (
											<div
												class="cl-form-item__collapse"
												onClick={() => {
													Action.collapseItem(e);
												}}>
												<el-divider content-position="center">
													{e.collapse
														? dict.label.seeMore
														: dict.label.hideContent}
												</el-divider>
											</div>
										)}
									</div>
								);
							}
						}
				  )
				: null;

			// 隐藏
			if (e._hidden) {
				return null;
			}

			// 行内
			if (props.inline) {
				return FormItem;
			}

			return (
				<el-col key={e.prop} span={e.span || style.form.span} {...e.col}>
					{FormItem}
				</el-col>
			);
		}

		// 渲染表单
		function renderContainer() {
			// 表单项列表
			const children = config.items.map(renderFormItem);

			return (
				<div class="cl-form__container">
					{h(
						<el-form
							ref={Form}
							size={style.size}
							label-position={
								browser.isMini && !props.inline ? "top" : style.form.labelPostion
							}
							label-width={style.form.labelWidth}
							inline={props.inline}
							disabled={saving.value}
							scroll-to-error
							model={form}
							onSubmit={(e: Event) => {
								submit();
								e.preventDefault();
							}}
						/>,
						config.props,
						{
							default: () => {
								return (
									<div class="cl-form__items">
										{/* 前 */}
										{slots.prepend && slots.prepend({ scope: form })}

										{/* 项 */}
										{props.inline ? (
											children
										) : (
											<el-row gutter={10} v-loading={loading.value}>
												{children}
											</el-row>
										)}

										{/* 后 */}
										{slots.append && slots.append({ scope: form })}
									</div>
								);
							}
						}
					)}
				</div>
			);
		}

		// 渲染表单按钮
		function renderFooter() {
			const { hidden, buttons, saveButtonText, closeButtonText, justify } = config.op;

			if (hidden) {
				return null;
			}

			const Btns = buttons?.map((e: any) => {
				switch (e) {
					case "save":
						return (
							<el-button
								type="success"
								size={style.size}
								disabled={loading.value}
								loading={saving.value}
								onClick={() => {
									submit();
								}}>
								{saveButtonText}
							</el-button>
						);
					case "close":
						return (
							<el-button
								size={style.size}
								onClick={() => {
									close("close");
								}}>
								{closeButtonText}
							</el-button>
						);
					default:
						return renderNode(e, {
							scope: form,
							slots,
							custom({ scope }) {
								return (
									<el-button
										text
										type={e.type}
										bg
										onClick={() => {
											e.onClick({ scope });
										}}>
										{e.label}
									</el-button>
								);
							}
						});
				}
			});

			return (
				<div
					class="cl-form__footer"
					style={{
						justifyContent: justify || "flex-end"
					}}>
					{Btns}
				</div>
			);
		}

		expose({
			Form,
			visible,
			saving,
			form,
			config,
			loading,
			disabled,
			open,
			close,
			done,
			clear,
			reset,
			submit,
			bindForm,
			showLoading,
			hideLoading,
			setDisabled,
			Tabs,
			...Action,
			...ElFormApi
		});

		return () => {
			const Form = (
				<div class="cl-form">
					{renderContainer()}
					{renderFooter()}
				</div>
			);

			if (props.inner) {
				return visible.value && Form;
			} else {
				return h(
					<cl-dialog v-model={visible.value} class="cl-form" />,
					{
						title: config.title,
						height: config.height,
						width: config.width,
						...config.dialog,
						beforeClose,
						onClosed,
						keepAlive: false
					},
					{
						default() {
							return renderContainer();
						},
						footer() {
							return renderFooter();
						}
					}
				);
			}
		};
	}
});
