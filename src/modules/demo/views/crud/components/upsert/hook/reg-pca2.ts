import { registerFormHook } from '@cool-vue/crud';

// 注册 hook
registerFormHook('pca2', (value, { method, form, prop }) => {
	if (method == 'bind') {
		return [form.province, form.city, form.district];
	} else {
		const [province, city, district] = value || [];
		form.province = province;
		form.city = city;
		form.district = district;
		form[prop] = undefined;
	}
});
