import Cron from "./cron";
import Base from "./base";

export default {
	name: "cl-cron",

	mixins: [Base],

	components: {
		Cron
	},

	props: {
		value: String,
		placeholder: {
			type: String,
			default: "请输入定时策略"
		}
	},

	data() {
		return {
			cronPopover: false,
			cron: ""
		};
	},

	watch: {
		cron: {
			handler(val) {
				this.fieldValue = val;
				this.$emit("change", val);
			}
		},
		value: {
			immediate: true,
			handler(val) {
				this.cron = val;
			}
		},
		fieldValue: {
			immediate: true,
			handler(val) {
				this.cron = val;
			}
		}
	},

	methods: {
		changeCron(val) {
			this.cron = val;
		},
		hidePopover() {
			this.cronPopover = false;
		}
	},

	render() {
		const vnode = (
			<el-popover vModel={this.cronPopover} disabled={this.disabled || this.readonly}>
				<Cron
					{...{
						props: { i18n: "cn" },
						on: {
							change: this.changeCron,
							close: this.hidePopover
						}
					}}></Cron>
				<el-input
					slot="reference"
					clearable={true}
					disabled={this.disabled}
					readonly={this.readonly}
					vModel={this.cron}
					placeholder={this.placeholder}></el-input>
			</el-popover>
		);
		return this.renderComponent(vnode);
	}
};
