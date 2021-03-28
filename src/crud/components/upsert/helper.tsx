export function useFormApi({ refs }: any) {
	const apis: any = {};

	[
		"showLoading",
		"hiddenLoading",
		"collapseItem",
		"getForm",
		"setForm",
		"setData",
		"setOptions",
		"toggleItem",
		"hiddenItem",
		"showItem",
		"resetFields",
		"clearValidate",
		"validateField",
		"validate"
	].forEach(e => {
		apis[e] = (...args: any[]) => {
			return refs.value.form[e](...args);
		};
	});

	return apis;
}
