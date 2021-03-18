<template>
	<div class="cl-menu-topbar">
		<el-menu
			:default-active="index"
			mode="horizontal"
			background-color="transparent"
			@select="onSelect"
		>
			<el-menu-item v-for="(item, index) in list" :index="`${index}`" :key="index">
				<icon-svg v-if="item.icon" :name="item.icon"></icon-svg>
				<span>{{ item.name }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { firstMenu } from "@/cool/modules/base/utils";

export default {
	name: "cl-menu-topbar",

	data() {
		return {
			index: "0"
		};
	},

	computed: {
		...mapGetters(["menuGroup"]),

		list() {
			return this.menuGroup.filter(e => e.isShow);
		}
	},

	mounted() {
		this.menuGroup.forEach((e, i) => {
			if (this.$route.path.includes(e.path) && e.path != "/") {
				this.index = String(i);
				this.SET_MENU_LIST(i);
			}
		});
	},

	methods: {
		...mapMutations(["SET_MENU_LIST"]),

		onSelect(index) {
			this.SET_MENU_LIST(index);

			const url = firstMenu(this.menuGroup[index].children);
			this.$router.push(url);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-menu-topbar {
	/deep/.el-menu {
		height: 50px;
		background: transparent;
		border-bottom: 0;
		overflow: hidden;

		.el-menu-item {
			height: 50px;
			display: flex;
			align-items: center;
			background: transparent;
			border-bottom: 0;
			padding: 0 30px;

			span {
				font-size: 12px;
				margin-left: 3px;
				line-height: normal;
			}

			&.is-active {
				background: rgba(255, 255, 255, 0.13);
				color: $color-primary;
			}

			/deep/.icon-svg {
				height: 18px;
				width: 18px;
				margin-right: 5px;
			}
		}
	}
}
</style>
