<template>
	<div class="view-task">
		<el-scrollbar>
			<div class="box">
				<!-- 系统，用户自定义，已停止 -->
				<div
					v-for="(item, index) in list"
					:key="index"
					class="block"
					:class="[`_${item.key}`]"
				>
					<div class="header">
						<!-- 图标 -->
						<i class="icon" :class="item.icon"></i>
						<!-- 标题 -->
						<span class="label">{{ item.label }}</span>
						<!-- 数量 -->
						<span class="num">({{ item.pagination.total }})</span>
						<span class="flex1"></span>
						<!-- 操作按钮 -->
						<ul class="op-btn">
							<li
								v-permission="perm.delete"
								class="refresh-btn"
								@click="refreshTask({ page: 1 })"
							>
								<el-icon><refresh /></el-icon>
								<span>刷新</span>
							</li>

							<li v-permission="perm.add" class="add-btn" @click="edit(item.params)">
								<el-icon><circle-plus /></el-icon>
								<span>添加</span>
							</li>
						</ul>
					</div>

					<div :ref="setRefs(`${item.key}-scroller`)" class="container scroller1">
						<draggable
							v-model="list[index].list"
							v-bind="drag.options"
							tag="ul"
							item-key="id"
							:data-type="item.params.type"
							:data-status="item.params.status"
							@end="onDragEnd"
						>
							<template #item="{ element }">
								<li
									:key="element.id"
									:data-id="element.id"
									class="_drag"
									@contextmenu.stop.prevent="openCM($event, element)"
								>
									<div class="h">
										<span v-show="element.status === 0" class="type _warning">
											{{ element.type === 0 ? "系统" : "用户" }}
										</span>
										<span class="name">{{ element.name }}</span>
									</div>

									<div class="remark">{{ element.remark }}</div>

									<div class="f">
										<template v-if="element.status">
											<span class="date">{{
												element.nextRunTime || "..."
											}}</span>
											<span class="start">进行中</span>
										</template>

										<template v-else>
											<span>...</span>
											<span class="stop">已停止</span>
										</template>
									</div>

									<div class="op">
										<div
											v-if="element.status === 0"
											class="op-item"
											@click="start(element)"
										>
											<el-icon><video-play /></el-icon>
											<span>开始</span>
										</div>

										<div
											v-else
											v-permission="perm.stop"
											class="op-item"
											@click="stop(element)"
										>
											<el-icon><video-pause /></el-icon>
											<span>暂停</span>
										</div>

										<div
											v-permission="{
												and: [perm.update, perm.info]
											}"
											class="op-item"
											@click="edit(element)"
										>
											<el-icon><edit-pen /></el-icon>
											<span>编辑</span>
										</div>

										<div
											v-permission="perm.log"
											class="op-item"
											@click="findLog(element)"
										>
											<el-icon><tickets /></el-icon>
											<span>查看日志</span>
										</div>
									</div>
								</li>
							</template>

							<template #header>
								<div v-if="list[index].list.length == 0" class="empty">
									暂无数据
								</div>
							</template>
						</draggable>

						<el-button
							v-if="item.pagination.total >= item.pagination.size"
							class="more"
							text
							@click="moreTask(index)"
							>查看更多</el-button
						>
					</div>

					<div class="footer">
						<button v-permission="perm.add" class="btn-add" @click="edit(item.params)">
							<el-icon><plus /></el-icon>
						</button>
					</div>
				</div>

				<!-- 日志 -->
				<div v-permission="perm.log" class="block _log">
					<div class="header">
						<!-- 标题 -->
						<span class="label">日志</span>
						<!-- 数量 -->
						<span class="num">({{ logs.pagination.total }})</span>
						<span class="flex1"></span>

						<!-- 是否异常 -->
						<el-checkbox-group
							v-model="logs.filters.status"
							class="status"
							@change="filterLog"
						>
							<el-checkbox :label="0">异常</el-checkbox>
						</el-checkbox-group>

						<!-- 操作按钮 -->
						<ul class="op-btn">
							<li @click="refreshLog({ page: 1 })">
								<el-icon><refresh /></el-icon>
								<span>刷新</span>
							</li>

							<li v-if="logs.current" class="_current-log" @click="allLog">
								<span>{{ logs.current.name }}</span>
								<el-icon><close /></el-icon>
							</li>
						</ul>
					</div>

					<div
						v-loading="logs.loading"
						class="container"
						element-loading-text="拼命加载中"
					>
						<ul
							:ref="setRefs('log-scroller')"
							class="scroller1"
							:infinite-scroll-disabled="logs.list.length == logs.pagination.total"
							v-infinite-scroll="moreLog"
						>
							<li
								v-for="(item, index) in logs.list"
								:key="index"
								:class="{ _error: item.status == 0 }"
								@click="expandLog(item)"
							>
								<div class="h">
									<span class="name"
										>{{ Number(index) + 1 }} · {{ item.taskName }}</span
									>
								</div>

								<div class="remark" :class="{ _ellipsis: !item._expand }">
									{{ item.detail || "..." }}
								</div>

								<div class="f">
									<span>执行时间：{{ item.createTime }}</span>
								</div>
							</li>

							<div class="empty" v-if="logs.list.length == 0">暂无数据</div>
						</ul>
					</div>
				</div>
			</div>
		</el-scrollbar>

		<!-- 表单 -->
		<cl-form ref="Form" />
	</div>
</template>

<script lang="ts" name="task" setup>
import { computed, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Draggable from "vuedraggable/src/vuedraggable";
import { checkPerm } from "/$/base";
import { useCool } from "/@/cool";
import { ContextMenu, useForm } from "@cool-vue/crud";
import {
	Refresh,
	CirclePlus,
	VideoPlay,
	VideoPause,
	Plus,
	Tickets,
	EditPen,
	Close
} from "@element-plus/icons-vue";

const { refs, setRefs, service } = useCool();

// 任务列表
const list = reactive<any[]>([
	{
		key: "sys",
		label: "系统任务",
		icon: "el-icon-s-tools",
		list: [],
		loading: false,
		params: {
			type: 0,
			status: 1
		},
		pagination: {
			size: 10,
			page: 1,
			total: 0
		}
	},
	{
		key: "user",
		label: "用户自定义任务",
		icon: "el-icon-user-solid",
		list: [],
		loading: false,
		params: {
			type: 1,
			status: 1
		},
		pagination: {
			size: 10,
			page: 1,
			total: 0
		}
	},
	{
		key: "stop",
		label: "已停止任务",
		list: [],
		loading: false,
		params: {
			type: null,
			status: 0
		},
		pagination: {
			size: 10,
			page: 1,
			total: 0
		}
	}
]);

// 日志列表
const logs = reactive<any>({
	loading: false,
	list: [],
	pagination: {
		size: 10,
		page: 1
	},
	params: {},
	filters: {
		status: []
	},
	current: null
});

// 拖动选项
const drag = reactive({
	options: {
		group: "Task",
		animation: 300,
		ghostClass: "Ghost",
		dragClass: "Drag",
		draggable: "._drag"
	}
});

// 权限
const perm: any = computed(() => service.task.info.permission);

// 更多列表
function moreList(res: any, { list, pagination }: any) {
	if (!res) {
		return;
	}
	const { page, size } = res.pagination;
	const len = res.list.length;
	const max = list.length;

	if (page == 1) {
		list.splice(0, max, ...res.list);
	} else {
		const start = max - (max % size);
		const end = start + len;

		list.splice(start, end, ...res.list);
	}

	if (len == size) {
		res.pagination.page += 1;
	}

	Object.assign(pagination, res.pagination);

	return page != 1;
}

// 刷新任务
function refreshTask(params?: any, options?: any) {
	const { index, more } = options || {};
	const arr = index === undefined || index === null ? list.map((e, i) => i) : [index];

	arr.forEach(async (k) => {
		const item = list[k];

		Object.assign(item.params, {
			...item.pagination,
			...params
		});

		item.loading = true;

		const res = await service.task.info.page(item.params);

		moreList(res, item);

		if (!more) {
			refs[`${item.key}-scroller`].scroll({
				top: 0,
				behavior: "smooth"
			});
		}

		item.loading = false;
	});
}

// 编辑任务
const Form = useForm();

async function edit(params: any) {
	const { id, type } = params || {};

	let info: any = {
		type,
		service: "",
		name: "",
		cron: ""
	};

	if (id) {
		info = await service.task.info.info({ id });
	}

	if (info.every) {
		info.every /= 1000;
	}

	if (!info.limit) {
		info.limit = undefined;
	}

	Form.value?.open({
		title: "编辑任务",
		width: "600px",
		props: {
			labelWidth: "80px"
		},
		items: [
			{
				label: "名称",
				prop: "name",
				component: {
					name: "el-input",
					props: {
						placeholder: "请输入名称"
					}
				},
				rules: {
					required: true,
					message: "名称不能为空"
				}
			},
			{
				label: "类型",
				prop: "taskType",
				value: 0,
				component: {
					name: "el-select",
					options: [
						{
							label: "cron",
							value: 0
						},
						{
							label: "时间间隔",
							value: 1
						}
					],
					props: {
						onChange(v: number) {
							if (v == 0) {
								Form.value?.setForm("every", undefined);
							} else {
								Form.value?.setForm("cron", undefined);
							}
						}
					}
				}
			},
			{
				label: "cron",
				prop: "cron",
				hidden: ({ scope }) => scope.taskType == 1,
				component: {
					name: "el-input",
					props: {
						placeholder: "* * * * * *"
					}
				},
				rules: {
					required: true,
					message: "cron不能为空"
				}
			},
			{
				label: "间隔(秒)",
				prop: "every",
				hidden: ({ scope }) => scope.taskType == 0,
				component: {
					name: "el-input-number",
					props: {
						min: 1,
						max: 100000000
					}
				},
				rules: {
					required: true,
					message: "执行间隔不能为空"
				}
			},
			{
				label: "service",
				prop: "service",
				component: {
					name: "el-input",
					props: {
						placeholder: "taskDemoService.test([1, 2])"
					}
				}
			},
			{
				label: "开始时间",
				prop: "startDate",
				hidden: ({ scope }) => scope.taskType == 1,
				component: {
					name: "el-date-picker",
					props: {
						type: "datetime",
						"value-format": "YYYY-MM-DD HH:mm:ss"
					}
				}
			},
			{
				label: "备注",
				prop: "remark",
				component: {
					name: "el-input",
					props: {
						type: "textarea"
					}
				}
			},
			{
				label: "状态",
				prop: "status",
				value: 0,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "停止",
							value: 0
						},
						{
							label: "运行",
							value: 1
						}
					]
				}
			}
		],
		form: {
			...info
		},
		on: {
			submit: (data, { close, done }) => {
				if (!data.limit) {
					data.limit = null;
				}

				service.task.info[id ? "update" : "add"]({
					...info,
					...data,
					every: data.every * 1000
				})
					.then(() => {
						refreshTask();

						ElMessage.success("保存成功");
						close();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

// 删除任务
function remove({ id }: any) {
	ElMessageBox.confirm("此操作将永久删除该任务，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			service.task.info.delete({ ids: [id] }).then(() => {
				refreshTask();
			});
		})
		.catch(() => null);
}

// 开始任务
function start({ id, type }: any) {
	service.task.info
		.start({ id, type })
		.then(() => {
			refreshTask();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 停止任务
function stop({ id }: any) {
	service.task.info
		.stop({ id })
		.then(() => {
			refreshTask();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 任务执行一次
function once({ id }: any) {
	service.task.info
		.once({ id })
		.then(() => {
			refreshTask();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 展开
function expandLog(e: any) {
	e._expand = !e._expand;
}

// 任务拖动
function onDragEnd({ to, item }: any) {
	const status = to.getAttribute("data-status");
	const type = to.getAttribute("data-type");
	const id = item.getAttribute("data-id");

	if (status == 0) {
		stop({ id });
	}

	if (status == 1) {
		start({ id, type });
	}
}

// 刷新日志
async function refreshLog(newParams: any, options?: any) {
	if (logs.loading) {
		return false;
	}

	if (!checkPerm(perm.value.log)) {
		return false;
	}

	const { params, pagination } = logs;
	const { more } = options || {};

	Object.assign(params, {
		...pagination,
		...newParams
	});

	logs.loading = true;

	const res = await service.task.info.log(params);

	moreList(res, logs);

	if (!more) {
		refs["log-scroller"].scroll({
			top: 0,
			behavior: "smooth"
		});
	}

	logs.loading = false;
}

// 更多日志
function moreLog() {
	refreshLog(null, { more: true });
}

// 查看任务对应的日志
function findLog(e: any) {
	logs.current = e;
	refreshLog({ page: 1, id: e.id });
}

// 所有日志
function allLog() {
	logs.current = null;
	refreshLog({ page: 1, id: null });
}

// 过滤日志
function filterLog([v]: any) {
	refreshLog({ page: 1, status: v === undefined ? 1 : 0 });
}

// 右键菜单
function openCM(e: any, { id, status, type, name }: any) {
	const menus: ClContextMenu.Item[] = [
		{
			label: "立即执行",
			perm: ["once"],
			callback(done) {
				once({ id });
				done();
			}
		},
		{
			label: "编辑",
			perm: ["update", "info"],
			callback(done) {
				edit({ id, type });
				done();
			}
		},
		{
			label: "删除",
			perm: ["delete"],
			callback(done) {
				remove({ id });
				done();
			}
		},
		{
			label: "查看日志",
			perm: ["log"],
			callback(done) {
				findLog({ id, name });
				done();
			}
		}
	];

	if (status == 1) {
		menus.splice(1, 0, {
			label: "暂停",
			perm: ["stop"],
			callback(done) {
				stop({ id, type });
				done();
			}
		});
	} else {
		menus.splice(1, 0, {
			label: "开始",
			perm: ["start"],
			callback(done) {
				start({ id, type });
				done();
			}
		});
	}

	ContextMenu.open(e, {
		list: menus.filter((e) => {
			return checkPerm({
				and: e.perm.map((a: any) => perm.value[a])
			});
		})
	});

	return false;
}

// 更多任务
function moreTask(index: number) {
	refreshTask(null, { index, more: true });
}

onMounted(() => {
	refreshTask({ page: 1 });
});
</script>

<style lang="scss" scoped>
.Ghost {
	opacity: 0.7;
}

.Drag {
	border: 1px dashed #000 !important;
	background: #fff !important;
}

.view-task {
	height: 100%;

	.box {
		display: flex;
		height: 100%;
	}

	.block {
		height: calc(100% - 10px);
		width: 400px;
		margin-right: 10px;
		flex-shrink: 0;

		&:last-child {
			margin-right: 0;
		}

		.header {
			display: flex;
			align-items: center;
			height: 40px;
			background-color: #f0f0f0;
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
			position: relative;
			top: 5px;
			z-index: 1;
			padding: 0 10px 5px 10px;

			i {
				font-size: 18px;
			}

			.label {
				font-size: 12px;
				margin: 0 5px;
				letter-spacing: 0.5px;
			}

			.num {
				font-size: 12px;
			}

			.label,
			.num {
				color: #000;
			}

			.flex1 {
				flex: 1;
			}

			.op-btn {
				display: flex;

				li {
					display: flex;
					align-items: center;
					list-style: none;
					cursor: pointer;
					height: 25px;
					padding: 0 10px;
					background-color: var(--el-bg-color);
					border-radius: 5px;
					margin-left: 5px;

					&:hover {
						background-color: var(--color-primary);
						color: #fff;
					}

					i {
						font-size: 13px;
						margin-right: 2px;
					}

					span {
						font-size: 12px;
					}
				}
			}
		}

		.container {
			max-height: calc(100% - 90px);
			overflow-y: auto;
			margin-bottom: 5px;
			z-index: 2;
			position: relative;

			ul {
				li {
					list-style: none;
					background-color: var(--el-bg-color);
					border-radius: 5px;
					margin-bottom: 5px;
					padding: 10px 15px;
					font-size: 14px;
					letter-spacing: 0.5px;
					border: 1px solid #f7f7f7;

					&:last-child {
						margin-bottom: 0;
					}

					&._drag {
						cursor: pointer;
					}

					&:hover {
						.op {
							height: 30px;
						}
					}

					.h {
						display: flex;
						align-items: center;
						font-size: 14px;
						margin-bottom: 10px;

						.type {
							font-size: 12px;
							border-radius: 3px;
							padding: 1px 2px;
							margin-right: 5px;

							&._warning {
								background-color: #e6a23c;
								color: #fff;
							}
						}
					}

					.remark {
						font-size: 12px;
						color: #666;
						margin-bottom: 20px;
					}

					.f {
						display: flex;
						align-items: center;
						justify-content: space-between;
						position: relative;

						.date {
							font-size: 12px;
							color: #fff;
							background-color: #2f3447;
							border-radius: 2px;
							margin-left: 40px;
							padding: 1px 3px;

							&::before {
								content: "NEXT";
								position: absolute;
								left: 0;
								top: 1px;
								color: var(--color-primary);
							}
						}

						.start,
						.stop {
							display: flex;
							align-items: center;
							font-size: 12px;
							margin-left: 30px;
							position: relative;

							&::before {
								content: "";
								display: block;
								height: 6px;
								width: 6px;
								border-radius: 6px;
								position: absolute;
								left: -15px;
							}
						}

						.start {
							color: #67c23a;

							&::before {
								background-color: #67c23a;
							}
						}

						.stop {
							color: #f56c6c;

							&::before {
								background-color: #f56c6c;
							}
						}
					}

					.op {
						display: flex;
						height: 0;
						margin-top: 15px;
						transition: height 0.3s;
						overflow: hidden;

						&-item {
							flex: 1;
							height: 30px;
							display: flex;
							justify-content: center;
							align-items: center;

							&:hover {
								background-color: #f7f7f7;
							}

							span {
								font-size: 12px;
								color: #666;
							}

							i {
								font-size: 16px;
								margin-right: 5px;
							}
						}
					}

					&._error {
						background-color: #f56c6c;
						color: #fff;

						.remark {
							color: #fff !important;
						}
					}
				}
			}

			.empty {
				text-align: center;
				font-size: 13px;
				padding: 20px;
				border: 1px solid #f7f7f7;
				border-radius: 5px;
				background-color: var(--el-bg-color);
			}

			.more {
				display: block;
				margin: 10px auto;
			}
		}

		.footer {
			height: 36px;

			.btn-add {
				height: 34px;
				width: 100%;
				border-radius: 3px;
				border: 0;
				background-color: #fff;
				cursor: pointer;

				i {
					font-size: 16px;
					color: #999;
				}

				&:hover {
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	.block._stop {
		.header {
			.add-btn {
				display: none;
			}
		}

		.container {
			max-height: calc(100% - 50px);
		}

		.footer {
			display: none;
		}
	}

	.block._log {
		.header {
			.status {
				.el-checkbox {
					margin-right: 10px;
				}
			}

			.op-btn {
				li {
					display: flex;
					align-items: center;

					&._current-log {
						span {
							display: block;
							max-width: 100px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						i {
							margin-left: 2px;
						}

						&:hover {
							background-color: #f56c6c;
							color: #fff;
						}
					}
				}
			}
		}

		.container {
			height: calc(100% - 50px);
			max-height: calc(100% - 50px);

			ul {
				height: 100%;

				li {
					.remark {
						color: #999;

						&._ellipsis {
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						}
					}

					.f {
						font-size: 12px;
					}

					&:hover {
						.remark {
							color: var(--color-primary);
						}
					}
				}
			}
		}
	}
}
</style>
