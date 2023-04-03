import { defineComponent } from "vue";
import { useCore, useTools } from "../hooks";

export default defineComponent({
	name: "cl-refresh-btn",

	setup(_, { slots }) {
		const { crud } = useCore();
		const { style } = useTools();

		return () => {
			return (
				<el-button
					size={style.size}
					onClick={() => {
						crud.refresh();
					}}>
					{slots.default ? slots.default() : crud.dict.label.refresh}
				</el-button>
			);
		};
	}
});
