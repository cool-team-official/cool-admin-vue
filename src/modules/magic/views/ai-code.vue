<template>
	<div class="ai-code">
		<div class="container">
			<div class="head">
				<text2 model-value="Cool Ai 极速编码" />
			</div>

			<div class="form">
				<el-form :disabled="temp.disabled">
					<div class="label required">CRUD</div>

					<div class="row">
						<cl-select
							class="module"
							placeholder="请选择模块"
							size="large"
							v-model="form.module"
							:options="module.dirs"
							label-key="name"
							value-key="name"
							allow-create
						/>
						<el-input
							class="name"
							v-model="form.name"
							placeholder="实体名称，如：收货地址"
						/>
						<cl-select
							class="columns"
							size="large"
							multiple
							allow-create
							v-model="form.columns"
							default-first-option
							placeholder="请填写字段，多个按回车。如：姓名、年龄、状态"
						/>
					</div>

					<!-- <div class="label">Key</div>

					<div class="row">
						<el-input
							size="large"
							v-model="chatgpt.apiKey.value"
							placeholder="ChatGpt apiKey"
							show-password
						/>

						<el-button size="large" class="balance" @click="chatgpt.getBalance">
							{{ chatgpt.balance.total_used }} /
							{{ chatgpt.balance.total_granted }}

							<el-icon class="is-loading" v-if="chatgpt.balance.loading">
								<Loading />
							</el-icon>

							<el-icon v-else>
								<Refresh />
							</el-icon>
						</el-button>
					</div> -->

					<div class="label">其他你想做的事？</div>

					<el-input
						type="textarea"
						v-model="form.other"
						:rows="5"
						placeholder="如：分页查询时姓名、手机号字段设置成可模糊搜索"
					/>
				</el-form>
			</div>

			<div class="btns">
				<el-button
					round
					size="large"
					type="primary"
					:icon="Promotion"
					:disabled="temp.disabled"
					:loading="temp.disabled"
					@click="next"
				>
					{{ temp.disabled ? "思考中" : temp.message.length ? "重新生成" : "下一步" }}
				</el-button>

				<!-- <el-button :icon="VideoPlay" type="success" round size="large" @click="toVideo"
					>视频教程</el-button
				> -->
			</div>

			<div class="tips">如遇见 “代码缺失”、“请求超时”，请尝试「刷新」吧</div>

			<!-- 代码 -->
			<div class="codes">
				<div class="item is-entity" v-show="codes.entity">
					<div class="label">
						<div class="name">
							<span>Entity（实体类）</span>
							<el-icon class="is-loading" v-show="temp.coding == 'entity'">
								<loading />
							</el-icon>
						</div>

						<el-button round size="small" @click="copyCode('entity')">Copy</el-button>
						<el-button round type="success" size="small" @click="createVue()">
							生成Vue代码
						</el-button>
					</div>

					<cl-editor
						name="cl-editor-monaco"
						:ref="setRefs('codeEntity')"
						:options="editor.options"
						height="auto"
						autofocus
						autosize
						language="typescript"
						v-model="codes.entity"
					/>
				</div>

				<div class="item is-controller" v-show="codes.controller">
					<div class="label">
						<div class="name">
							<span>Controller（控制层）</span>
							<el-icon class="is-loading" v-show="temp.coding == 'controller'">
								<loading />
							</el-icon>
						</div>
						<el-button round size="small" @click="copyCode('controller')"
							>Copy</el-button
						>
					</div>
					<cl-editor
						name="cl-editor-monaco"
						:ref="setRefs('codeController')"
						:options="editor.options"
						height="auto"
						autosize
						language="typescript"
						v-model="codes.controller"
					/>
				</div>

				<div class="item is-vue" v-show="codes.vue">
					<div class="label">
						<div class="name">
							<span>Vue（页面）</span>
							<el-icon class="is-loading" v-show="temp.coding == 'vue'">
								<loading />
							</el-icon>
						</div>
						<el-button round size="small" @click="copyCode('vue')">Copy</el-button>
					</div>
					<cl-editor
						name="cl-editor-monaco"
						:ref="setRefs('codeVue')"
						:options="editor.options"
						height="auto"
						autosize
						language="html"
						v-model="codes.vue"
					/>
				</div>
			</div>

			<div class="op" v-show="!temp.disabled && temp.message.length">
				<el-button :icon="Close" round size="large" @click="reset"> 取消 </el-button>
				<el-button :icon="Check" round size="large" type="success" @click="createFile">
					创建文件
				</el-button>
			</div>

			<div class="bottom"></div>
		</div>

		<!-- 创建菜单 -->
		<cl-form ref="Form" />
	</div>
</template>

<script lang="tsx" name="magic-ai-code" setup>
import { onMounted, reactive, watch } from "vue";
import { module, useCool, storage } from "/@/cool";
import { Promotion, Loading, Close, Check, Refresh, VideoPlay } from "@element-plus/icons-vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { debounce, isEmpty } from "lodash-es";
import { useClipboard } from "@vueuse/core";
import { useMenu, useChatGPT, useScroll } from "../hooks";
import { useForm } from "@cool-vue/crud";
import { isDev } from "/@/cool";
import Text2 from "../components/text.vue";
import { CodeType } from "../types";

const { service, mitt, refs, setRefs } = useCool();
const { copy } = useClipboard();
const menu = useMenu();
const chatgpt = useChatGPT();
const scroll = useScroll();
const Form = useForm();

// 编辑器
const editor = reactive({
	options: {
		fontSize: 16
	}
});

// 表单
const form = reactive(
	storage.get("ai-create.form") || {
		name: "收货地址",
		module: "user",
		other: "",
		columns: ["用户ID", "联系人", "手机号", "省市区", "地址", "是否默认"]
	}
);

// 临时数据
const temp = reactive({
	disabled: false,
	coding: "" as CodeType | "",
	message: [] as string[],
	path: "",
	columns: [],
	api: [
		{
			path: "/add",
			summary: "新增"
		},
		{
			path: "/info",
			summary: "单个信息"
		},
		{
			path: "/update",
			summary: "修改"
		},
		{
			path: "/delete",
			summary: "删除"
		},
		{
			path: "/page",
			summary: "分页查询"
		},
		{
			path: "/list",
			summary: "列表查询"
		}
	]
});

// 代码
const codes = reactive({
	entity: "",
	controller: "",
	vue: ""
});

// 下一步，生成代码
function next() {
	if (!form.module) {
		return ElMessage.warning("请选择模块");
	}

	if (!form.name) {
		return ElMessage.warning("请填写实体名称");
	}

	if (isEmpty(form.columns)) {
		return ElMessage.warning("请填写字段");
	}

	function send() {
		// 重置
		reset();

		// 禁用
		temp.disabled = true;

		// 发送请求
		chatgpt.send(form);

		scroll.start();
	}

	if (temp.message.length) {
		ElMessageBox.confirm("此操作将重新生成代码，是否继续？", "提示", {
			type: "warning"
		})
			.then(() => {
				send();
			})
			.catch(() => null);
	} else {
		send();
	}
}

// 重新
function reset() {
	temp.disabled = false;
	temp.message = [];
	temp.coding = "";
	codes.entity = "";
	codes.controller = "";
	codes.vue = "";
}

// 复制代码
function copyCode(k: CodeType) {
	copy(codes[k]);
	ElMessage.success("复制成功");
}

// 创建文件
function createFile() {
	if (!isDev) {
		return ElMessage.error("只有在开发环境下才有效");
	}

	Form.value?.open({
		title: "配置菜单",
		width: "800px",
		items: [
			{
				prop: "parentId",
				label: "上级节点",
				component: {
					name: "cl-menu-select",
					props: {
						type: 1
					}
				}
			},
			{
				prop: "keepAlive",
				value: true,
				label: "路由缓存",
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "开启",
							value: true
						},
						{
							label: "关闭",
							value: false
						}
					]
				}
			},
			{
				prop: "icon",
				label: "菜单图标",
				component: {
					name: "cl-menu-icon"
				}
			},
			{
				prop: "orderNum",
				label: "排序号",
				component: {
					name: "el-input-number",
					props: {
						placeholder: "请填写排序号",
						min: 0,
						max: 99,
						"controls-position": "right"
					}
				}
			}
		],
		op: {
			saveButtonText: "开始创建"
		},
		on: {
			submit(data, { close, done }) {
				const loader = ElLoading.service({
					text: "创建文件中，过程可能会发生页面及服务重启"
				});

				// 添加菜单、权限
				menu.create({
					router: `${temp.path.replace("/admin", "")}`,
					api: temp.api,
					columns: temp.columns,
					prefix: temp.path,
					code: codes.vue,
					module: form.module,
					name: form.name,
					...data
				})
					.then((create) => {
						// 创建后端文件
						service.base.sys.menu.create({
							...form,
							controller: codes.controller,
							entity: codes.entity,
							path: temp.path
						});

						// 每3s检测服务状态
						const timer = setInterval(() => {
							service
								.request({
									url: "/"
								})
								.then(() => {
									ElMessage.success("文件创建成功");
									clearInterval(timer);
									loader.close();
									close();
									create();
								});
						}, 3000);
					})
					.catch(() => {
						loader.close();
						done();
					});
			}
		}
	});
}

// 创建ts
function createTs() {
	const arr = temp.message
		.join("")
		.split("```")
		.map((e: string) => e.replace("typescript\n", ""));

	if (arr[1]) {
		temp.coding = "entity";
		codes.entity = arr[1];
	}

	if (arr[3]) {
		temp.coding = "controller";
		codes.controller = arr[3];
	}
}

// 创建vue
const createVue = debounce((auto?: boolean) => {
	async function next() {
		if (temp.disabled) {
			return false;
		}

		if (codes.entity) {
			temp.coding = "vue";

			await service.base.sys.menu
				.parse({
					entity: codes.entity,
					controller: codes.controller,
					module: form.module
				})
				.then(async (res) => {
					temp.path = res.path;
					temp.columns = res.columns;

					codes.vue = menu.createVue({
						router: temp.path.replace("/admin", ""),
						prefix: temp.path,
						api: temp.api,
						columns: temp.columns,
						module: form.module
					});

					setTimeout(() => {
						refs.codeVue.formatCode();
						mitt.emit("view.scrollTo", { el: `.codes .is-vue` });
					}, 300);
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});

			temp.coding = "";
		}
	}

	if (auto) {
		next();
	} else {
		ElMessageBox.confirm("此操作将会重新生成vue代码，是否继续？", "提示", {
			type: "warning"
		})
			.then(() => {
				next();
			})
			.catch(() => null);
	}
}, 300);

// 视频教程
function toVideo() {
	location.href = "";
}

// 监听表单
watch(
	() => form,
	(val) => {
		storage.set("ai-create.form", val);
	}
);

onMounted(() => {
	chatgpt.connect({
		onMessage(content) {
			temp.message.push(content);
			createTs();
		},
		onComplete() {
			temp.disabled = false;
			scroll.stop();
			createVue(true);
		}
	});
});
</script>

<style lang="scss" scoped>
.ai-code {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	box-sizing: border-box;
	position: relative;

	.head {
		margin: 5vh 0 50px 0;
	}

	.container {
		width: 1040px;
	}

	.form {
		margin-bottom: 50px;

		.label {
			margin-bottom: 10px;
			font: 15px;
			color: var(--el-text-fill-color);

			&.required {
				&::after {
					content: "*";
					margin-left: 2px;
				}
			}
		}

		.row {
			display: flex;
			margin-bottom: 30px;

			.module {
				width: 160px;
			}

			.columns {
				flex: 1;
				margin-left: 10px;
			}

			.name {
				width: 200px;
				margin-left: 10px;
			}

			.balance {
				font-size: 15px;
				margin-left: 10px;
				white-space: nowrap;

				.el-icon {
					margin-left: 10px;
				}
			}
		}
	}

	.codes {
		margin: 50px 0 0 0;

		.item {
			margin-bottom: 20px;

			.label {
				display: flex;
				align-items: center;
				margin-bottom: 10px;
				padding-left: 2px;

				.name {
					display: flex;
					align-items: center;
					font-size: 18px;
					font-weight: bold;
					flex: 1;
				}

				.el-button {
					margin-left: 10px;
				}
			}
		}

		.row {
			display: flex;
			margin: 0 -10px 30px -10px;

			.item {
				flex: 1;
				margin: 0 10px;
			}
		}
	}

	.btns {
		display: flex;
		justify-content: center;

		.el-button {
			padding: 0 40px;
			font-size: 15px;
		}
	}

	.op {
		display: flex;
		justify-content: center;
		position: sticky;
		bottom: 10px;
		z-index: 9;

		.el-button {
			padding: 0 20px;
		}
	}

	.tips {
		color: var(--el-text-color-secondary);
		text-align: center;
		font-size: 14px;
		margin: 30px 0;
	}

	.bottom {
		height: 100px;
	}
}
</style>
