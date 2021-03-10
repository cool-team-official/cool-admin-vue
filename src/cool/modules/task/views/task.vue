<template>
	<div class="system-task">
		<el-row class="box scroller1" type="flex" :gutter="10">
			<!-- 系统，用户自定义，已停止 -->
			<el-col v-for="(item, index) in list" :key="index">
				<div class="block" :class="[`_${item.key}`]">
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

					<div class="container scroller1">
						<draggable
							v-model="list[index].list"
							v-bind="drag.options"
							tag="ul"
							:data-type="item.params.type"
							:data-status="item.params.status"
							@end="e => onDragEnd(e, item)"
						>
							<li
								v-for="item2 in list[index].list"
								:key="item2.id"
								:data-id="item2.id"
								@contextmenu.stop.prevent="openCM($event, item2)"
								class="_drag"
							>
								<div class="h">
									<span class="type _warning" v-show="item2.status === 0">
										{{ item2.type | task_type }}
									</span>
									<span class="name">{{ item2.name }}</span>
								</div>

								<div class="remark">{{ item2.remark }}</div>

								<div class="f">
									<template v-if="item2.status">
										<span class="date">{{ item2.nextRunTime || "..." }}</span>
										<span class="start">进行中</span>
									</template>

									<template v-else>
										<span>...</span>
										<span class="stop">已停止</span>
									</template>
								</div>

								<el-row type="flex" class="op">
									<el-col v-if="item2.status === 0" @click.native="start(item2)">
										<i class="el-icon-video-play"></i>
										<span>开始</span>
									</el-col>

									<el-col
										v-else
										@click.native="stop(item2)"
										v-permission="perm.stop"
									>
										<i class="el-icon-video-pause"></i>
										<span>暂停</span>
									</el-col>

									<el-col
										@click.native="edit(item2)"
										v-permission="{
											and: [perm.update, perm.info]
										}"
									>
										<i class="el-icon-edit"></i>
										<span>编辑</span>
									</el-col>

									<el-col @click.native="findLog(item2)" v-permission="perm.log">
										<i class="el-icon-tickets"></i>
										<span>查看日志</span>
									</el-col>
								</el-row>
							</li>

							<li v-if="list[index].list.length == 0">
								<div class="empty">暂无数据</div>
							</li>
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
			</el-col>

			<!-- 日志 -->
			<el-col v-permission="perm.log">
				<div class="block _log">
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

					<div
						class="container"
						v-loading="logs.loading"
						element-loading-text="拼命加载中"
					>
						<ul class="scroller1" v-infinite-scroll="moreLog">
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
			</el-col>
		</el-row>
	</div>
</template>

<script>
import draggable from "vuedraggable";
import { checkPerm } from "@/cool/modules/base";
import { Form, ContextMenu } from "cl-admin-crud";
import Cron from "../components/cron";

export default {
	name: "system-task",

	components: {
		draggable
	},

	data() {
		return {
			list: [
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
			],
			logs: {
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
			},
			drag: {
				options: {
					group: "Task",
					animation: 300,
					ghostClass: "Ghost",
					dragClass: "Drag",
					draggable: "._drag"
				}
			}
		};
	},

	filters: {
		task_type(i) {
			return i === 0 ? "系统" : "用户";
		}
	},

	mounted() {
		this.refreshTask({ page: 1 });
	},

	computed: {
		perm() {
			return this.$service.task.info.permission;
		}
	},

	methods: {
		// 任务拖动
		onDragEnd({ to, item }) {
			const status = to.getAttribute("data-status");
			const type = to.getAttribute("data-type");
			const id = item.getAttribute("data-id");

			if (status == 0) {
				this.stop({ id });
			}

			if (status == 1) {
				this.start({ id, type });
			}
		},

		// 右键菜单
		openCM(e, { id, status, type, name }) {
			let menus = [
				{
					label: "立即执行",
					perm: ["once"],
					"suffix-icon": "el-icon-video-play",
					callback: (_, close) => {
						this.once({ id });
						close();
					}
				},
				{
					label: "编辑",
					perm: ["update", "info"],
					"suffix-icon": "el-icon-edit",
					callback: (_, close) => {
						this.edit({ id, type });
						close();
					}
				},
				{
					label: "删除",
					perm: ["delete"],
					"suffix-icon": "el-icon-delete",
					callback: (_, close) => {
						this.delete({ id });
						close();
					}
				},
				{
					label: "查看日志",
					perm: ["log"],
					"suffix-icon": "el-icon-tickets",
					callback: (_, close) => {
						this.findLog({ id, name });
						close();
					}
				}
			];

			if (status == 1) {
				menus.splice(1, 0, {
					label: "暂停",
					perm: ["stop"],
					"suffix-icon": "el-icon-video-pause",
					callback: (_, close) => {
						this.stop({ id, type });
						close();
					}
				});
			} else {
				menus.splice(1, 0, {
					label: "开始",
					perm: ["start"],
					"suffix-icon": "el-icon-video-play",
					callback: (_, close) => {
						this.start({ id, type });
						close();
					}
				});
			}

			ContextMenu.open(e, {
				list: menus.filter(e => {
					return checkPerm({
						and: e.perm.map(a => this.perm[a])
					});
				})
			});

			return false;
		},

		// 编辑任务
		async edit(params) {
			const { id, type } = params || {};

			let info = {
				type
			};

			if (id) {
				info = await this.$service.task.info.info({ id });
			}

			if (info.every) {
				info.every /= 1000;
			}

			if (!info.limit) {
				info.limit = undefined;
			}

			const { setForm } = Form.open({
				title: `编辑任务`,
				width: "600px",
				props: {
					"label-width": "80px"
				},
				items: [
					{
						label: "名称",
						prop: "name",
						value: info.name,
						component: {
							name: "el-input",
							attrs: {
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
								change: v => {
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
						hidden: ({ scope }) => {
							return scope.taskType == 1;
						},
						value: info.cron,
						component: Cron,
						rules: {
							required: true,
							message: "cron不能为空"
						}
					},
					{
						label: "次数",
						prop: "limit",
						value: info.limit,
						hidden: ({ scope }) => {
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
						hidden: ({ scope }) => {
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
							attrs: {
								placeholder: "sys.test.add(params)"
							}
						}
					},
					{
						label: "开始时间",
						prop: "startDate",
						value: info.startDate,
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
						value: info.endDate,
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
					submit: (data, { close, done }) => {
						if (!data.limit) {
							data.limit = null;
						}

						this.$service.task.info[id ? "update" : "add"]({
							...info,
							...data,
							every: data.every * 1000
						})
							.then(() => {
								this.refreshTask();

								this.$message.success("保存成功");
								close();
							})
							.catch(err => {
								this.$message.error(err);
								done();
							});
					}
				}
			});
		},

		// 删除任务
		delete({ id }) {
			this.$confirm("此操作将永久删除该任务，是否继续？", "提示", {
				type: "warning"
			})
				.then(() => {
					this.$service.task.info.delete({ ids: [id] }).then(() => {
						this.refreshTask();
					});
				})
				.catch(() => {});
		},

		// 开始任务
		start({ id, type }) {
			this.$service.task.info
				.start({ id, type })
				.then(() => {
					this.refreshTask();
				})
				.catch(err => {
					this.$message.error(err);
				});
		},

		// 停止任务
		stop({ id }) {
			this.$service.task.info
				.stop({ id })
				.then(() => {
					this.refreshTask();
				})
				.catch(err => {
					this.$message.error(err);
				});
		},

		// 任务执行一次
		once({ id }) {
			this.$service.task.info
				.once({ id })
				.then(() => {
					this.refreshTask();
				})
				.catch(err => {
					this.$message.error(err);
				});
		},

		expandLog(e) {
			this.$set(e, "_expand", !e._expand);
		},

		// 刷新任务
		refreshTask(params, options) {
			const { index, more } = options || {};
			const arr =
				index === undefined || index === null ? this.list.map((e, i) => i) : [index];

			arr.forEach(async k => {
				let item = this.list[k];

				Object.assign(item.params, {
					...item.pagination,
					...params
				});

				this.$set(item, "loading", true);

				let res = await this.$service.task.info.page(item.params);

				this.moreList(res, item);

				if (!more) {
					this.$el.querySelector(`.block._${item.key} .container`).scroll(0, 0);
				}

				item.loading = false;
			});
		},

		// 更多任务
		moreTask(index) {
			this.refreshTask(null, { index, more: true });
		},

		// 刷新日志
		async refreshLog(newParams, options) {
			if (this.logs.loading) {
				return false;
			}

			if (!checkPerm(this.perm.log)) {
				return false;
			}

			const { params, pagination } = this.logs;
			const { more } = options || {};

			Object.assign(params, {
				...pagination,
				...newParams
			});

			this.logs.loading = true;

			let res = await this.$service.task.info.log(params);

			this.moreList(res, this.logs);

			if (!more) {
				this.$el.querySelector(".block._log .container ul").scroll(0, 0);
			}

			this.logs.loading = false;
		},

		// 更多日志
		moreLog() {
			this.refreshLog(null, { more: true });
		},

		// 查看任务对应的日志
		findLog(e) {
			this.logs.current = e;
			this.refreshLog({ page: 1, id: e.id });
		},

		// 所有日志
		allLog() {
			this.logs.current = null;
			this.refreshLog({ page: 1, id: null });
		},

		// 过滤日志
		filterLog([v]) {
			this.refreshLog({ page: 1, status: v === undefined ? 1 : 0 });
		},

		moreList(res, { list, pagination }) {
			const { page, size } = res.pagination;
			const len = res.list.length;
			const max = list.length;

			if (page == 1) {
				list.splice(0, max, ...res.list);
			} else {
				let start = max - (max % size);
				let end = start + len;

				list.splice(start, end, ...res.list);
			}

			if (len == size) {
				res.pagination.page += 1;
			}

			Object.assign(pagination, res.pagination);

			return page != 1;
		}
	}
};
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
		height: 100%;
		overflow-x: auto;

		.el-col {
			height: 100%;
			width: 413px;
		}
	}

	.block {
		height: 100%;
		width: 400px;

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
			background-color: #f7f7f7;

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

					.empty {
						text-align: center;
						font-size: 13px;
						color: #666;
						margin: 10px 0;
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
						height: 0;
						margin-top: 15px;
						transition: height 0.3s;
						overflow: hidden;

						.el-col {
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
							i {
								color: $color-danger;
							}
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
