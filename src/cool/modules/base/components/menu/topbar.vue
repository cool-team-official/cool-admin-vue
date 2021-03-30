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

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { firstMenu } from "../../utils";

export default defineComponent({
	name: "cl-menu-topbar",

	setup() {
		// 缓存
		const store = useStore();

		// 路由控制
		const router = useRouter();

		// 当页路由
		const route = useRoute();

		// 选中标识
		const index = ref<string>("0");

		// 菜单列表
		const list = computed(() => store.getters.menuGroup.filter((e: any) => e.isShow));

		// 选择导航
		function onSelect(index: number) {
			store.commit("SET_MENU_LIST", index);

			// 获取第一个菜单地址
			const url = firstMenu(list.value[index].children);
			router.push(url);
		}

		onMounted(function() {
			// 设置默认
			function deep(e: any, i: number) {
				switch (e.type) {
					case 0:
						e.children.forEach((e: any) => {
							deep(e, i);
						});
						break;
					case 1:
						if (route.path.includes(e.path)) {
							index.value = String(i);
							store.commit("SET_MENU_LIST", i);
						}
						break;
					case 2:
					default:
						break;
				}
			}

			list.value.forEach((e: any, i: number) => {
				deep(e, i);
			});
		});

		return {
			index,
			list,
			onSelect
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-menu-topbar {
	margin-right: 10px;

	:deep(.el-menu) {
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

			:deep(.icon-svg) {
				margin-right: 5px;
			}
		}
	}
}
</style>
