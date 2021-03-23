import Cron from "./cron";

export default {
	name: "cl-cron",

	components: {
		Cron
	},

	props: {
		value: String,
		placeholder: {
			type: String,
			default: "请输入定时策略"
		},
		disabled: Boolean,
		readonly: Boolean
	},

	data() {
		return {
			visible: false,
			cron: ""
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.cron = val;
			}
		},
		cron: {
			handler(val) {
				this.$emit("input", val);
				this.$emit("change", val);
			}
		}
	},

	methods: {
		close() {
			this.visible = false;
		}
	},

	render() {
		return (
			<el-popover v-model={this.visible} disabled={this.disabled || this.readonly}>
				<cron
					v-model={this.cron}
					{...{
						on: {
							close: this.close
						}
					}}></cron>
				<el-input
					slot="reference"
					clearable
					disabled={this.disabled}
					readonly={this.readonly}
					v-model={this.cron}
					placeholder={this.placeholder}></el-input>
			</el-popover>
		);
	}
};
