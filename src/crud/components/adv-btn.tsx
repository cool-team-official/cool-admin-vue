import { defineComponent, inject } from "vue";
import { Crud } from "@/crud/types";

export default defineComponent({
	name: "cl-adv-btn",

	props: {
		props: Object
	},

	setup(props, { slots }) {
		const crud = inject("crud") as Crud;

		return () => {
			return (
				<div class="cl-adv-btn">
					<el-button
						size="mini"
						onClick={() => {
							crud.openAdvSearch();
						}}
						{...props}>
						<i class="el-icon-search" />
						{slots.default ? slots.default() : crud.dict.label.advSearch}
					</el-button>
				</div>
			);
		};
	}
});
