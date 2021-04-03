import { defineComponent, inject } from "vue";
import { Crud } from "../types";

export default defineComponent({
	name: "cl-refresh-btn",

	setup(props, { slots }) {
		const crud = inject("crud") as Crud;

		return () => {
			return (
				<el-button
					size="mini"
					onClick={() => {
						crud.refresh();
					}}
					{...props}>
					{slots.default ? slots.default() : crud.dict.label.refresh}
				</el-button>
			);
		};
	}
});
