import { defineComponent, inject } from "vue";
import { Crud } from "@/crud/types";

export default defineComponent({
	name: "cl-add-btn",

	props: {
		props: Object
	},

	setup(props, { slots }) {
		const crud = inject("crud") as Crud;

		return () => {
			return (
				crud.getPermission("add") && (
					<el-button
						size="mini"
						type="primary"
						onClick={() => {
							crud.rowAdd();
						}}
						{...props}>
						{slots.default ? slots.default() : crud.dict.label.add}
					</el-button>
				)
			);
		};
	}
});
