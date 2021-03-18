import { mapGetters } from "vuex";
import "./index.scss";

export default {
	name: "cl-menu-slider",

	data() {
		return {
			visible: true
		};
	},

	computed: {
		...mapGetters(["menuList", "menuCollapse", "browser", "app"])
	},

	watch: {
		menuList() {
			this.refresh();
		},
		"app.conf.showAMenu"() {
			this.$store.commit("SET_MENU_LIST");
		}
	},

	methods: {
		toView(url) {
			if (url != this.$route.path) {
				this.$router.push(url);
			}
		},

		refresh() {
			this.visible = false;

			setTimeout(() => {
				this.visible = true;
			}, 0);
		}
	},

	render() {
		const fn = list => {
			return list
				.filter(e => e.isShow)
				.map(e => {
					let html = null;

					if (e.type == 0) {
						html = (
							<el-submenu
								popper-class="cl-slider-menu__submenu"
								index={String(e.id)}
								key={e.id}>
								<template slot="title">
									<icon-svg name={e.icon}></icon-svg>
									<span slot="title">{e.name}</span>
								</template>
								{fn(e.children)}
							</el-submenu>
						);
					} else {
						html = (
							<el-menu-item index={e.path} key={e.path}>
								<icon-svg name={e.icon}></icon-svg>
								<span slot="title">{e.name}</span>
							</el-menu-item>
						);
					}

					return html;
				});
		};

		let el = fn(this.menuList);

		return (
			this.visible && (
				<div class="cl-slider-menu">
					<el-menu
						default-active={this.$route.path}
						background-color="transparent"
						collapse-transition={false}
						collapse={this.browser.isMini ? false : this.menuCollapse}
						on-select={this.toView}>
						{el}
					</el-menu>
				</div>
			)
		);
	}
};
