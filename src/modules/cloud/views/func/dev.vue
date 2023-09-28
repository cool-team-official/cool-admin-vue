<template>
	<div class="func-dev">
		<div class="head">
			<el-icon class="back" @click="router.back">
				<back />
			</el-icon>

			<span class="name">云函数（{{ info.name }}）</span>

			<div class="btn">
				<el-tooltip content="重新加载函数代码,将会丢失当前未保存的编辑" effect="light">
					<el-button size="small" :loading="loading" @click="refresh(true)">
						刷新
					</el-button>
				</el-tooltip>

				<el-button size="small" type="success" :loading="saving" @click="save">
					保存(S)
				</el-button>
			</div>
		</div>

		<div class="container">
			<div class="code">
				<cl-editor-monaco
					:ref="setRefs('code')"
					height="100%"
					language="typescript"
					:options="{
						fontSize: 18
					}"
					v-model="info.content"
					@change="
						(val) => {
							onCodeChange('devCode', val);
						}
					"
					@keydown="onCodeKeydown"
				/>
			</div>

			<div class="debug">
				<el-row :gutter="10">
					<el-col :sm="12" :xs="24">
						<div class="card">
							<div class="h">
								<span>调用参数</span>
								<el-button
									size="small"
									type="success"
									:loading="running"
									@click="run"
								>
									运行(B)
								</el-button>
							</div>
							<div class="c">
								<cl-editor-monaco
									:ref="setRefs('req')"
									height="100%"
									:options="{
										fontSize: 18
									}"
									v-model="debug.req"
									@keydown="onReqKeydown"
									@change="
										(val) => {
											onCodeChange('devReq', val);
										}
									"
								/>
							</div>
						</div>
					</el-col>

					<el-col :sm="12" :xs="24">
						<div class="card">
							<div class="h">
								<span>执行日志</span>
								<el-button size="small" @click="refs.logs?.open(info)">
									查看全部
								</el-button>
							</div>
							<div class="c is-border">
								<el-scrollbar v-loading="running">
									<div class="c2">
										<template v-if="debug.log.time > 0">
											<div class="row">
												<span
													>执行方法：{{ debug.log.request?.method }}</span
												>
											</div>

											<div class="row">
												<span>执行时间：2023-02-16 01:23:00</span>
											</div>

											<div class="row">
												<span>执行状态：</span>
												<span class="ok" v-if="debug.log.type == 1"
													>成功</span
												>
												<span class="fail" v-else>失败</span>

												<span style="margin-left: 20px">耗时：</span>
												<span>{{ debug.log.time }}ms</span>
											</div>

											<div class="row">执行结果：</div>

											<cl-code-json
												height="auto"
												:model-value="debug.log.result"
												v-if="debug.log.type == 1"
											/>

											<div class="error" v-else>
												{{ debug.log.error }}
											</div>
										</template>

										<template v-else>
											<el-empty :image-size="80" />
										</template>
									</div>
								</el-scrollbar>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>

		<!-- 日志 -->
		<func-logs :ref="setRefs('logs')" />
	</div>
</template>

<script lang="ts" name="cloud-func-dev" setup>
import { onMounted, reactive, ref } from "vue";
import { storage, useCool } from "/@/cool";
import { Back } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { CodeSnippets } from "../../dict";
import FuncLogs from "../../components/func-logs.vue";

const { route, service, refs, setRefs, router } = useCool();

// 加载状态
const loading = ref(false);

// 保存状态
const saving = ref(false);

// 运行状态
const running = ref(false);

// 调试
const debug = reactive({
	req: "",
	log: {
		error: "",
		type: 0,
		time: 0,
		createTime: "",
		result: {},
		request: {
			method: ""
		}
	}
});

// 云函数详情
const info = ref<Eps.CloudFuncInfoEntity>({
	content: ""
});

// 获取云函数详情
async function refresh(sync?: boolean) {
	loading.value = true;

	await service.cloud.func.info
		.info({
			id: route.query.id
		})
		.then((res) => {
			if (!sync) {
				res.content = storage.get(`cloud.devCode-${res.id}`) || res.content;
				debug.req = storage.get(`cloud.devReq-${res.id}`) || CodeSnippets.req;
			}
			info.value = res;
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

// 保存
async function save() {
	saving.value = true;

	await refs.code.formatCode();

	await service.cloud.func.info
		.update({
			id: info.value.id,
			content: info.value.content
		})
		.then(() => {
			ElMessage.success("保存成功");
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	saving.value = false;
}

// 运行
async function run() {
	running.value = true;

	await refs.req.formatCode();

	try {
		await service.cloud.func.info
			.invoke({
				id: info.value.id,
				content: info.value.content,
				...JSON.parse(debug.req)
			})
			.then((res) => {
				debug.log = res;
				ElMessage.success("运行成功");
			})
			.catch((err) => {
				debug.log.time = 0;
				ElMessage.error(err.message);
			});
	} catch (e) {
		ElMessage.error(e?.toString());
	}

	running.value = false;
}

// 代码保存到本地
function onCodeChange(name: string, value: string) {
	storage.set(`cloud.${name}-${info.value.id}`, value);
}

// ctrk + s 保存
function onCodeKeydown(e: KeyboardEvent) {
	if (e.ctrlKey && e.key.toLocaleLowerCase() == "s") {
		save();
		e.preventDefault();
	}
}

// ctrk + b 运行
function onReqKeydown(e: KeyboardEvent) {
	if (e.ctrlKey && e.key.toLocaleLowerCase() == "b") {
		run();
		e.preventDefault();
	}
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.func-dev {
	height: 100%;
	background-color: var(--el-bg-color);

	.head {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		box-sizing: border-box;
		padding: 0 5px;

		.name {
			flex: 1;
			text-align: center;
			font-size: 15px;
		}

		.back {
			padding: 5px;
			cursor: pointer;
			border-radius: 4px;
			font-size: 18px;

			&:hover {
				background-color: var(--el-fill-color-light);
			}
		}
	}

	.container {
		height: calc(100% - 40px);
		padding: 0 10px 10px 10px;
		box-sizing: border-box;
	}

	.code {
		height: calc(100% - 320px);
		background-color: var(--el-bg-color);
	}
}

.card {
	height: 320px;
	box-sizing: border-box;
	background-color: var(--el-bg-color);

	.h {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		font-size: 14px;

		.refresh {
			display: flex;
			align-items: center;
			cursor: pointer;
			margin-left: 6px;

			.el-icon {
				font-size: 16px;

				&:hover {
					color: var(--el-color-primary);
				}
			}
		}
	}

	.c {
		height: calc(100% - 40px);
		box-sizing: border-box;
		background-color: #fff;

		&.is-border {
			border: 1px solid var(--el-border-color);
		}
	}

	.c2 {
		font-size: 14px;
		padding: 10px;

		.error {
			background-color: #fef0f0;
			color: var(--el-color-danger);
			padding: 10px;
			border-radius: 4px;
			margin-bottom: 10px;
		}

		.row {
			margin-bottom: 5px;
			color: #000;
		}

		.ok {
			color: var(--el-color-success);
		}

		.fail {
			color: var(--el-color-danger);
		}
	}
}
</style>
