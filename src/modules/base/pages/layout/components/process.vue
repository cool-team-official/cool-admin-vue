<template>
	<div class="app-process">
		<div class="app-process__left hidden-xs-only" @click="toScroll(true)">
			<el-icon><arrow-left /></el-icon>
		</div>

		<div :ref="setRefs('scroller')" class="app-process__scroller">
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
				<span>{{ item.label }}</span>
				<el-icon
					v-if="index > 0"
					class="el-icon-close"
					@mousedown.stop="onDel(Number(index))"
				>
					<close />
				</el-icon>
			</div>
		</div>

		<div class="app-process__right hidden-xs-only" @click="toScroll(false)">
			<el-icon><arrow-right /></el-icon>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { last } from "/@/cool/utils";
import { useCool } from "/@/cool";
import { ArrowLeft, ArrowRight, Close } from "@element-plus/icons-vue";
import { ContextMenu } from "@cool-vue/crud";
import { useBaseStore } from "/$/base";

const { refs, setRefs, store, route, router }: any = useCool();
const { process } = useBaseStore();

// 跳转
function toPath() {
	const active = process.list.find((e: any) => e.active);

	if (!active) {
		const next = last(process.list);
		router.push(next ? next.value : "/");
	}
}

// 移动到
function scrollTo(left: number) {
	refs.value.scroller.scrollTo({
		left,
		behavior: "smooth"
	});
}

// 左右移动
function toScroll(f: boolean) {
	scrollTo(refs.value.scroller.scrollLeft + (f ? -100 : 100));
}

// 调整滚动位置
function adScroll(index: number) {
	const el = refs.value[`item-${index}`];

	if (el) {
		scrollTo(el.offsetLeft + el.clientWidth - refs.value.scroller.clientWidth);
	}
}

// 选择
function onTap(item: any, index: number) {
	adScroll(index);
	router.push(item.value);
}

// 删除
function onDel(index: number) {
	process.remove(index);
	toPath();
}

// 右键菜单
function openCM(e: any, item: any) {
	ContextMenu.open(e, {
		list: [
			{
				label: "关闭当前",
				hidden: item.value !== route.path,
				callback(done) {
					onDel(process.list.findIndex((e: any) => e.value == item.value));
					done();
					toPath();
				}
			},
			{
				label: "关闭其他",
				callback(done) {
					store.commit(
						"SET_PROCESS",
						process.list.filter((e: any) => e.value == item.value || e.value == "/")
					);
					done();
					toPath();
				}
			},
			{
				label: "关闭所有",
				callback(done) {
					store.commit(
						"SET_PROCESS",
						process.list.filter((e: any) => e.value == "/")
					);
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
		adScroll(process.list.findIndex((e: any) => e.value === val) || 0);
	}
);
</script>

<style lang="scss" scoped>
.app-process {
	display: flex;
	align-items: center;
	height: 30px;
	position: relative;
	margin-bottom: 10px;
	padding: 0 10px;

	&__left,
	&__right {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		height: 30px;
		padding: 0 2px;
		border-radius: 3px;
		cursor: pointer;

		&:hover {
			background-color: #eee;
		}
	}

	&__left {
		margin-right: 10px;
	}

	&__right {
		margin-left: 10px;
	}

	&__scroller {
		width: 100%;
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;

		&::-webkit-scrollbar {
			display: none;
		}
	}

	&__item {
		display: inline-flex;
		align-items: center;
		border-radius: 3px;
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		background-color: #fff;
		font-size: 12px;
		margin-right: 10px;
		color: #909399;
		cursor: pointer;

		&:last-child {
			margin-right: 0;
		}

		i {
			font-size: 14px;
			width: 0;
			overflow: hidden;
			transition: all 0.3s;

			&:hover {
				color: #fff;
				background-color: $color-primary;
			}
		}

		&:hover {
			&:not(.active) {
				background-color: #eee;
			}

			.el-icon-close {
				width: 14px;
				margin-left: 5px;
			}
		}

		&.active {
			span {
				color: $color-primary;
			}

			i {
				width: auto;
				margin-left: 5px;
			}

			&:before {
				background-color: $color-primary;
			}
		}
	}
}
</style>
