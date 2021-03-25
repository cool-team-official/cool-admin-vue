<template>
	<div class="cl-menu-topbar">
		<el-menu
			:default-active="index"
			mode="horizontal"
			background-color="transparent"
			@select="onSelect"
		>
			<el-menu-item v-for="(item, index) in list" :index="`${index}`" :key="index">
				<icon-svg v-if="item.icon" :name="item.icon" :size="18"></icon-svg>
				<span>{{ item.name }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import { firstMenu } from "../../utils";

export default {
	name: "cl-menu-topbar",

	data() {
		return {
			index: "0"
		};
	},

	computed: {
		list() {
			return this.$store.getters.menuGroup.filter(e => e.isShow);
		}
	},

	mounted() {
		const deep = (e, i) => {
			switch (e.type) {
				case 0:
					e.children.forEach(e => {
						deep(e, i);
					});
					break;
				case 1:
					if (this.$route.path.includes(e.path)) {
						this.index = String(i);
						this.SET_MENU_LIST(i);
					}
					break;

				case 2:
				default:
					break;
			}
		};

		this.list.forEach((e, i) => {
			deep(e, i);
		});
	},

	methods: {
		...mapMutations(["SET_MENU_LIST"]),

		onSelect(index) {
			this.SET_MENU_LIST(index);

			// 获取第一个菜单地址
			const url = firstMenu(this.list[index].children);
			this.$router.push(url);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-menu-topbar {
	margin-right: 10px;

	/deep/.el-menu {
		height: 50px;
		background: transparent;
		border-bottom: 0;
		overflow: hidden;

		.el-menu-item {
			display: flex;
			align-items: center;
			height: 50px;
			border-bottom: 0;
			padding: 0 20px;
			background: transparent;

			span {
				font-size: 12px;
				margin-left: 3px;
				line-height: normal;
			}

			&.is-active {
				color: $color-primary;
			}

			/deep/.icon-svg {
				margin-right: 5px;
			}
		}
	}
}
</style>
