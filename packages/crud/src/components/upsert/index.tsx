import { defineComponent, h, inject, reactive, ref, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useCore, useProxy } from "../../hooks";
import { useApi } from "../form/helper";
import { mergeConfig } from "../../utils";

export default defineComponent({
	name: "cl-upsert",

	props: {
		// 表单项
		items: {
			type: Array,
			default: () => []
		},
		// <el-form /> 参数
		props: Object,
		// 编辑时是否同步打开
		sync: Boolean,
		// 操作按钮参数
		op: Object,
		// <cl-dialog /> 参数
		dialog: Object,
		// 打开表单钩子
		onOpen: Function,
		// 打开表单后钩子
		onOpened: Function,
		// 关闭表单钩子
		onClose: Function,
		// 关闭表单后钩子
		onClosed: Function,
		// 获取表单数据钩子
		onInfo: Function,
		// 表单提交钩子
		onSubmit: Function
	},

	emits: ["opened", "closed"],

	setup(props, { slots, expose }) {
		const { crud } = useCore();

		const config = reactive<ClUpsert.Config>(
			mergeConfig(props, inject("useUpsert__options") || {})
		);

		// el-form
		const Form = ref<ClForm.Ref>();

		// 模式
		const mode = ref<ClUpsert.Ref["mode"]>("info");

		// 关闭表单
		function close(action?: ClForm.CloseAction) {
			Form.value?.close(action);
		}

		// 关闭后
		function onClosed() {
			Form.value?.hideLoading();

			if (config.onClosed) {
				config.onClosed();
			}
		}

		// 关闭前
		function beforeClose(action: ClForm.CloseAction, done: fn) {
			function next() {
				done();
				onClosed();
			}

			if (config.onClose) {
				config.onClose(action, next);
			} else {
				next();
			}
		}

		// 提交
		function submit(data: obj) {
			const { service, dict, refresh } = crud;

			function done() {
				Form.value?.done();
			}

			function next(data: obj) {
				return new Promise((resolve, reject) => {
					// 发送请求
					service[dict.api[mode.value]](data)
						.then((res) => {
							ElMessage.success(dict.label.saveSuccess);
							done();
							close("save");
							refresh();
							resolve(res);
						})
						.catch((err) => {
							ElMessage.error(err.message);
							done();
							reject(err);
						});
				});
			}

			// 提交钩子
			if (config.onSubmit) {
				config.onSubmit(data, {
					done,
					next,
					close() {
						close("save");
					}
				});
			} else {
				next(data);
			}
		}

		// 打开表单
		function open() {
			// 是否禁用
			const isDisabled = mode.value == "info";

			return new Promise((resolve) => {
				if (!Form.value) {
					return console.error("<cl-upsert /> is not found");
				}

				Form.value?.open(
					{
						title: crud.dict.label[mode.value],
						props: {
							...config.props,
							disabled: isDisabled
						},
						op: {
							...config.op,
							hidden: isDisabled
						},
						dialog: config.dialog,
						items: config.items || [],
						on: {
							open() {
								if (config.onOpen) {
									config.onOpen();
								}

								resolve(true);
							},
							submit,
							close: beforeClose
						},
						form: {},
						_data: {
							isDisabled
						}
					},
					config.plugins
				);
			});
		}

		// 打开后事件
		function onOpened() {
			const data = Form.value?.getForm();

			if (config.onOpened) {
				config.onOpened(data);
			}
		}

		// 新增
		async function add() {
			mode.value = "add";

			// 打开中
			await open();

			// 打开后
			onOpened();
		}

		// 追加
		async function append(data: any) {
			mode.value = "add";

			// 打开中
			await open();

			// 绑定值
			if (data) {
				Form.value?.bindForm(data);
			}

			// 打开后
			onOpened();
		}

		// 编辑
		function edit(data?: any) {
			mode.value = "update";
			getInfo(data);
		}

		// 详情
		function info(data?: any) {
			mode.value = "info";
			getInfo(data);
		}

		// 信息
		function getInfo(data: any) {
			// 显示加载中
			Form.value?.showLoading();

			// 是否同步打开
			if (!config.sync) {
				open();
			}

			// 完成
			async function done(data?: any) {
				// 加载完成
				Form.value?.hideLoading();

				// 合并数据
				if (data) {
					Form.value?.bindForm(data);
				}

				// 同步打开表单
				if (config.sync) {
					await open();
				}

				onOpened();
			}

			// 获取详情
			function next(data: any): Promise<any> {
				return new Promise(async (resolve, reject) => {
					// 发送请求
					await crud.service[crud.dict.api.info]({
						[crud.dict.primaryId]: data[crud.dict.primaryId]
					})
						.then((res) => {
							done(res);
							resolve(res);
						})
						.catch((err) => {
							ElMessage.error(err.message);
							reject(err);
						});

					// 隐藏加载框
					Form.value?.hideLoading();
				});
			}

			// 详情钩子
			if (config.onInfo) {
				config.onInfo(data, {
					close,
					next,
					done
				});
			} else {
				next(data);
			}
		}

		// 完成
		function done() {
			Form.value?.hideLoading();
		}

		const ctx = {
			config,
			...toRefs(config),
			...useApi({ Form }),
			Form,
			get form() {
				return Form.value?.form || {};
			},
			mode,
			add,
			append,
			edit,
			info,
			open,
			close,
			done,
			submit
		};

		useProxy(ctx);
		expose(ctx);

		return () => {
			return <div class="cl-upsert">{h(<cl-form ref={Form} />, {}, slots)}</div>;
		};
	}
});
