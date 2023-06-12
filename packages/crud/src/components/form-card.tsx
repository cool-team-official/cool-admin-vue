import { defineComponent, ref } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-form-card",

	components: {
		ArrowDown,
		ArrowUp
	},

	props: {
		label: String,
		isExpand: {
			type: Boolean,
			default: true
		}
	},

	setup(props, { slots }) {
		const isExpand = ref(props.isExpand);

		async function toExpand() {
			isExpand.value = !isExpand.value;
		}

		return () => {
			return (
				<div class={["cl-form-card", { "is-expand": isExpand.value }]}>
					<div class="cl-form-card__header" v-show={props.label} onClick={toExpand}>
						<span>{props.label}</span>

						<el-icon>
							<arrow-down v-show={!isExpand.value} />
							<arrow-up v-show={isExpand.value} />
						</el-icon>
					</div>
					<div class="cl-form-card__container">{slots.default?.()}</div>
				</div>
			);
		};
	}
});
