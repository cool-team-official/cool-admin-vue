<template>
	<div class="a-menu">
		<el-menu
			:default-active="index"
			mode="horizontal"
			background-color="transparent"
			@select="onSelect"
		>
			<el-menu-item v-for="(item, i) in list" :key="i" :index="`${i}`">
				<icon-svg v-if="item.icon" :name="item.icon" :size="18" />
				<span>{{ item.name }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useBaseStore } from "/$/base";
import { firstMenu } from "/$/base/utils";
import { useCool } from "/@/cool";

export default defineComponent({
	name: "a-menu",

	setup() {
		const { router, route } = useCool();
		const { menu } = useBaseStore();

		// 选中标识
		const index = ref<string>("0");

		// 菜单列表
		const list = computed(() => menu.group.filter((e: any) => e.isShow));

		// 选择导航
		function onSelect(index: number) {
			// 设置菜单
			menu.setMenu(index);

			// 获取第一个菜单地址
			const url = firstMenu(list.value[index].children);
			router.push(url);
		}

		onMounted(function () {
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
							menu.setMenu(i);
						}
						break;
					case 2:
					default:
						break;
				}
			}

			list.value.forEach(deep);
		});

		return {
			index,
			list,
			onSelect
		};
	}
});
</script>

<style lang="scss">
.a-menu {
	margin-right: 10px;

	.el-menu {
		height: 50px;
		background: transparent;
		overflow: hidden;

		.el-menu-item {
			display: flex;
			align-items: center;
			height: 50px;
			border-bottom: 0 !important;
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

			.icon-svg {
				margin-right: 5px;
			}
		}
	}
}
</style>
