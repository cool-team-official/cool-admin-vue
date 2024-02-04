import { ModuleConfig } from "/@/cool";
import { registerFormHook } from "@cool-vue/crud";

// 注册hook
registerFormHook("pca", (value, { method, form, prop }) => {
	if (method == "bind") {
		return [form.province, form.city, form.district].filter(Boolean);
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
		label: "省市区选择器",
		description: "快速增删改查及一系列辅助组件",
		author: "COOL",
		version: "1.0.1",
		updateTime: "2024-02-04",
		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		components: [
			// 省市区选择 https://github.com/modood/Administrative-divisions-of-China
			() => import("./components/index")
		]
	};
};
