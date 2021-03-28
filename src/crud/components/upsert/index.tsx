import { ElMessage } from "element-plus";
import { defineComponent, h, inject, ref } from "vue";
import { Crud } from "@/crud/types";
import { useFormApi } from "./helper";
import { useForm, useRefs } from "../../hooks/core";

export default defineComponent({
	name: "cl-upsert",

	props: {
		// 绑定值
		modelValue: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 表单项
		items: {
			type: Array,
			default: () => []
		},
		// el-form 参数
		props: {
			type: Object,
			default: () => {
				return {};
			}
		},
		// 编辑时是否同步打开
		sync: Boolean,
		// 操作按钮参数 { hidden, saveButtonText, closeButtonText, buttons }
		op: Object,
		// cl-dialog 参数 { props, hiddenControls, controls }
		dialog: Object,
		// 打开表单钩子 { isEdit, data, { submit, done, close } }
		onOpen: Function,
		// 关闭表单钩子 { done }
		onClose: Function,
		// 获取表单数据钩子 { data, { next, done, close } }
		onInfo: Function,
		// 表单提交钩子 { isEdit, data, { next, done, close } }
		onSubmit: Function
	},

	emits: ["open", "close"],

	setup(props, { emit }) {
		const { refs, setRefs }: any = useRefs();
		const { setFormData } = useForm(props);

		// 参数注入
		const mitt = inject<any>("mitt");
		const crud = inject("crud") as Crud;

		// 表单数据
		const form: any = setFormData();
		// 是否编辑
		const isEdit = ref<boolean>(false);

		// 关闭表单
		function close() {
			refs.value.form.close();
			emit("close");
		}

		// 表单关闭前
		function beforeClose() {
			if (props.onClose) {
				props.onClose(close);
			} else {
				close();
			}
		}

		// 提交
		function submit(data: any, event?: any) {
			const next = (data: any) => {
				return new Promise((resolve, reject) => {
					// 获取请求方法
					const reqName: string = crud.dict.api[isEdit.value ? "update" : "add"];

					// 验证请求
					if (!crud.service[reqName]) {
						event.done();
						return reject(`Request function '${reqName}' is not fount!`);
					}

					// 发送请求
					crud.service[reqName](data)
						.then((res: any) => {
							ElMessage.success("保存成功");
							close();
							crud.refresh();
							resolve(res);
						})
						.catch((err: string) => {
							ElMessage.error(err);
							reject(err);
						})
						.done(() => {
							event.done();
						});
				});
			};

			// 提交钩子
			if (props.onSubmit) {
				props.onSubmit(isEdit.value, data, {
					done: event.done,
					next,
					close
				});
			} else {
				next(data);
			}
		}

		// 打开表单
		function open() {
			return new Promise(resolve => {
				if (!refs.value.form) {
					return false;
				}

				refs.value.form.open({
					title: isEdit.value ? "编辑" : "新增",
					props: props.props,
					items: props.items,
					op: props.op,
					dialog: props.dialog,
					on: {
						open: (_: any, { done, close }: any) => {
							if (props.onOpen) {
								props.onOpen(isEdit, form, {
									submit: () => {
										submit(form);
									},
									done,
									close
								});
							}

							resolve(true);
						},
						submit,
						close: beforeClose
					},
					_data: {
						isEdit: isEdit
					}
				});
			});
		}

		// 新增
		async function add() {
			isEdit.value = false;
			await open();
			emit("open", false, {});
		}

		// 追加
		async function append(data: any) {
			isEdit.value = false;
			await open();
			if (data) {
				Object.assign(form, data);
			}
			emit("open", false, form);
		}

		// 编辑
		function edit(data?: any) {
			if (!refs.value.form) {
				return false;
			}

			const { showLoading, hiddenLoading } = refs.value.form;

			// 设置为编辑
			isEdit.value = true;

			// 显示加载中
			showLoading();

			// 是否同步打开
			if (!props.sync) {
				open();
			}

			const done = (data?: any) => {
				// 加载完成
				hiddenLoading();

				// 合并数据
				if (data) {
					Object.assign(form, data);
				}
			};

			// 关闭表单
			const close = () => {
				hiddenLoading();
				close();
			};

			// Submit
			const next = (data: any) => {
				// 获取请求名称
				const reqName: any = crud.dict.api.info;

				return new Promise((resolve, reject) => {
					// 验证请求
					if (!crud.service[reqName]) {
						reject(`Request function '${reqName}' is not fount!`);
						done();
						return null;
					}

					// 发送请求
					crud.service[reqName]({
						id: data.id
					})
						.then((res: any) => {
							resolve(res);
							done(res);

							// 同步打开表单
							if (props.sync) {
								open();
							}

							emit("open", isEdit.value, form);
						})
						.catch((err: string) => {
							ElMessage.error(err);
							reject(err);
						})
						.done(() => {
							hiddenLoading();
						});
				});
			};

			// 获取详情钩子
			if (props.onInfo) {
				props.onInfo(data, {
					next,
					done: (data: any) => {
						done(data);
						emit("open", true, form);
					},
					close
				});
			} else {
				next(data);
			}
		}

		// 消息事件
		(function mittEvent() {
			mitt.on("crud.add", add);
			mitt.on("crud.append", append);
			mitt.on("crud.edit", edit);
			mitt.on("crud.close", close);
		})();

		return {
			refs,
			setRefs,
			form,
			isEdit,
			add,
			append,
			edit,
			close,
			...useFormApi({ refs })
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-upsert">
				{h(
					<cl-form ref={ctx.setRefs("form")} v-model={ctx.form}></cl-form>,
					{},
					ctx.$slots
				)}
			</div>
		);
	}
});
