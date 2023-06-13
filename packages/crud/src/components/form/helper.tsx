import { getCurrentInstance, Ref, ref, watch, WatchStopHandle } from "vue";
import { useElApi } from "../../hooks";
import { dataset } from "../../utils";

declare type Config = ClForm.Config;
declare type Form = Vue.Ref<any>;

// 操作
export function useAction({ config, form, Form }: { config: Config; form: obj; Form: Form }) {
	// 设置数据
	function set(
		{
			prop,
			key,
			path
		}: { prop?: string; key?: "options" | "props" | "hidden" | "hidden-toggle"; path?: string },
		data?: any
	) {
		let p: string = path || "";

		if (path) {
			dataset(config, p, data);
		} else {
			let d: any;

			if (prop) {
				function deep(arr: ClForm.Item[]) {
					arr.forEach((e) => {
						if (e.prop == prop) {
							d = e;
						} else {
							if (e.children) {
								deep(e.children);
							}
						}
					});
				}

				deep(config.items);
			}

			if (d) {
				switch (key) {
					case "options":
						d.component.options = data;
						break;

					case "props":
						Object.assign(d.component.props, data);
						break;

					case "hidden":
						d.hidden = data;
						break;

					case "hidden-toggle":
						d.hidden = data === undefined ? !d.hidden : !data;
						break;

					default:
						Object.assign(d, data);
						break;
				}
			} else {
				console.error(`prop "${prop}" not found`);
			}
		}
	}

	// 获取表单值
	function getForm(prop: string) {
		return prop ? form[prop] : form;
	}

	// 设置表单值
	function setForm(prop: string, value: any) {
		form[prop] = value;
	}

	// 设置配置
	function setConfig(path: string, value: any) {
		set({ path }, value);
	}

	// 设置数据
	function setData(prop: string, value: any) {
		set({ prop }, value);
	}

	// 设置表单项的下拉数据列表
	function setOptions(prop: string, value: any[]) {
		set({ prop, key: "options" }, value);
	}

	// 设置表单项的组件参数
	function setProps(prop: string, value: any) {
		set({ prop, key: "props" }, value);
	}

	// 切换表单项的显示、隐藏
	function toggleItem(prop: string, value?: boolean) {
		set({ prop, key: "hidden-toggle" }, value);
	}

	// 对部分表单项隐藏
	function hideItem(...props: string[]) {
		props.forEach((prop) => {
			set({ prop, key: "hidden" }, true);
		});
	}

	// 对部分表单项显示
	function showItem(...props: string[]) {
		props.forEach((prop) => {
			set({ prop, key: "hidden" }, false);
		});
	}

	// 设置标题
	function setTitle(value: string) {
		config.title = value;
	}

	// 是否展开表单项
	function collapseItem(e: any) {
		Form.value?.clearValidate(e.prop);
		e.collapse = !e.collapse;
	}

	return {
		getForm,
		setForm,
		setData,
		setConfig,
		setOptions,
		setProps,
		toggleItem,
		hideItem,
		showItem,
		setTitle,
		collapseItem
	};
}

// 选项卡
export function useTabs({ config, Form }: { config: Config; Form: Form }) {
	// 选中
	const active = ref<any>();

	// 获取参数
	function get() {
		return config.items.find((e) => e.type === "tabs");
	}

	function set(data: any) {
		active.value = data;
	}

	function clear() {
		active.value = null;
	}

	// 切换
	function change(value: any, isValid = true) {
		return new Promise((resolve: Function, reject: Function) => {
			function next() {
				active.value = value;
				resolve();
			}

			if (isValid) {
				let isError = false;

				const arr = config.items
					.filter((e: any) => e.group == active.value && !e._hidden && e.prop)
					.map((e: any) => {
						return new Promise((r: Function) => {
							// 验证表单
							Form.value.validateField(e.prop, (valid: string) => {
								if (valid) {
									isError = true;
								}

								r(valid);
							});
						});
					});

				Promise.all(arr).then((msg) => {
					if (isError) {
						reject(msg.filter(Boolean));
					} else {
						next();
					}
				});
			} else {
				next();
			}
		});
	}

	// 合并
	function mergeProp(item: ClForm.Item) {
		const d = get();

		if (d && d.props) {
			const { mergeProp, labels = [] } = d.props;

			if (mergeProp) {
				const t = labels.find((e) => e.value == item.group);

				if (t && t.name) {
					item.prop = `${t.name}-${item.prop}`;
				}
			}
		}
	}

	return {
		active,
		get,
		set,
		change,
		clear,
		mergeProp
	};
}

// 方法
export function useApi({ Form }: { Form: Form }) {
	return useElApi(
		[
			"open",
			"close",
			"clear",
			"reset",
			"submit",
			"bindForm",
			"changeTab",
			"setTitle",
			"showLoading",
			"hideLoading",
			"collapseItem",
			"getForm",
			"setForm",
			"setData",
			"setConfig",
			"setOptions",
			"setProps",
			"toggleItem",
			"hideItem",
			"showItem",
			"validate",
			"validateField",
			"resetFields",
			"scrollToField",
			"clearValidate"
		],
		Form
	);
}

// 插件
export function usePlugins({ visible }: { visible: Ref<boolean> }) {
	const that: any = getCurrentInstance();

	interface Event {
		onOpen: (() => void)[];
		onClose: (() => void)[];
		onSubmit: ((data: obj) => obj)[];
		[key: string]: any;
	}

	// 事件
	const ev: Event = {
		onOpen: [],
		onClose: [],
		onSubmit: []
	};

	// 监听器
	let timer: WatchStopHandle | null = null;

	// 插件创建
	function create(plugins?: ClForm.Plugin[]) {
		for (const i in ev) {
			ev[i] = [];
		}

		if (timer) {
			timer();
		}

		if (plugins) {
			plugins.forEach((p) => {
				p({
					exposed: that.exposed,
					onOpen(cb: any) {
						ev.onOpen.push(cb);
					},
					onClose(cb: any) {
						ev.onClose.push(cb);
					},
					onSubmit(cb: any) {
						ev.onSubmit.push(cb);
					}
				});
			});

			timer = watch(
				visible,
				(val) => {
					if (val) {
						setTimeout(() => {
							ev.onOpen.forEach((e) => e());
						}, 10);
					} else {
						ev.onClose.forEach((e) => e());
					}
				},
				{
					immediate: true
				}
			);
		}
	}

	// 表单提交
	async function submit(data: any) {
		let d = data;

		for (let i = 0; i < ev.onSubmit.length; i++) {
			const d2 = await ev.onSubmit[i](d);

			if (d2) {
				d = d2;
			}
		}

		return d;
	}

	return {
		create,
		submit
	};
}
