<template>
	<div class="a-menu">
		<el-menu
			:default-active="active"
			mode="horizontal"
			background-color="transparent"
			@select="select"
		>
			<template v-for="(item, index) in list" :key="item.id">
				<el-menu-item :index="`${index}`">
					<cl-svg v-if="item.icon" :name="item.icon" :size="18" />
					<span class="a-menu__name">{{ item.meta?.label }}</span>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
</template>

<script lang="ts" name="a-menu" setup>
import { computed, ref, watch } from "vue";
import { useBase, Menu } from "/$/base";
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";

const { router, route } = useCool();
const { menu } = useBase();

// 选中标识
const active = ref("0");

// 组列表
const list = computed(() => {
	return menu.group.filter((e) => e.isShow);
});

// 选择导航
function select(index: any) {
	if (String(index) == active.value) {
		return false;
	}

	// 选中的组
	const item = list.value[index];

	// 获取第一个菜单地址
	const url = menu.getPath(item);

	if (url) {
		// 设置左侧菜单
		menu.setMenu(index);

		// 跳转
		router.push(url);
	} else {
		ElMessage.warning(`“${item.meta?.label}”下没有菜单，请先添加`);
	}
}

// 刷新
function refresh() {
	let index = 0;

	function deep(e: Menu.Item, i: number) {
		switch (e.type) {
			case 0:
				if (e.children) {
					e.children.forEach((e) => {
						deep(e, i);
					});
				}

				break;
			case 1:
				if (route.path.includes(e.path)) {
					index = i;
				}
				break;
			default:
				break;
		}
	}

	// 遍历所有分组
	list.value.forEach(deep);

	// 确认选择
	active.value = String(index);

	// 设置该分组下的菜单
	menu.setMenu(index);
}

// 监听变化
watch(
	() => [route.path, menu.group.length],
	() => {
		refresh();
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.a-menu {
	margin: 5px 0 0 10px;

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
				border-radius: 6px 6px 0 0;
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
