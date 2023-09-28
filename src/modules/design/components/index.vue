<template>
	<el-scrollbar>
		<div class="dp-wrap">
			<dp-demo :ref="setRefs('demo')" />

			<div class="dp-device">
				<div class="device">
					<div class="nav">设计页</div>

					<el-scrollbar class="scrollbar" :ref="setRefs('scrollbar')">
						<draggable
							v-model="form.list"
							class="list"
							tag="div"
							item-key="id"
							:group="{
								name: 'A',
								animation: 300,
								ghostClass: 'Ghost',
								dragClass: 'Drag',
								draggable: '.is-drag'
							}"
							:clone="onClone"
						>
							<template #item="{ element: item, index }">
								<div
									class="item"
									:class="{
										active: form.active == item.id
									}"
									@click="toDet(item)"
								>
									<el-icon
										class="close"
										@click.stop="remove(index)"
										v-show="form.active == item.id"
									>
										<close-bold />
									</el-icon>

									<!-- 组合 -->
									<demo-group
										:data="item"
										v-bind="item.component.props"
										v-model:children="item.component.props.children"
										v-if="item.component.props.children"
									/>

									<!-- 基础元素 -->
									<component
										:is="item.component.name"
										:data="item"
										v-bind="item.component.props"
										v-else
									/>
								</div>
							</template>

							<template #footer>
								<div class="tips">点击或者拖动组件添加</div>
							</template>
						</draggable>
					</el-scrollbar>
				</div>
			</div>

			<dp-config />
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
import { onMounted, provide, reactive, nextTick } from "vue";
import Draggable from "vuedraggable/src/vuedraggable";
import { CloseBold } from "@element-plus/icons-vue";
import { storage, useCool } from "/@/cool";
import { isArray, isEmpty } from "lodash-es";
import DpConfig from "./config.vue";
import DpDemo from "./demo.vue";
import { Dp } from "../types";

const { mitt, refs, setRefs } = useCool();

const form = reactive<{ active: string; list: any[] }>({
	active: "",
	list: []
});

// 组件配置详情
function toDet(item: any) {
	if (item) {
		form.active = item.id;
		mitt.emit("dp.setConfig", item);
	}
}

// 添加组件
function add(data: any) {
	if (data) {
		const arr = isArray(data) ? data : [data];
		form.list.push(...arr);
		toDet(arr[0]);
	}
}

// 清空组件配置
function clearConfig(id?: string) {
	if (form.active == id || !id) {
		mitt.emit("dp.clearConfig");
	}
}

// 删除
function remove(index: number) {
	clearConfig(form.list[index].id);

	const d = form.list[index];

	if (d) {
		if (d.isTemp) {
			// 添加套件中自定义的组件
			const arr = d.component.props.children.filter((e: any) => e.isDel !== false);

			if (!isEmpty(arr)) {
				add(arr);
			}
		}
	}

	form.list.splice(index, 1);
}

// 删除方式2
function removeBy({ id, index }: any) {
	if (id) {
		index = form.list.findIndex((e) => e.id == id);
	}

	remove(index);
}

// 清空列表
function clear() {
	clearConfig();
	form.list = [];
}

// 复制
function onClone(data: any) {
	mitt.emit("dp.pull", data);
	return data;
}

// 设置选中
function setActive(id: string) {
	const d = form.list.find((e) => e.id == id);
	if (d) {
		toDet(d);
	}
}

// 根据 prop 获取列表中的信息
function get(prop: string) {
	let d = null;

	form.list.forEach((e) => {
		if (e.prop == prop) {
			return (d = e);
		} else {
			if (e.component.name == "demo-group") {
				e.component.props.children.forEach((a: any) => {
					if (a.prop == prop) {
						return (d = a);
					}
				});
			}
		}
	});

	return d;
}

// 获取列表
function getData() {
	function deep(arr: any[]): any {
		return arr.map((e) => {
			const isGroup = e.component.name == "demo-group" || e.name == "group";

			const d = {
				id: e.id,
				name: e.name,
				label: e.component.props.label
			};

			if (isGroup) {
				return {
					...d,
					isGroup,
					children: deep(e.component.props.children || [])
				};
			} else {
				return {
					...d,
					prop: e.prop,
					name: e.name,
					getType: e.getType,
					props: e.component.props
				};
			}
		});
	}

	return deep(form.list);
}

// 获取组
function getGroup(id: string) {
	let d = null;

	form.list.forEach((a) => {
		if (a.isTemp) {
			if (a.id == id) {
				d = a;
			} else {
				a.component.props.children.forEach((e: any) => {
					if (e.id == id) {
						d = a;
					}
				});
			}
		}
	});

	return d;
}

// 是否套件
function hasTemp() {
	return !!form.list.find((e) => e.isTemp);
}

// 保存草稿
function saveDraft() {
	storage.set(
		"design.pageCode",
		form.list.map((e) => {
			return {
				...e,
				config: undefined
			};
		})
	);
}

// 获取草稿
function getDraft() {
	const list: Dp.DemoItem[] = storage.get("design.pageCode") || [];

	form.list = list.map((e) => {
		e.config = refs.demo.getConfig(e.name);
		return e;
	});

	toDet(form.list[0]);
}

// 滚动到底
function scrollToBottom() {
	nextTick(() => {
		refs.scrollbar.scrollTo(0, 9999);
	});
}

// 监听选中事件
mitt.on("dp.setActive", setActive);

const dp = {
	form,
	get,
	getGroup,
	getData,
	toDet,
	setActive,
	add,
	remove,
	removeBy,
	clear,
	hasTemp,
	clearConfig,
	saveDraft,
	scrollToBottom
};

provide("dp", dp);
defineExpose(dp);

onMounted(() => {
	getDraft();
});
</script>

<style lang="scss">
.Ghost {
	opacity: 0.7;
}
</style>

<style lang="scss">
.dp-wrap {
	display: flex;
	height: 100%;
	min-height: 700px;
	background-color: #edf0f3;
	padding: 10px;
	box-sizing: border-box;
	color: #000;

	.dp-device {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;

		.device {
			position: relative;
			height: 667px;
			width: 360px;
			overflow: hidden;
			border-radius: 20px;
			background-color: #f7f8fa;

			.nav {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 54px;
				font-size: 18px;
				background-color: #fff;
				border-bottom: 1px solid #eee;
			}

			.scrollbar {
				height: 612px;
				width: 100%;

				.list {
					height: 100%;
					padding-bottom: 20px;
					box-sizing: border-box;

					.item {
						position: relative;
						margin-bottom: 6px;
						box-sizing: border-box;
						cursor: pointer;
						width: 100%;

						&:last-child {
							margin-bottom: 0;
						}

						.close {
							position: absolute;
							right: 0;
							top: 0;
							height: 14px;
							width: 14px;
							color: #fff;
							z-index: 9;
							background-color: var(--color-primary);
							padding: 1px;
							cursor: pointer;

							&:hover {
								background-color: red;
							}
						}

						&.sortable-ghost {
							display: flex;
							align-items: center;
							min-height: 40px;
							width: 100%;
							padding: 0 18px;
							box-sizing: border-box;
							border: 1px dashed currentColor;
							border-radius: 4px;
							cursor: pointer;
							color: #bfbfbf;
							background-color: #fff;
							opacity: 0.8;

							img {
								height: 20px;
								width: 20px;
								margin-right: 14px;
							}

							span {
								font-size: 16px;
							}

							[class^="demo-"] {
								width: 100%;
								color: #fff;

								.placeholder {
									color: #fff;
								}
							}
						}

						&.active {
							&::after {
								display: block;
								content: "";
								position: absolute;
								left: 0;
								top: 0;
								height: 100%;
								width: 100%;
								border: 2px solid var(--color-primary);
								box-sizing: border-box;
								pointer-events: none;
							}
						}
					}
				}
			}

			.tips {
				text-align: center;
				font-size: 14px;
				padding: 10px 0 20px 0;
				color: #999;
			}
		}
	}
}
</style>
