<template>
	<div class="task-list" :class="{ 'is-mini': browser.isMini }">
		<div class="list">
			<div
				v-for="(item, index) in list"
				:key="index"
				class="item"
				@click="edit(item)"
				@contextmenu="
					(e) => {
						onContextMenu(e, item);
					}
				"
			>
				<p class="name">{{ item.name }}</p>
				<p class="row">
					<span>执行服务</span>
					<span>{{ item.service }}</span>
				</p>
				<p class="row">
					<span>定时规则</span>
					<span>{{ item.taskType == 1 ? `间隔${item._every}秒执行` : item.cron }}</span>
				</p>

				<div class="status">
					<template v-if="item.status">
						<el-tag disable-transitions effect="dark" type="success">进行中</el-tag>

						<el-icon
							class="pause"
							@click.stop="stop(item)"
							v-permission="service.task.info.permission.stop"
						>
							<video-pause />
						</el-icon>
					</template>

					<template v-else>
						<el-tag disable-transitions effect="dark" type="danger">已停止</el-tag>

						<el-icon
							class="play"
							@click.stop="start(item)"
							v-permission="service.task.info.permission.start"
						>
							<video-play />
						</el-icon>
					</template>

					<cl-flex1 />

					<el-icon
						class="log"
						@click.stop="log(item)"
						v-permission="service.task.info.permission.log"
					>
						<tickets />
					</el-icon>

					<el-icon
						class="delete"
						@click.stop="remove(item)"
						v-permission="service.task.info.permission.delete"
					>
						<delete />
					</el-icon>
				</div>
			</div>

			<div
				class="item is-add"
				@click="edit()"
				v-permission="service.task.info.permission.add"
			>
				<el-icon>
					<plus />
				</el-icon>
				<p>添加计划任务</p>
			</div>
		</div>

		<!-- 表单 -->
		<cl-form ref="Form" />

		<!-- 日志 -->
		<task-logs :ref="setRefs('log')" />
	</div>
</template>

<script lang="ts" name="task-list" setup>
import { onActivated, ref } from "vue";
import { useBrowser, useCool } from "/@/cool";
import { VideoPlay, VideoPause, Plus, Tickets, Delete } from "@element-plus/icons-vue";
import { ContextMenu, useForm } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import TaskLogs from "../components/logs.vue";

const { service, refs, setRefs } = useCool();
const { browser } = useBrowser();
const Form = useForm();

const list = ref<Eps.TaskInfoEntity[]>([]);

// 刷新
function refresh() {
	service.task.info.page({ size: 100, page: 1 }).then((res) => {
		list.value = res.list.map((e) => {
			if (e.every) {
				e._every = parseInt(String(e.every / 1000));
			}

			return e;
		});
	});
}

// 启用任务
function start(item: Eps.TaskInfoEntity) {
	ElMessageBox.confirm(`此操作将启用任务（${item.name}），是否继续？`, "提示", {
		type: "warning"
	})
		.then(() => {
			service.task.info
				.start({ id: item.id, type: item.type })
				.then(() => {
					refresh();
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 停用任务
function stop(item: Eps.TaskInfoEntity) {
	ElMessageBox.confirm(`此操作将停用任务（${item.name}），是否继续？`, "提示", {
		type: "warning"
	})
		.then(() => {
			service.task.info
				.stop({ id: item.id })
				.then(() => {
					refresh();
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 删除任务
function remove(item: Eps.TaskInfoEntity) {
	ElMessageBox.confirm(`此操作将删除任务（${item.name}），是否继续？`, "提示", {
		type: "warning"
	})
		.then(() => {
			service.task.info
				.delete({ ids: [item.id] })
				.then(() => {
					refresh();
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 任务日志
function log(item: Eps.TaskInfoEntity) {
	refs.log.open(item);
}

// 新增、编辑
async function edit(item?: Eps.TaskInfoEntity) {
	if (item && !service.task.info._permission.update) {
		return false;
	}

	Form.value?.open({
		title: "编辑计划任务",
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
				required: true
			},
			{
				label: "类型",
				prop: "taskType",
				value: 0,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "cron",
							value: 0
						},
						{
							label: "时间间隔",
							value: 1
						}
					]
				},
				required: true
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
				required: true
			},
			{
				label: "间隔(秒)",
				prop: "every",
				hidden: ({ scope }) => scope.taskType == 0,
				hook: {
					bind(value) {
						return value / 1000;
					},
					submit(value) {
						return value * 1000;
					}
				},
				component: {
					name: "el-input-number",
					props: {
						min: 1,
						max: 100000000
					}
				},
				required: true
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
						type: "textarea",
						rows: 3
					}
				}
			}
		],
		form: {
			...item
		},
		on: {
			submit: (data, { close, done }) => {
				if (!data.limit) {
					data.limit = null;
				}

				service.task.info[item?.id ? "update" : "add"](data)
					.then(() => {
						refresh();
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

// 执行一次
function once(item: Eps.TaskInfoEntity) {
	service.task.info
		.once({ id: item.id })
		.then(() => {
			refresh();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 右键菜单
function onContextMenu(e: any, item: Eps.TaskInfoEntity) {
	ContextMenu.open(e, {
		list: [
			item.status
				? {
						label: "暂停",
						hidden: !service.task.info._permission.stop,
						callback(done) {
							stop(item);
							done();
						}
				  }
				: {
						label: "开始",
						hidden: !service.task.info._permission.start,
						callback(done) {
							start(item);
							done();
						}
				  },
			{
				label: "立即执行",
				hidden: !service.task.info._permission.once,
				callback(done) {
					once(item);
					done();
				}
			},
			{
				label: "编辑",
				hidden: !(
					service.task.info._permission.update && service.task.info._permission.info
				),
				callback(done) {
					edit(item);
					done();
				}
			},
			{
				label: "删除",
				hidden: !service.task.info._permission.delete,
				callback(done) {
					remove(item);
					done();
				}
			},
			{
				label: "查看日志",
				hidden: !service.task.info._permission.log,
				callback(done) {
					log(item);
					done();
				}
			}
		]
	});
}

onActivated(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.task-list {
	height: 100%;
	background-color: var(--el-bg-color-page);

	.list {
		display: flex;
		flex-wrap: wrap;
		padding: 10px 10px 0 10px;
		box-sizing: border-box;
		background-color: inherit;

		.item {
			background-color: var(--el-bg-color);
			padding: 15px 20px 0 20px;
			border-radius: 10px;
			margin: 0 15px 15px 0;
			height: 200px;
			width: 350px;
			cursor: pointer;
			box-sizing: border-box;

			.name {
				font-size: 17px;
				font-weight: bold;
				margin-bottom: 10px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.row {
				margin-bottom: 10px;
				height: 40px;

				span {
					display: block;

					&:nth-child(1) {
						font-size: 12px;
						margin-bottom: 5px;
						color: var(--el-color-info);
					}

					&:nth-child(2) {
						font-size: 14px;
					}
				}
			}

			.status {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-top: 1px solid var(--el-border-color-lighter);
				height: 50px;

				.el-icon {
					font-size: 22px;
					cursor: pointer;
					margin-left: 10px;
					padding: 5px;
					border-radius: 3px;

					&:hover {
						background-color: var(--el-border-color-lighter);
					}

					&.play {
						color: var(--el-color-primary);
					}

					&.pause {
						color: var(--el-color-danger);
					}

					&.log {
						color: var(--el-color-info);
					}

					&.delete {
						color: var(--el-color-danger);
					}
				}
			}

			&:hover {
				background-color: var(--el-fill-color-lighter);
			}

			&.is-add {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: var(--el-color-info);

				.el-icon {
					font-size: 30px;
				}

				p {
					font-size: 13px;
					margin: 20px 0;
				}
			}
		}
	}

	&.is-mini {
		.item {
			width: 100%;
			margin: 0 0 15px 0;
		}
	}
}
</style>
