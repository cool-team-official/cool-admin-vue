import { defineComponent } from "vue";
import { useConfig, useCore } from "../../hooks";

export default defineComponent({
	name: "cl-multi-delete-btn",

	setup(_, { slots }) {
		const { crud } = useCore();
		const { style } = useConfig();

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
						{slots.default?.() || crud.dict.label.multiDelete}
					</el-button>
				)
			);
		};
	}
});
