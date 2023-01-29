<template>
	<div class="a-menu">
		<el-menu
			:default-active="active"
			mode="horizontal"
			background-color="transparent"
			@select="select"
		>
			<el-menu-item v-for="(item, index) in menu.group" :key="index" :index="`${index}`">
				<cl-svg v-if="item.icon" :name="item.icon" :size="18" />
				<span class="a-menu__name">{{ item.name }}</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script lang="ts" name="a-menu" setup>
import { onMounted, ref } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";

const { router, route } = useCool();
const { menu } = useBase();

// 选中标识
const active = ref("");

// 选择导航
function select(index: any) {
	menu.setMenu(index);

	// 获取第一个菜单地址
	const url = menu.getPath(menu.group[index].children);
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
					active.value = String(i);
					menu.setMenu(i);
				}
				break;
			case 2:
			default:
				break;
		}
	}

	menu.group.forEach((e: any, i: number) => {
		deep(e, i);
	});
});
</script>

<style lang="scss" scoped>
.a-menu {
	margin: 5px 0 0 5px;

	.el-menu {
		height: 40px;
		background: transparent;
		border: 0;

		:deep(.el-sub-menu__title) {
			border: 0 !important;
		}

		:deep(.el-menu-item) {
			display: flex;
			align-items: center;
			height: 40px;
			padding: 0 15px;
			background: transparent;
			border: 0;
			color: #999;

			span {
				font-size: 12px;
				margin-left: 3px;
				line-height: normal;
			}

			&:hover {
				background: transparent;
			}

			&.is-active {
				color: var(--color-primary);
				border-radius: 5px 5px 0 0;
				background: #fff;
				color: #000;
			}

			.cl-svg {
				margin-right: 5px;
			}
		}
	}

	&__name {
		margin-left: 8px;
	}
}
</style>
