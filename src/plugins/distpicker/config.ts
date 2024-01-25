import { ModuleConfig } from "/@/cool";
import { registerFormHook } from "@cool-vue/crud";

// 注册hook
registerFormHook("pca", (value, { method, form, prop }) => {
	if (method == "bind") {
		return [form.province, form.city, form.district];
	} else {
		const [province, city, district] = value || [];
		form.province = province;
		form.city = city;
		form.district = district;
		form[prop] = undefined;
	}
});

export default (): ModuleConfig => {
	return {
		components: [
			// 省市区选择 https://github.com/modood/Administrative-divisions-of-China
			() => import("./components/index")
		]
	};
};
