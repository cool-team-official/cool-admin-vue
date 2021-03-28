import { Crud } from "@/crud/types";
import { defineComponent, inject } from "vue";

export default defineComponent({
	name: "cl-refresh-btn",

	setup(props: any, { slots }: any) {
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
