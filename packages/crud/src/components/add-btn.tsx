import { defineComponent } from "vue";
import { useCore, useTools } from "../hooks";

export default defineComponent({
	name: "cl-add-btn",

	setup(_, { slots }) {
		const { crud } = useCore();
		const { style } = useTools();

		return () => {
			return (
				crud.getPermission("add") && (
					<el-button type="primary" size={style.size} onClick={crud.rowAdd}>
						{slots.default ? slots.default() : crud.dict.label.add}
					</el-button>
				)
			);
		};
	}
});
