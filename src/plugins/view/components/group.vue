<template>
	<div class="cl-view-group" :class="[isExpand ? 'is-expand' : 'is-collapse']">
		<div class="cl-view-group__wrap">
			<!-- 左侧 -->
			<div class="cl-view-group__left">
				<slot name="left">
					<div class="scope">
						<div class="head">
							<span>{{ config.label }}</span>

							<el-tooltip content="刷新" v-if="config.enableRefresh">
								<el-icon @click="refresh()">
									<icon-refresh />
								</el-icon>
							</el-tooltip>

							<el-tooltip content="添加" v-if="config.enableAdd">
								<el-icon
									@click="edit()"
									v-permission="config.service.permission.add"
								>
									<plus />
								</el-icon>
							</el-tooltip>
						</div>

						<div class="data" v-loading="loading">
							<el-scrollbar>
								<!-- 树类型 -->
								<template v-if="tree.visible">
									<el-tree
										class="tree"
										highlight-current
										auto-expand-parent
										:expand-on-click-node="false"
										:ref="setRefs('tree')"
										:lazy="tree.lazy"
										:data="list"
										:props="tree.props"
										:load="tree.onLoad"
										@node-click="select"
									>
										<template #default="{ data }">
											<div class="item">
												<component :is="data.icon" v-if="data.icon" />
												<span>{{ data[tree.props.label] }}</span>
											</div>
										</template>
									</el-tree>
								</template>

								<!-- 列表类型 -->
								<template v-else>
									<ul
										class="list"
										v-infinite-scroll="onMore"
										:infinite-scroll-immediate="false"
										:infinite-scroll-disabled="loaded"
									>
										<li
											v-for="(item, index) in list"
											:key="index"
											@click="select(item)"
											@contextmenu="
												(e) => {
													onContextMenu(e, item);
												}
											"
										>
											<slot
												name="item"
												:item="item"
												:selected="selected"
												:index="index"
											>
												<div
													class="item"
													:class="{
														'is-active': selected?.id == item.id
													}"
												>
													<slot
														name="item-name"
														:item="item"
														:selected="selected"
														:index="index"
													>
														<span>{{ item.name }}</span>
													</slot>

													<el-icon
														class="arrow-right"
														v-show="selected?.id == item.id"
													>
														<arrow-right-bold />
													</el-icon>
												</div>
											</slot>
										</li>

										<el-empty v-if="list.length == 0" :image-size="80" />
									</ul>
								</template>
							</el-scrollbar>
						</div>
					</div>
				</slot>

				<!-- 收起按钮 -->
				<div class="collapse-btn" @click="expand(false)" v-if="browser.isMini">
					<el-icon>
						<arrow-right />
					</el-icon>
				</div>
			</div>

			<!-- 右侧 -->
			<div class="cl-view-group__right">
				<div class="head">
					<div class="icon" @click="expand()">
						<el-icon v-if="isExpand"><arrow-left /></el-icon>
						<el-icon v-else><arrow-right /></el-icon>
					</div>

					<slot name="title" :selected="selected">
						<span class="title">
							{{ config.title }}（{{ selected?.name || "未选择" }}）
						</span>
					</slot>
				</div>

				<div class="content" v-if="selected">
					<slot name="right"></slot>
				</div>

				<el-empty :image-size="80" v-else />
			</div>
		</div>

		<cl-form ref="Form" />
	</div>
</template>

<script lang="ts" setup name="cl-view-group">
import { inject, nextTick, onMounted, reactive, ref, useSlots } from "vue";
import {
	ArrowLeft,
	ArrowRight,
	ArrowRightBold,
	Refresh as IconRefresh,
	Plus
} from "@element-plus/icons-vue";
import { useBrowser, useCool } from "/@/cool";
import { ContextMenu, useForm } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { isEmpty, merge } from "lodash-es";
import { deepTree } from "/@/cool/utils";
import { type ClViewGroup } from "../types/index.d";

const { browser, onScreenChange } = useBrowser();
const slots = useSlots();
const Form = useForm();
const { refs, setRefs } = useCool();

// 配置
const config = reactive(
	Object.assign(
		{
			label: "组",
			title: "列表",
			leftWidth: "300px",
			data: {},
			service: {},
			enableContextMenu: true,
			enableRefresh: true,
			enableAdd: true
		},
		inject("useViewGroup__options")
	)
) as ClViewGroup.Options;

// 左侧内容是否自定义
const isCustom = !!slots.left;

if (isEmpty(config.service) && !isCustom) {
	console.error("<cl-view-group /> 参数 service 不能为空");
}

// 加载中
const loading = ref(false);

// 列表
const list = ref<ClViewGroup.Item[]>([]);

// 是否展开
const isExpand = ref(true);

// 选中值
const selected = ref<ClViewGroup.Item>();

// 树配置
const tree = reactive(
	merge(
		{
			visible: !!config.tree,
			props: {
				label: "name",
				children: "children",
				disabled: "disabled",
				isLeaf: "isLeaf",
				class: ""
			},
			defaultExpandedKeys: [] as number[]
		},
		config.tree
	)
);

// 收起、展开
function expand(value?: boolean) {
	isExpand.value = value === undefined ? !isExpand.value : value;
}

// 设置选中值
function select(data?: ClViewGroup.Item) {
	if (!data) {
		data = list.value[0];
	}

	selected.value = data;

	nextTick(() => {
		if (data) {
			if (browser.isMini) {
				expand(false);
			}

			if (config.onSelect) {
				config.onSelect(data);
			}
		}
	});
}

// 编辑
function edit(item?: ClViewGroup.Item) {
	Form.value?.open({
		title: (item ? "编辑" : "添加") + config.label,
		form: {
			...item
		},
		on: {
			submit(data, { close, done }) {
				config.service[item ? "update" : "add"](data)
					.then(() => {
						ElMessage.success("保存成功");

						if (item) {
							Object.assign(item, data);
						} else {
							refresh();
						}

						close();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		},
		...(config.onEdit?.(item) as any)
	});
}

// 删除
function remove(item: ClViewGroup.Item) {
	ElMessageBox.confirm("此操作将会删除选择的数据，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			config.service
				.delete({
					ids: [item.id]
				})
				.then(async () => {
					ElMessage.success("删除成功");

					// 刷新列表
					await refresh();

					// 删除当前
					if (selected.value?.id == item.id) {
						select();
					}
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 请求参数
const reqParams = {
	order: "createTime",
	sort: "asc",
	page: 1,
	size: 20
};

// 是否加载完
const loaded = ref(false);

// 刷新
async function refresh(params?: any) {
	if (isCustom) {
		return false;
	}

	Object.assign(reqParams, params);

	loading.value = true;

	const data = {
		...reqParams,
		...config.data
	};

	let req;

	if (tree.visible) {
		// 树形数据
		req = config.service.list(data).then((res) => {
			list.value = deepTree(res);
		});
	} else {
		// 列表数据
		req = config.service.page(data).then((res) => {
			const arr = config.onData?.(res.list) || res.list;

			if (reqParams.page == 1) {
				list.value = arr;
			} else {
				list.value.push(...arr);
			}

			loaded.value = res.pagination.total <= list.value.length;
		});
	}

	await req
		.then(() => {
			const item = selected.value || list.value[0];

			if (item) {
				if (tree.visible) {
					const node = refs.tree.getNode(item);
					node.expand();
				}

				select(item);
			}
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

// 加载更多
function onMore() {
	refresh({
		page: reqParams.page + 1
	});
}

// 右键菜单
function onContextMenu(e: any, item: ClViewGroup.Item) {
	if (!config.enableContextMenu) {
		return false;
	}

	ContextMenu.open(e, {
		hover: {
			target: "item"
		},
		list: [
			{
				label: "编辑",
				hidden: !config.service._permission.update,
				callback(done) {
					done();
					edit(item);
				}
			},
			{
				label: "删除",
				hidden: !config.service._permission.delete,
				callback(done) {
					done();
					remove(item);
				}
			}
		],
		...(config.onContextMenu && config.onContextMenu(item))
	});
}

// 监听屏幕变化
onScreenChange(() => {
	expand(!browser.isMini);
});

onMounted(() => {
	refresh();
});

defineExpose({
	selected,
	isExpand,
	expand,
	select,
	browser,
	edit,
	remove
});
</script>

<style lang="scss" scoped>
.cl-view-group {
	height: 100%;
	width: 100%;

	$left-width: v-bind("config.leftWidth");
	$bg: var(--el-bg-color);

	&__wrap {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
	}

	&__left {
		position: relative;
		height: 100%;
		width: $left-width;
		background-color: $bg;

		.collapse-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 20px;
			bottom: 30px;
			height: 40px;
			width: 40px;
			border-radius: 100%;
			background-color: var(--color-primary);
			box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);

			.el-icon {
				color: #fff;
				font-size: 24px;
			}
		}

		.scope {
			height: 100%;
			width: 100%;
			box-sizing: border-box;
			white-space: nowrap;

			.head {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40px;
				font-size: 14px;
				padding: 0 10px;

				& > span {
					&:nth-child(1) {
						flex: 1;
					}
				}

				.el-icon {
					padding: 5px;
					font-size: 18px;
					margin-left: 5px;
					cursor: pointer;

					&:hover {
						background-color: var(--el-fill-color-lighter);
					}
				}
			}

			.data {
				height: calc(100% - 40px);
				box-sizing: border-box;

				:deep(.el-tree-node__content) {
					height: 36px;
					margin: 0 5px;
				}

				.tree {
					.item {
						display: flex;
						align-items: center;
						line-height: 1;
					}
				}

				.list {
					height: 100%;

					li {
						.item {
							display: flex;
							align-items: center;
							list-style: none;
							box-sizing: border-box;
							padding: 10px 35px 10px 10px;
							margin: 0 10px;
							cursor: pointer;
							font-size: 13px;
							margin-bottom: 10px;
							border-radius: 4px;
							color: #666;
							position: relative;
							background-color: #f7f7f7;

							.arrow-right {
								position: absolute;
								right: 10px !important;
							}

							&.is-active {
								background-color: var(--color-primary);
								color: #fff;
							}

							&:hover {
								opacity: 0.8;
							}
						}
					}

					&::after {
						display: block;
						content: "";
						height: 1px;
					}
				}
			}
		}
	}

	&__right {
		display: flex;
		flex-direction: column;
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 100%;
		transition: width 0.3s;
		background-color: $bg;

		.head {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;
			position: relative;
			font-size: 14px;

			.title {
				white-space: nowrap;
				overflow: hidden;
			}

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				left: 0;
				top: 0;
				font-size: 18px;
				cursor: pointer;
				height: 100%;
				width: 80px;
				padding-left: 10px;
			}
		}

		.content {
			height: calc(100% - 40px);
		}
	}

	&.is-expand {
		.cl-view-group__right {
			width: calc(100% - $left-width);
			border-left: 1px solid var(--el-border-color-extra-light);
		}
	}

	@media only screen and (max-width: 768px) {
		.cl-view-group__left {
			overflow: hidden;
			transition: width 0.2s;
			width: 0;
			z-index: 9;
		}

		.cl-view-group__right {
			width: 100% !important;
		}

		&.is-expand {
			.cl-view-group__left {
				width: 100%;
			}
		}
	}
}
</style>
