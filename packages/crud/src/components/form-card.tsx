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
		// 展开状态
		expand: {
			type: Boolean,
			default: true
		},
		// 是否能展开、收起
		isExpand: {
			type: Boolean,
			default: true
		}
	},

	setup(props, { slots }) {
		const visible = ref(props.expand);

		function toExpand() {
			if (props.isExpand) {
				visible.value = !visible.value;
			}
		}

		return () => {
			return (
				<div class={["cl-form-card", { "is-expand": visible.value }]}>
					<div class="cl-form-card__header" v-show={props.label} onClick={toExpand}>
						<span>{props.label}</span>

						<el-icon v-show={props.isExpand}>
							<arrow-down v-show={!visible.value} />
							<arrow-up v-show={visible.value} />
						</el-icon>
					</div>
					<div class="cl-form-card__container">{slots.default?.()}</div>
				</div>
			);
		};
	}
});
