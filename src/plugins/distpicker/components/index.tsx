import { defineComponent } from "vue";
import data from "../data/pca.json";

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
