import { defineComponent } from "vue";

export default defineComponent({
	name: "cl-filter",

	props: {
		label: String
	},

	setup(props, { slots }) {
		return () => {
			return (
				<div class="cl-filter">
					<span class="cl-filter__label" v-show={props.label}>
						{props.label}
					</span>

					{slots.default?.()}
				</div>
			);
		};
	}
});
