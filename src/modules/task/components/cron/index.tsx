import { defineComponent, h, ref, watch } from "vue";
import Cron from "./cron.vue";

export default defineComponent({
	name: "cl-cron",

	components: {
		Cron
	},

	props: {
		modelValue: {
			type: String,
			default: ""
		},
		placeholder: {
			type: String,
			default: "请输入定时策略"
		},
		disabled: Boolean,
		readonly: Boolean
	},

	emits: ["update:modelValue", "change"],

	setup(props, { emit }) {
		const cron = ref<string>("");

		watch(cron, (val: string) => {
			emit("update:modelValue", val);
			emit("change", val);
		});

		watch(
			() => props.modelValue,
			(val: string) => {
				cron.value = val;
			},
			{
				immediate: true
			}
		);

		return {
			cron,
			open,
			close
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-cron">
				<el-input
					clearable
					disabled={ctx.disabled}
					readonly={ctx.readonly}
					v-model={ctx.cron}
					placeholder={ctx.placeholder}
				></el-input>

				<cron v-model={ctx.cron} onClose={ctx.close}></cron>
			</div>
		);
	}
});
