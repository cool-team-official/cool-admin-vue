import { defineComponent } from "vue";

export default defineComponent({
	name: "cl-row",

	setup(_, { slots }) {
		return () => {
			return <el-row class="cl-row">{slots.default && slots.default()}</el-row>;
		};
	}
});
