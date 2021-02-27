<template>
	<div class="cl-menu-file">
		<el-row :gutter="10">
			<el-col :span="16">
				<el-select v-model="newValue" filterable clearable placeholder="请选择">
					<el-option
						v-for="(item, index) in list"
						:key="index"
						:label="item.value"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-col>

			<el-col :span="8">
				<div class="cl-menu-file__module">
					<span class="label">模块</span>

					<el-select
						v-model="form.moduleName"
						placeholder="选择模块"
						clearable
						filterable
						@change="onModuleChange"
					>
						<el-option
							v-for="(item, index) in componentModules"
							:key="index"
							:label="item.label"
							:value="item.moduleName"
						>
						</el-option>
					</el-select>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "cl-admin/utils";

const files = require.context("@/", true, /^.\/views.*(vue|js)/).keys();

export default {
	name: "cl-menu-file",

	props: {
		value: [String]
	},

	inject: ["form"],

	data() {
		return {
			newValue: "",
			list: []
		};
	},

	computed: {
		...mapGetters(["componentModules"])
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.newValue = val || "";
			}
		},

		newValue(val) {
			this.$emit("input", val);
		}
	},

	created() {
		this.list = files
			.filter((e) => {
				return !e.includes("components");
			})
			.map((e) => {
				return {
					value: e.substr(2)
				};
			});
	},

	methods: {
		async onModuleChange(val) {
			const { label, keepAlive, icon, path, component } = this.componentModules.find(
				(e) => e.moduleName == val
			);

			if (label) {
				this.form.name = label;
			}

			if (path) {
				this.form.router = path;
			}

			if (icon) {
				this.form.icon = icon;
			}

			if (component) {
				let c = await component();
				this.form.viewPath = c.default.__file;
			}

			this.form.keepAlive = isEmpty(keepAlive) ? true : keepAlive;
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-menu-file {
	width: 100%;

	/deep/ .el-select {
		width: 100%;
	}

	&__module {
		display: inline-flex;

		.label {
			width: 40px;
			text-align: right;
			margin-right: 10px;
		}
	}
}
</style>
