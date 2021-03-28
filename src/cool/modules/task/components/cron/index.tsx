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
		const visible = ref<boolean>(false);

		function open() {
			visible.value = true;
		}

		function close() {
			visible.value = false;
		}

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
			visible,
			open,
			close
		};
	},

	render(ctx: any) {
		const ElPopover = (
			<el-popover
				visible={ctx.visible}
				disabled={ctx.disabled || ctx.readonly}
				width="600px"></el-popover>
		);

		return (
			<div class="cl-cron">
				{h(
					ElPopover,
					{
						"onUpdate:visible"(v: any) {
							if (!v) {
								ctx.close();
							}
						}
					},
					{
						default() {
							return <cron v-model={ctx.cron} onClose={ctx.close}></cron>;
						},
						reference() {
							return (
								<el-input
									clearable
									disabled={ctx.disabled}
									readonly={ctx.readonly}
									v-model={ctx.cron}
									placeholder={ctx.placeholder}
									onClick={ctx.open}></el-input>
							);
						}
					}
				)}
			</div>
		);
	}
});
