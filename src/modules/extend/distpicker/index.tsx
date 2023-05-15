import { defineComponent } from "vue";
import { registerFormHook } from "@cool-vue/crud";
import data from "./pca.json";

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

export default defineComponent({
	name: "cl-distpicker",

	props: {
		props: Object
	},

	setup(props) {
		return () => {
			return (
				<el-cascader
					options={data}
					props={{ label: "name", value: "name", ...props.props }}
				/>
			);
		};
	}
});
