<template>
	<div class="app-process">
		<ul class="app-process__op">
			<li class="item" @click="router.back">
				<i class="cl-iconfont cl-icon-back"></i>
			</li>
			<li class="item" @click="toRefresh">
				<i class="cl-iconfont cl-icon-refresh"></i>
			</li>
			<li class="item" @click="router.push('/')">
				<i class="cl-iconfont cl-icon-home"></i>
			</li>
		</ul>

		<div class="app-process__container">
			<el-scrollbar :ref="setRefs('scroller')" class="app-process__scroller">
				<div
					v-for="(item, index) in process.list"
					:key="index"
					:ref="setRefs(`item-${index}`)"
					class="app-process__item"
					:class="{ active: item.active }"
					:data-index="index"
					@click="onTap(item, Number(index))"
					@contextmenu.stop.prevent="openCM($event, item)"
				>
					<span>{{ item.meta?.label || item.name || item.path }}</span>
					<el-icon @mousedown.stop="onDel(Number(index))">
						<close-bold />
					</el-icon>
				</div>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" name="app-process" setup>
import { onMounted, watch } from "vue";
import { last } from "lodash-es";
import { useCool } from "/@/cool";
import { CloseBold } from "@element-plus/icons-vue";
import { ContextMenu } from "@cool-vue/crud";
import { useBase, Process } from "/$/base";

const { refs, setRefs, route, router, mitt } = useCool();
const { process } = useBase();

// 刷新当前路由
function toRefresh() {
	mitt.emit("view.refresh");
}

// 跳转
function toPath() {
	const d = process.list.find((e) => e.active);

	if (!d) {
		const next = last(process.list);
		router.push(next ? next.fullPath : "/");
	}
}

// 移动到
function scrollTo(left: number) {
	refs.scroller.wrapRef.scrollTo({
		left,
		behavior: "smooth"
	});
}

// 调整滚动位置
function adScroll(index: number) {
	const el = refs[`item-${index}`];

	if (el) {
		scrollTo(el.offsetLeft - (refs.scroller.wrapRef.clientWidth + el.clientWidth) / 2);
	}
}

// 选择
function onTap(item: Process.Item, index: number) {
	adScroll(index);
	router.push(item.fullPath);
}

// 删除
function onDel(index: number) {
	process.remove(index);
	toPath();
}

// 右键菜单
function openCM(e: any, item: Process.Item) {
	ContextMenu.open(e, {
		hover: {
			target: "app-process__item"
		},
		list: [
			{
				label: "关闭当前",
				hidden: item.fullPath !== route.path,
				callback(done) {
					onDel(process.list.findIndex((e) => e.fullPath == item.fullPath));
					done();
					toPath();
				}
			},
			{
				label: "关闭其他",
				callback(done) {
					process.set(process.list.filter((e) => e.fullPath == item.fullPath));
					done();
					toPath();
				}
			},
			{
				label: "关闭所有",
				callback(done) {
					process.clear();
					done();
					toPath();
				}
			}
		]
	});
}

watch(
	() => route.path,
	function (val) {
		adScroll(process.list.findIndex((e) => e.fullPath === val) || 0);
	}
);

onMounted(() => {
	// 添加滚轮事件监听器
	refs.scroller.wrapRef.addEventListener("wheel", function (event: WheelEvent) {
		// 阻止默认滚动行为
		event.preventDefault();

		// 滚动的速度因子，可以根据需要调整
		const scrollSpeed = 2;

		// 计算滚动的距离
		const distance = event.deltaY * scrollSpeed;

		scrollTo(refs.scroller.wrapRef.scrollLeft + distance);
	});
});
</script>

<style lang="scss" scoped>
.app-process {
	display: flex;
	align-items: center;
	height: 30px;
	position: relative;
	margin: 0 0 10px 0;
	padding: 0 10px;
	user-select: none;

	&__op {
		display: flex;
		background-color: #fff;
		height: 30px;
		border-radius: 4px;
		margin-right: 10px;
		list-style: none;

		.item {
			position: relative;
			padding: 0 10px;
			line-height: 30px;
			color: #333;
			cursor: pointer;
			font-weight: bold;

			&:not(:last-child)::after {
				display: block;
				content: "";
				position: absolute;
				right: 0;
				top: calc(50% - 5px);
				height: 10px;
				width: 1px;
				background-color: #eee;
			}

			&:hover {
				color: var(--el-color-primary);
			}
		}
	}

	&__container {
		height: 30px;
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	&__scroller {
		height: 40px;
		width: 100%;
		white-space: nowrap;
		position: absolute;
		left: 0;
		top: 0;
	}

	&__item {
		display: inline-flex;
		align-items: center;
		border-radius: 4px;
		height: 30px;
		padding: 0 10px;
		background-color: #fff;
		font-size: 12px;
		margin-right: 10px;
		color: #909399;
		cursor: pointer;

		.el-icon {
			font-size: 13px;
			width: 0;
			overflow: hidden;
			transition: all 0.3s;
			color: #909399;
			opacity: 0;

			&:hover {
				color: #f56c6c !important;
			}
		}

		&:last-child {
			margin-right: 0;
		}

		&:hover {
			&:not(.active) {
				background-color: #eee;
			}
		}

		&.active {
			background-color: var(--color-primary);

			span {
				color: #fff;
			}

			.el-icon {
				color: #fff;
			}
		}

		&:hover,
		&.active {
			.el-icon {
				opacity: 1;
				width: 13px;
				margin-left: 5px;
			}
		}
	}
}
</style>
