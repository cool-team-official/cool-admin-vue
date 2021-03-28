import { defineComponent } from "vue";

export default defineComponent({
	name: "cl-flex1",

	setup(_, { slots }) {
		return () => {
			return <div class="cl-flex1">{slots.default ? slots.default() : null}</div>;
		};
	}
});
