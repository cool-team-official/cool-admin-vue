import { defineComponent } from "vue";
import { useConfig, useCore } from "../../hooks";

export default defineComponent({
	name: "cl-refresh-btn",

	setup(_, { slots }) {
		const { crud } = useCore();
		const { style } = useConfig();

		return () => {
			return (
				<el-button
					size={style.size}
					onClick={() => {
						crud.refresh();
					}}>
					{slots.default?.() || crud.dict.label.refresh}
				</el-button>
			);
		};
	}
});
