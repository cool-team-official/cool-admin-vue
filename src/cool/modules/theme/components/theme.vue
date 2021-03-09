<template>
	<div class="cl-theme">
		<li @click="open">
			<icon-svg :size="18" name="icon-theme"></icon-svg>
		</li>

		<el-drawer title="系统设置" :visible.sync="drawer.visible" size="300px">
			<div class="cl-theme__color is-card">
				<p>主题色</p>

				<ul>
					<li
						v-for="(color, name) in thems"
						:key="name"
						:style="{
							backgroundColor: color
						}"
						@click="changeColor(name, color)"
					></li>
				</ul>
			</div>

			<div class="cl-theme__switch is-card">
				<p>内容区域</p>

				<ul>
					<li>
						<span>显示一级菜单栏</span>
						<el-switch size="mini" v-model="form.showAMenu"></el-switch>
					</li>
					<li>
						<span>显示路由导航栏</span>
						<el-switch size="mini" v-model="form.showRouteNav"></el-switch>
					</li>
					<li>
						<span>显示页面进程栏</span>
						<el-switch size="mini" v-model="form.showProcess"></el-switch>
					</li>
				</ul>
			</div>
		</el-drawer>
	</div>
</template>

<script>
export default {
	name: "cl-theme",

	data() {
		return {
			drawer: {
				visible: false
			},
			form: {
				showAMenu: false,
				showRouteNav: true,
				showProcess: true
			},
			thems: {
				blue: "#4165d7",
				black: "#2f3447",
				green: "#51C21A",
				purple: "#d0378d"
			}
		};
	},

	watch: {
		form: {
			deep: true,
			handler(val) {
				this.$store.commit("UPDATE_CONF", val);
			}
		}
	},

	methods: {
		open() {
			this.drawer.visible = true;
		},

		changeColor(name, color) {
			this.$message.success("切换主题中");

			const theme = document.getElementById("theme-style");
			const link = theme || document.createElement("link");

			link.href = `http://192.168.199.148:5000/${name}.css`;

			if (!theme) {
				link.type = "text/css";
				link.rel = "stylesheet";
				link.id = "theme-style";

				document
					.getElementsByTagName("head")
					.item(0)
					.appendChild(link);
			}

			// document.getElementsByTagName("body")[0].style.setProperty("--color-main", color);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-theme {
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
			margin-top: 20px;

			li {
				list-style: none;
				height: 20px;
				width: 20px;
				border-radius: 3px;
				margin-right: 10px;

				&:hover {
					opacity: 0.7;
				}
			}
		}
	}
}
</style>
