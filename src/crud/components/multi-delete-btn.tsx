import { defineComponent, inject } from "vue";
import { Crud } from "@/crud/types";

export default defineComponent({
	name: "cl-multi-delete-btn",

	setup(_, { slots }) {
		const crud = inject("crud") as Crud;

		return () => {
			return (
				crud.getPermission("delete") && (
					<el-button
						size="mini"
						type="danger"
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
