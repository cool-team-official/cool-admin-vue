import { defineComponent } from "vue";

export default defineComponent({
	name: "cl-filter",

	props: {
		label: String
	},

	render(ctx: any) {
		return (
			<div class="cl-filter">
				<span class="cl-filter__label" v-show={ctx.label}>
					{ctx.label}
				</span>

				{ctx.$slots.default ? ctx.$slots.default() : null}
			</div>
		);
	}
});
