import { dataset } from "../../utils";
import { ref } from "vue";

export function useAction({ conf, form, refs }: any) {
	// 加载状态
	const loading = ref<boolean>(false);

	// 设置数据
	function set({ prop, options, hidden, path }: any, data?: any): any {
		let p: string = path || "";

		if (prop) {
			p = `items[prop:${prop}]`;
		}

		if (options) {
			p += `.component.options`;
		}

		if (hidden) {
			p += ".hidden";
		}

		return dataset(conf, p, data);
	}

	// 获取表单值
	function getForm(prop: string) {
		return prop ? form[prop] : form;
	}

	// 设置表单值
	function setForm(prop: string, value: any) {
		form[prop] = value;
	}

	// 设置路径数据
	function setData(path: string, value: any) {
		set({ path }, value);
	}

	// 设置表单项的下拉数据列表
	function setOptions(prop: string, value: Array<any>) {
		set({ options: true, prop }, value);
	}

	// 切换表单项的显示、隐藏
	function toggleItem(prop: string, value?: boolean) {
		if (value === undefined) {
			value = set({ prop, hidden: true });
		}

		set({ hidden: true, prop }, !value);
	}

	// 对部分表单项隐藏
	function hiddenItem(...props: Array<string>) {
		props.forEach((prop: string) => {
			set({ hidden: true, prop }, true);
		});
	}

	// 对部分表单项显示
	function showItem(...props: Array<string>) {
		props.forEach((prop: string) => {
			set({ hidden: true, prop }, false);
		});
	}

	// 显示表单加载状态
	function showLoading() {
		loading.value = true;
	}

	// 隐藏表单加载状态
	function hiddenLoading() {
		loading.value = false;
	}

	// 对整个表单进行重置
	function resetFields() {
		if (refs.value.form) {
			refs.value.form.resetFields();
		}
	}

	// 移除表单项的校验结果
	function clearValidate(props?: string | Array<any>) {
		if (refs.value.form) {
			return refs.value.form.clearValidate(props);
		}
	}

	// 对部分表单字段进行校验
	function validateField(props?: string | Array<any>, callback?: Function) {
		if (refs.value.form) {
			refs.value.form.validateField(props, callback);
		}
	}

	// 对整个表单进行校验
	function validate(callback?: Function) {
		if (refs.value.form) {
			refs.value.form.validate(callback);
		}
	}

	// 是否展开表单项
	function collapseItem(e: any) {
		clearValidate(e.prop);
		e.collapse = !e.collapse;
	}

	return {
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
	};
}
