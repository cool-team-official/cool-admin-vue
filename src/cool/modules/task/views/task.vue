<template>
	<div class="system-task">
		<div class="box scroller1">
			<!-- 系统，用户自定义，已停止 -->
			<div class="block" :class="[`_${item.key}`]" v-for="(item, index) in list" :key="index">
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
						<li v-if="item.loading">
							<i class="el-icon-loading"></i>
						</li>

						<li
							v-else
							@click="refreshTask({ page: 1 })"
							class="refresh-btn"
							v-permission="perm.delete"
						>
							<i class="el-icon-refresh"></i>
							<span>刷新</span>
						</li>

						<li @click="edit(item.params)" class="add-btn" v-permission="perm.add">
							<i class="el-icon-plus"></i>
							<span>添加</span>
						</li>
					</ul>
				</div>

				<div class="container scroller1" :ref="setRefs(`${item.key}-scroller`)">
					<draggable
						v-model="list[index].list"
						v-bind="drag.options"
						tag="ul"
						item-key="id"
						:data-type="item.params.type"
						:data-status="item.params.status"
						@end="e => onDragEnd(e, item)"
					>
						<template #item="{element}">
							<li
								:key="element.id"
								:data-id="element.id"
								@contextmenu.stop.prevent="openCM($event, element)"
								class="_drag"
							>
								<div class="h">
									<span class="type _warning" v-show="element.status === 0">
										{{ element.type === 0 ? "系统" : "用户" }}
									</span>
									<span class="name">{{ element.name }}</span>
								</div>

								<div class="remark">{{ element.remark }}</div>

								<div class="f">
									<template v-if="element.status">
										<span class="date">{{ element.nextRunTime || "..." }}</span>
										<span class="start">进行中</span>
									</template>

									<template v-else>
										<span>...</span>
										<span class="stop">已停止</span>
									</template>
								</div>

								<div class="op">
									<div
										class="op-item"
										v-if="element.status === 0"
										@click="start(element)"
									>
										<i class="el-icon-video-play"></i>
										<span>开始</span>
									</div>

									<div
										class="op-item"
										v-else
										@click="stop(element)"
										v-permission="perm.stop"
									>
										<i class="el-icon-video-pause"></i>
										<span>暂停</span>
									</div>

									<div
										class="op-item"
										@click="edit(element)"
										v-permission="{
											and: [perm.update, perm.info]
										}"
									>
										<i class="el-icon-edit"></i>
										<span>编辑</span>
									</div>

									<div
										class="op-item"
										@click="findLog(element)"
										v-permission="perm.log"
									>
										<i class="el-icon-tickets"></i>
										<span>查看日志</span>
									</div>
								</div>
							</li>
						</template>

						<template #header>
							<div class="empty" v-if="list[index].list.length == 0">
								暂无数据
							</div>
						</template>
					</draggable>

					<el-button
						class="more"
						type="text"
						size="mini"
						@click="moreTask(index, item)"
						v-if="item.pagination.total >= item.pagination.size"
						>查看更多</el-button
					>
				</div>

				<div class="footer">
					<button class="btn-add" @click="edit(item.params)" v-permission="perm.add">
						<i class="el-icon-plus"></i>
					</button>
				</div>
			</div>

			<!-- 日志 -->
			<div class="block _log" v-permission="perm.log">
				<div class="header">
					<!-- 标题 -->
					<span class="label">日志</span>
					<!-- 数量 -->
					<span class="num">({{ logs.pagination.total }})</span>
					<span class="flex1"></span>

					<!-- 是否异常 -->
					<el-checkbox-group
						class="status"
						v-model="logs.filters.status"
						@change="filterLog"
					>
						<el-checkbox :label="0">异常</el-checkbox>
					</el-checkbox-group>

					<!-- 操作按钮 -->
					<ul class="op-btn">
						<li @click="refreshLog({ page: 1 })">
							<i class="el-icon-refresh"></i>
							<span>刷新</span>
						</li>

						<li v-if="logs.current" class="_current-log" @click="allLog">
							<span>{{ logs.current.name }}</span>
							<i class="el-icon-close"></i>
						</li>
					</ul>
				</div>

				<div class="container" v-loading="logs.loading" element-loading-text="拼命加载中">
					<ul
						class="scroller1"
						:ref="setRefs('log-scroller')"
						v-infinite-scroll="moreLog"
					>
						<li
							v-for="(item, index) in logs.list"
							:key="index"
							:class="{ _error: item.status == 0 }"
							@click="expandLog(item)"
						>
							<div class="h">
								<span class="name">{{ index + 1 }} · {{ item.taskName }}</span>
							</div>

							<div class="remark" :class="{ _ellipsis: !item._expand }">
								{{ item.detail || "..." }}
							</div>

							<div class="f">
								<span>执行时间：{{ item.createTime }}</span>
							</div>
						</li>

						<li v-if="logs.list.length == 0">
							<div class="empty">暂无数据</div>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 表单 -->
		<cl-form :ref="setRefs('form')">
			<template #slot-cron="{ scope }">
				<cron v-model="scope.cron" />
			</template>
		</cl-form>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import Draggable from "vuedraggable";
import { checkPerm } from "@/cool/modules/base";
import { ContextMenu } from "@/crud";
import Cron from "../components/cron";
import { useRefs } from "@/core";

export default defineComponent({
	name: "task",

	components: {
		Draggable,
		Cron
	},

	setup() {
		const { refs, setRefs } = useRefs();
		const $service = inject<any>("service");

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
		const drag = reactive<any>({
			options: {
				group: "Task",
				animation: 300,
				ghostClass: "Ghost",
				dragClass: "Drag",
				draggable: "._drag"
			}
		});

		// 权限
		const perm: any = computed(() => $service.task.info.permission);

		// 更多列表
		function moreList(res: any, { list, pagination }: any) {
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

			arr.forEach(async k => {
				const item = list[k];

				Object.assign(item.params, {
					...item.pagination,
					...params
				});

				item.loading = true;

				const res = await $service.task.info.page(item.params);

				moreList(res, item);

				if (!more) {
					refs.value[`${item.key}-scroller`].scroll(0, 0);
				}

				item.loading = false;
			});
		}

		// 编辑任务
		async function edit(params: any) {
			const { id, type } = params || {};

			let info: any = {
				type
			};

			if (id) {
				info = await $service.task.info.info({ id });
			}

			if (info.every) {
				info.every /= 1000;
			}

			if (!info.limit) {
				info.limit = undefined;
			}

			const { setForm } = refs.value.form.open({
				title: `编辑任务`,
				width: "600px",
				props: {
					labelWidth: "80px"
				},
				items: [
					{
						label: "名称",
						prop: "name",
						value: info.name,
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
						value: info.taskType || 0,
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
							on: {
								change: (v: number) => {
									if (v == 0) {
										setForm("limit", undefined);
										setForm("every", undefined);
									} else {
										setForm("cron", undefined);
									}
								}
							}
						}
					},
					{
						label: "cron",
						prop: "cron",
						hidden: ({ scope }: any) => {
							return scope.taskType == 1;
						},
						value: info.cron,
						component: {
							name: "slot-cron"
						},
						rules: {
							required: true,
							message: "cron不能为空"
						}
					},
					{
						label: "次数",
						prop: "limit",
						value: info.limit,
						hidden: ({ scope }: any) => {
							return scope.taskType == 0;
						},
						component: {
							name: "el-input-number",
							props: {
								min: 1,
								max: 10000
							}
						}
					},
					{
						label: "间隔(秒)",
						prop: "every",
						value: info.every,
						hidden: ({ scope }: any) => {
							return scope.taskType == 0;
						},
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
						value: info.service,
						component: {
							name: "el-input",
							props: {
								placeholder: "sys.test.add(params)"
							}
						}
					},
					{
						label: "开始时间",
						prop: "startDate",
						value: info.startDate || "",
						component: {
							name: "el-date-picker",
							props: {
								type: "datetime"
							}
						}
					},
					{
						label: "结束时间",
						prop: "endDate",
						value: info.endDate || "",
						component: {
							name: "el-date-picker",
							props: {
								type: "datetime"
							}
						}
					},
					{
						label: "备注",
						prop: "remark",
						value: info.remark,
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
						value: info.status === 0 ? 0 : 1,
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
				on: {
					submit: (data: any, { close, done }: any) => {
						if (!data.limit) {
							data.limit = null;
						}

						$service.task.info[id ? "update" : "add"]({
							...info,
							...data,
							every: data.every * 1000
						})
							.then(() => {
								refreshTask();

								ElMessage.success("保存成功");
								close();
							})
							.catch((err: string) => {
								ElMessage.error(err);
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
					$service.task.info.delete({ ids: [id] }).then(() => {
						refreshTask();
					});
				})
				.catch(() => null);
		}

		// 开始任务
		function start({ id, type }: any) {
			$service.task.info
				.start({ id, type })
				.then(() => {
					refreshTask();
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		// 停止任务
		function stop({ id }: any) {
			$service.task.info
				.stop({ id })
				.then(() => {
					refreshTask();
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		// 任务执行一次
		function once({ id }: any) {
			$service.task.info
				.once({ id })
				.then(() => {
					refreshTask();
				})
				.catch((err: string) => {
					ElMessage.error(err);
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

			const res = await $service.task.info.log(params);

			moreList(res, logs);

			if (!more) {
				refs.value["log-scroller"].scroll(0, 0);
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
			const menus = [
				{
					label: "立即执行",
					perm: ["once"],
					"suffix-icon": "el-icon-video-play",
					callback: (_: any, close: Function) => {
						once({ id });
						close();
					}
				},
				{
					label: "编辑",
					perm: ["update", "info"],
					"suffix-icon": "el-icon-edit",
					callback: (_: any, close: Function) => {
						edit({ id, type });
						close();
					}
				},
				{
					label: "删除",
					perm: ["delete"],
					"suffix-icon": "el-icon-delete",
					callback: (_: any, close: Function) => {
						remove({ id });
						close();
					}
				},
				{
					label: "查看日志",
					perm: ["log"],
					"suffix-icon": "el-icon-tickets",
					callback: (_: any, close: Function) => {
						findLog({ id, name });
						close();
					}
				}
			];

			if (status == 1) {
				menus.splice(1, 0, {
					label: "暂停",
					perm: ["stop"],
					"suffix-icon": "el-icon-video-pause",
					callback: (_: any, close: Function) => {
						stop({ id, type });
						close();
					}
				});
			} else {
				menus.splice(1, 0, {
					label: "开始",
					perm: ["start"],
					"suffix-icon": "el-icon-video-play",
					callback: (_: any, close: Function) => {
						start({ id, type });
						close();
					}
				});
			}

			ContextMenu.open(e, {
				list: menus.filter(e => {
					return checkPerm({
						and: e.perm.map(a => perm.value[a])
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

		return {
			refs,
			list,
			logs,
			drag,
			perm,
			setRefs,
			onDragEnd,
			openCM,
			edit,
			remove,
			start,
			stop,
			once,
			expandLog,
			refreshTask,
			moreTask,
			refreshLog,
			moreLog,
			findLog,
			allLog,
			filterLog,
			moreList
		};
	}
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

.system-task {
	.box {
		display: flex;
		height: 100%;
		overflow-x: auto;
	}

	.block {
		height: 100%;
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
					padding: 2px 10px;
					background-color: #fff;
					border-radius: 3px;
					margin-left: 5px;

					&:hover {
						background-color: #dedede;
						color: #444;
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
					background-color: #fff;
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
								background-color: $color-warning;
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
								color: #222;
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
						background-color: $color-danger;
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
				color: #666;
				background-color: #fff;
				padding: 20px;
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
					height: 20px;

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
							background-color: $color-danger;
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
							color: #444;
						}
					}
				}
			}
		}
	}
}
</style>
