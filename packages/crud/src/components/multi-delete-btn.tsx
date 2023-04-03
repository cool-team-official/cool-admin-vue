import { defineComponent } from "vue";
import { useCore, useTools } from "../hooks";

export default defineComponent({
	name: "cl-multi-delete-btn",

	setup(_, { slots }) {
		const { crud } = useCore();
		const { style } = useTools();

		return () => {
			return (
				crud.getPermission("delete") && (
					<el-button
						type="danger"
						size={style.size}
						disabled={crud.selection.length === 0}
						onClick={() => {
							crud.rowDelete(...crud.selection);
						}}>
						{slots.default ? slots.default() : crud.dict.label.multiDelete}
					</el-button>
				)
			);
		};
	}
});
