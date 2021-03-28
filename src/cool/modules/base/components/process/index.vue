<template>
	<div class="app-process">
		<div class="app-process__left hidden-xs-only" @click="toScroll(true)">
			<i class="el-icon-arrow-left"></i>
		</div>

		<div class="app-process__scroller" :ref="setRefs('scroller')">
			<div
				class="app-process__item"
				v-for="(item, index) in list"
				:key="index"
				:ref="setRefs(`item-${index}`)"
				:class="{ active: item.active }"
				:data-index="index"
				@click="onTap(item)"
				@contextmenu.stop.prevent="openCM($event, item)"
			>
				<span>{{ item.label }}</span>
				<i class="el-icon-close" v-if="index > 0" @mousedown.stop="onDel(index)"></i>
			</div>
		</div>

		<div class="app-process__right hidden-xs-only" @click="toScroll(false)">
			<i class="el-icon-arrow-right"></i>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { last } from "@/core/utils";
import { useRefs } from "@/core";
import { ContextMenu } from "@/crud";

export default {
	name: "cl-process",

	setup() {
		const router = useRouter();
		const route = useRoute();
		const store = useStore();
		const { refs, setRefs } = useRefs();

		// 参数配置
		const menu = reactive<any>({
			current: {}
		});

		// 数据列表
		const list = computed(() => store.getters.processList);

		// 跳转
		function toPath() {
			const active = list.value.find((e: any) => e.active);

			if (!active) {
				const next = last(list.value);
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
			store.commit("DEL_PROCESS", index);
			toPath();
		}

		// 右键菜单
		function openCM(e: any, item: any) {
			ContextMenu.open(e, {
				list: [
					{
						label: "关闭当前",
						hidden: item.value !== route.path,
						callback: (_: any, done: Function) => {
							onDel(list.value.findIndex((e: any) => e.value == item.value));
							done();
							toPath();
						}
					},
					{
						label: "关闭其他",
						callback: (_: any, done: Function) => {
							store.commit(
								"SET_PROCESS",
								list.value.filter(
									(e: any) => e.value == item.value || e.value == "/"
								)
							);
							done();
							toPath();
						}
					},
					{
						label: "关闭所有",
						callback: (_: any, done: Function) => {
							store.commit(
								"SET_PROCESS",
								list.value.filter((e: any) => e.value == "/")
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
			function(val) {
				adScroll(list.value.findIndex((e: any) => e.value === val) || 0);
			}
		);

		return {
			refs,
			setRefs,
			menu,
			list,
			onTap,
			onDel,
			toPath,
			toScroll,
			adScroll,
			scrollTo,
			openCM
		};
	}
};
</script>

<style lang="scss" scoped>
.app-process {
	display: flex;
	align-items: center;
	height: 30px;
	position: relative;

	&__left,
	&__right {
		background-color: #fff;
		height: 30px;
		line-height: 30px;
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
