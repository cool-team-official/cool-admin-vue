import { dataset } from "../../../utils";

export function useAction({
	config,
	form,
	Form
}: {
	config: ClForm.Config;
	form: obj;
	Form: Vue.Ref<any>;
}) {
	// 设置数据
	function set(
		{
			prop,
			key,
			path
		}: { prop?: string; key?: "options" | "props" | "hidden" | "hidden-toggle"; path?: string },
		data?: any
	) {
		const p: string = path || "";

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
				console.error(`[set] ${prop} is not found`);
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
