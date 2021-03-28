<template>
	<div class="cl-theme">
		<li @click="open">
			<icon-svg :size="18" name="icon-theme"></icon-svg>
		</li>

		<!-- 系统设置 -->
		<el-drawer title="系统设置" v-model="drawer.visible" size="300px">
			<div class="cl-theme__container">
				<div class="cl-theme__color is-card">
					<p>主题</p>

					<ul>
						<el-tooltip
							v-for="(item, name) in themeList"
							:key="name"
							:content="item.label"
							placement="top"
						>
							<li
								:style="{
									backgroundColor: item.color
								}"
								@click="setTheme(item)"
							>
								<i
									class="el-icon-check"
									v-show="item.color == form.theme.color"
								></i>
							</li>
						</el-tooltip>
					</ul>
				</div>

				<div class="cl-theme__switch is-card">
					<p>内容区域</p>

					<ul>
						<li v-if="!browser.isMini">
							<span>显示一级菜单栏</span>
							<el-switch size="mini" v-model="form.conf.showAMenu"></el-switch>
						</li>
						<li>
							<span>显示路由导航栏</span>
							<el-switch size="mini" v-model="form.conf.showRouteNav"></el-switch>
						</li>
						<li>
							<span>显示页面进程栏</span>
							<el-switch size="mini" v-model="form.conf.showProcess"></el-switch>
						</li>
					</ul>
				</div>

				<div class="cl-theme__append">
					<slot></slot>
				</div>

				<div class="cl-theme__tips">
					<el-alert
						type="warning"
						:closable="false"
						show-icon
						title="手动修改配置文件可设置为默认主题、布局。"
					></el-alert>

					<el-button
						round
						type="primary"
						size="small"
						style="width: 100%"
						:disabled="!form.theme.url"
						@click="openDesc"
						>修改说明</el-button
					>
				</div>
			</div>
		</el-drawer>

		<!-- 修改说明 -->
		<cl-dialog
			v-model="desc.visible"
			title="修改说明"
			width="800px"
			:props="{
				'append-to-body': true
			}"
		>
			<ul class="cl-theme__desc">
				<li>
					<p class="cl-theme__desc-label">修改主题色：</p>
					<cl-codemirror v-model="desc.color"></cl-codemirror>
				</li>

				<li>
					<p class="cl-theme__desc-label">修改应用配置：</p>
					<cl-codemirror v-model="desc.conf"></cl-codemirror>
				</li>
			</ul>
		</cl-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { isDev } from "@/config/env";
import { isArray, cloneDeep } from "@/core/utils";

export default {
	name: "cl-theme",

	props: {
		list: Array
	},

	data() {
		return {
			drawer: {
				visible: false
			},
			desc: {
				visible: false,
				color: "",
				conf: ""
			},
			themes: [
				{
					label: "钴蓝",
					name: "blue",
					color: "#4165d7"
				},
				{
					label: "极黑",
					name: "black",
					color: "#2f3447"
				},
				{
					label: "果绿",
					name: "green",
					color: "#51C21A"
				},
				{
					label: "酱紫",
					name: "purple",
					color: "#d0378d"
				}
			],
			isDev,
			form: {}
		};
	},

	computed: {
		...mapGetters(["app", "modules", "browser"]),

		themeList() {
			return isArray(this.list) ? this.list : this.themes;
		}
	},

	watch: {
		app: {
			deep: true,
			immediate: true,
			handler(val) {
				this.form = cloneDeep(val);
			}
		},

		form: {
			deep: true,
			handler(val) {
				this.$store.commit("UPDATE_APP", val);
			}
		}
	},

	methods: {
		open() {
			this.drawer.visible = true;
		},

		close() {
			this.drawer.visible = false;
		},

		// 设置主题
		setTheme({ name, color, label }) {
			if (this.form.theme.color == color) {
				return false;
			}

			this.$message.success(`切换主题：${label}`);

			const theme = document.getElementById("theme-style");
			const style = theme || document.createElement("link");

			style.href = `${this.modules.theme.options.sourceUrl || "/theme/"}${name}.css`;

			if (!theme) {
				style.type = "text/css";
				style.rel = "stylesheet";
				style.id = "theme-style";

				document
					.getElementsByTagName("head")
					.item(0)
					.appendChild(style);
			}

			// 设置主题色和路径
			this.form.theme.color = color;
			this.form.theme.url = style.href;

			// 设置 css 变量
			document.getElementsByTagName("body")[0].style.setProperty("--color-primary", color);
		},

		// 打开修改说明
		openDesc() {
			this.desc.visible = true;

			this.desc.color = `
				// src/assets/css/common.scss
				$primary: ${this.form.theme.color};
			`;

			this.desc.conf = `
				// src/config/env.js
				export const app = {
					conf: ${JSON.stringify(this.form.conf)},
					theme: {
						url: "${this.form.theme.url}"
					}
				}
			`;
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-theme {
	:deep(.el-drawer) {
		&__header {
			margin-bottom: 20px;
		}

		&__body {
			height: calc(100% - 63px);
		}
	}

	&__container {
		height: 100%;
		overflow: auto;

		&::-webkit-scrollbar {
			width: 6px;
		}

		&::-webkit-scrollbar-thumb {
			border-radius: 6px;
			background-color: rgba(144, 147, 153, 0.3);
		}
	}

	.is-card {
		padding: 20px 0;
		margin: 0 20px 20px 20px;
		border-bottom: 1px solid #f7f7f7;

		& > p {
			font-size: 15px;
			font-weight: bold;
			margin-bottom: 10px;
		}
	}

	&__switch {
		ul {
			width: 100%;

			li {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 40px;
				list-style: none;

				span {
					font-size: 13px;
				}
			}
		}
	}

	&__color {
		ul {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10px;

			li {
				list-style: none;
				height: 20px;
				width: 20px;
				border-radius: 3px;
				margin-right: 10px;
				margin-top: 10px;
				text-align: center;
				color: #fff;
				line-height: 20px;

				&:hover {
					opacity: 0.7;
				}
			}
		}
	}

	&__tips {
		padding: 10px 20px;
		margin-bottom: 50px;

		.el-button {
			margin-top: 20px;
		}
	}

	&__desc {
		padding: 10px;

		&-label {
			margin-bottom: 10px;
		}

		li {
			list-style: none;
			margin-bottom: 20px;
		}
	}
}
</style>
