<template>
	<div class="ai-code">
		<div class="bg">
			<div class="a"></div>
			<div class="b"></div>
		</div>

		<div class="back" @click="toBack">
			<el-icon>
				<back />
			</el-icon>
			返回
		</div>

		<div class="panel" :class="[`is-${step.value}`]">
			<div class="head">
				<p class="title">Cool Ai 极速编码</p>
				<p class="tag">让软件开发<span>再</span>快一点</p>
				<p class="desc">
					{{ desc.text }}
				</p>
			</div>

			<div class="start" v-if="step.value == 'start'">
				<el-button class="go btn-primary" @click="step.next">
					快速开始

					<el-icon>
						<arrow-right-bold />
					</el-icon>
				</el-button>

				<el-button class="doc" @click="toDoc"> 文档 </el-button>
			</div>

			<div class="enter" v-if="step.value == 'enter'">
				<el-input
					:ref="setRefs('inputEntity')"
					v-model="form.entity"
					placeholder="如：学生信息、商品信息"
					@keydown.enter="step.next"
				/>

				<el-icon class="icon is-loading" v-if="step.loading">
					<loading />
				</el-icon>

				<cl-svg class="icon" name="enter" v-else @click="step.next" />
			</div>

			<div
				class="form"
				:class="{
					show: ['form', 'coding'].includes(step.value)
				}"
			>
				<div class="editor">
					<div class="topbar">
						<div class="dots">
							<el-tooltip content="返回">
								<span @click="step.prev()"></span>
							</el-tooltip>
							<span></span>
							<span></span>
						</div>
					</div>

					<div class="content">
						<div class="row">
							<div class="label">
								实体名称

								<el-tooltip
									placement="top"
									content="指某类事物的集合名称，如：学生信息、商品信息"
								>
									<el-icon>
										<question-filled />
									</el-icon>
								</el-tooltip>
							</div>

							<el-input v-model="form.entity" maxlength="20" placeholder="请输入" />
						</div>

						<div class="row module">
							<div class="label">
								模块

								<el-tooltip
									placement="top"
									content="前、后端模块的标识，如：user、goods、demo"
								>
									<el-icon>
										<question-filled />
									</el-icon>
								</el-tooltip>
							</div>

							<el-input v-model="form.module" maxlength="20" placeholder="请输入" />

							<el-popover
								:ref="setRefs('modulePopover')"
								:teleported="false"
								:popper-style="{
									padding: '5px',
									borderRadius: '6px',
									zIndex: 99
								}"
								placement="left"
							>
								<template #reference>
									<cl-svg class="add" name="arrow-down" />
								</template>

								<div class="module-list">
									<div
										class="item"
										v-for="(item, index) in module.dirs"
										:key="index"
										@click="
											() => {
												form.module = item;
												refs.modulePopover?.hide();
											}
										"
									>
										{{ item }}
									</div>
								</div>
							</el-popover>
						</div>

						<div class="row">
							<div class="label">
								字段

								<el-tooltip
									placement="top"
									content="实体数据的字段名称，如：ID、姓名、手机号、状态"
								>
									<el-icon>
										<question-filled />
									</el-icon>
								</el-tooltip>
							</div>

							<el-input v-model="form.column" maxlength="200" placeholder="请输入" />
						</div>

						<div class="row" v-if="lang.value == 'Node'">
							<div class="label">
								其他你想做的事

								<el-tooltip
									placement="top"
									content="功能的扩展，如：分页查询时姓名、手机号字段设置成可模糊搜索"
								>
									<el-icon>
										<question-filled />
									</el-icon>
								</el-tooltip>
							</div>

							<el-input v-model="form.other" maxlength="200" placeholder="请输入" />
						</div>
					</div>
				</div>

				<div class="btns">
					<el-button class="btn-primary" @click="code.create()">
						生成代码
						<cl-svg name="code" />
					</el-button>
				</div>

				<div class="tips">如遇见 “代码缺失”、“请求超时”，请尝试「刷新」吧</div>
			</div>

			<div class="coding" v-if="step.value == 'coding'">
				<div class="editor">
					<div class="topbar">
						<div class="dots">
							<el-tooltip content="返回">
								<span @click="step.prev()"></span>
							</el-tooltip>
							<span></span>
							<span></span>
						</div>
					</div>

					<div class="content">
						<div class="tabs">
							<div
								class="item"
								v-for="(item, index) in code.list"
								:key="index"
								:class="{
									active: code.active == item.value
								}"
								@click="
									() => {
										code.active = item.value;
									}
								"
							>
								{{ item.label }}
							</div>

							<div class="op" v-if="!isEmpty(code.list) && !code.loading">
								<el-tooltip content="重新生成" v-if="code.active == 'vue'">
									<el-icon @click="code.refresh()">
										<refresh />
									</el-icon>
								</el-tooltip>

								<el-tooltip content="复制代码">
									<el-icon @click="code.copy()">
										<document-copy />
									</el-icon>
								</el-tooltip>

								<el-tooltip content="创建文件">
									<el-icon @click="createFile">
										<download />
									</el-icon>
								</el-tooltip>
							</div>
						</div>

						<div class="code">
							<cl-editor
								name="cl-editor-monaco"
								:ref="setRefs('editor')"
								v-model="activeCode.content"
								height="100%"
								:border="false"
								:options="{
									theme: 'ai-code--dark',
									minimap: {
										enabled: true
									}
								}"
								:key="activeCode.value"
								:language="activeCode.value == 'vue' ? 'html' : lang.tpl"
								v-if="activeCode"
							/>
						</div>

						<div class="console">
							<el-scrollbar :ref="setRefs('console.scrollbar')">
								<div class="item" v-for="(item, index) in code.logs" :key="index">
									<span class="date"> {{ item.date }} </span>

									<span class="text">
										{{ item.text }}
									</span>

									<el-icon
										class="is-loading"
										v-if="code.loading ? index == code.logs.length - 1 : false"
									>
										<loading />
									</el-icon>
								</div>
							</el-scrollbar>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 创建菜单 -->
		<cl-form ref="Form" />
	</div>
</template>

<script lang="tsx" setup name="helper-ai-code">
import { onMounted, reactive, computed, nextTick } from "vue";
import { useCool, module } from "/@/cool";
import {
	Download,
	Back,
	ArrowRightBold,
	Loading,
	DocumentCopy,
	QuestionFilled,
	Refresh
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { assign, isEmpty } from "lodash-es";
import { useMenu, useAi } from "../hooks";
import { config, isDev } from "/@/config";
import { useForm } from "@cool-vue/crud";
import { sleep, storage } from "/@/cool/utils";
import dayjs from "dayjs";
import type { CodeItem, EpsColumn } from "../types";
import { useClipboard } from "@vueuse/core";
import { ctx } from "virtual:ctx";

const { service, refs, setRefs, router } = useCool();
const menu = useMenu();
const ai = useAi();
const Form = useForm();
const { copy } = useClipboard();

// 表单
const form = reactive({
	entity: "",
	module: "",
	other: "",
	column: ""
});

// 执行步骤
const step = reactive({
	loading: false,
	value: "start",
	list: ["start", "enter", "form", "coding"],

	async next() {
		if (step.loading) {
			return false;
		}

		step.loading = true;

		let active = step.value;

		const i = step.list.indexOf(active);

		if (i < step.list.length - 1) {
			active = step.list[i + 1];
		}

		switch (active) {
			case "enter":
				setTimeout(() => {
					refs.inputEntity.focus();
				}, 300);
				break;

			case "form":
				if (!form.entity) {
					step.loading = false;
					return false;
				}

				desc.set(["正在做初步分析，请稍等..."]);

				await code.getColumns();
				break;
		}

		step.loading = false;
		step.value = active;

		// 切换文案
		desc.change();
	},

	prev() {
		const i = step.list.indexOf(step.value);

		if (i > 0) {
			step.value = step.list[i - 1];
		}
	}
});

// 语言
const lang = reactive({
	value: "Node",

	get() {
		lang.value = ctx.serviceLang;
		code.active = lang.value.toLocaleLowerCase() + "-entity";
	},

	get tpl() {
		const d = {
			Node: "typescript",
			Java: "java",
			Go: "go",
			Python: "python"
		};

		return d[lang.value];
	}
});

// 代码
const code = reactive({
	active: "",

	// 代码列表
	list: [] as CodeItem[],

	// 其他数据
	data: {
		router: "",
		prefix: "",
		fileName: "",
		columns: [] as EpsColumn[],
		fieldEq: [],
		keyWordLikeFields: [],
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
	},

	// 日志
	logs: [] as any[],

	// 生成中
	loading: false,

	// 请求
	req: null as Promise<any> | null,

	// 获取字段
	async getColumns() {
		return ai
			.invokeFlow("comm-column", {
				name: form.entity,
				modules: module.dirs.join("、")
			})
			.then((res) => {
				form.column = res.columns;
				form.module = res.module;
			});
	},

	// 清空
	clear() {
		code.list = [];
		code.logs = [];
		code.req = null;
		code.loading = false;
	},

	// 提示
	tips(val?: string) {
		code.logs.push({
			date: dayjs().format("HH:mm:ss"),
			text: val
		});

		// 日志滚动
		nextTick(() => {
			refs["console.scrollbar"]?.wrapRef?.scrollTo({
				top: Math.random() + 10000,
				behavior: "smooth"
			});
		});
	},

	// 生成 Node
	async createNode() {
		code.tips("Entity 代码生成中");

		// entity 代码
		const entity = await code.setContent("Entity 实体", "node-entity");

		code.tips("Entity 生成成功，开始解析");

		// entity 关键数据
		const entityData = await ai.invokeFlow("comm-parse-entity", {
			entity,
			module: form.module
		});

		code.tips(`Entity 解析成功，${JSON.stringify(entityData)}`);

		code.data.router = entityData.path.replace("/admin", "");
		code.data.prefix = entityData.path;
		code.data.fileName = entityData.fileName;

		// 解析字段
		code.parseColumn();

		code.tips("Service 代码生成中");

		// service 代码
		const service = await code.setContent("Service 服务", "node-service", {
			...entityData,
			entity
		});

		code.tips("Service 生成成功，开始解析");

		// service 关键数据
		const serviceData = await ai.invokeFlow("comm-parse-service", {
			service
		});

		code.tips(`Service 解析成功，${JSON.stringify(serviceData)}`);

		code.tips("Controller 代码生成中");

		// controller 代码
		const controller = await code.setContent("Controller 控制器", "node-controller", {
			...serviceData,
			...entityData,
			service,
			entity
		});

		code.tips("Controller 生成成功，开始解析");

		// controller 关键数据
		const controllerData = await ai.invokeFlow("comm-parse-controller", {
			entity,
			controller
		});

		code.tips(`Controller 解析成功，${JSON.stringify(controllerData)}`);

		code.data.fieldEq = controllerData.fieldEq;
		code.data.keyWordLikeFields = controllerData.keyWordLikeFields;
	},

	// 生成 Java
	async createJava() {
		code.tips("Entity 代码生成中");

		// entity 代码
		const entity = await code.setContent("Entity 实体", "java-entity");

		code.tips("Entity 生成成功，开始解析");

		// entity 关键数据
		const entityData = await ai.invokeFlow("comm-parse-entity", {
			entity,
			module: form.module
		});

		code.tips(`Entity 解析成功，${JSON.stringify(entityData)}`);

		code.data.router = entityData.path.replace("/admin", "");
		code.data.prefix = entityData.path;
		code.data.fileName = entityData.fileName;

		// 解析字段
		code.parseColumn();

		code.tips("Mapper 代码生成中");

		// mapper 代码
		await code.setContent("Mapper 映射", "java-mapper", {
			...entityData,
			entity
		});

		code.tips("Mapper 生成成功");

		code.tips("Service 代码生成中");

		// service 接口类
		const _service = await code.setContent("Service 接口类", "java-service", {
			...entityData,
			entity
		});

		// service 实现类
		const service = await code.setContent("Service 实现类", "java-service-impl", {
			...entityData,
			entity,
			service: _service
		});

		code.tips("Service 生成成功，开始解析");

		// service 关键数据
		const serviceData = await ai.invokeFlow("comm-parse-service", {
			service
		});

		code.tips(`Service 解析成功，${JSON.stringify(serviceData)}`);

		code.tips("Controller 代码生成中");

		// controller 代码
		const controller = await code.setContent("Controller 控制器", "java-controller", {
			...serviceData,
			...entityData,
			service,
			entity
		});

		code.tips("Controller 生成成功，开始解析");

		// controller 关键数据
		const controllerData = await ai.invokeFlow("comm-parse-controller", {
			controller
		});

		code.tips(`Controller 解析成功，${JSON.stringify(controllerData)}`);

		code.data.fieldEq = controllerData.fieldEq;
		code.data.keyWordLikeFields = controllerData.keyWordLikeFields;
	},

	// 生成代码
	async create() {
		if (!form.entity) {
			return ElMessage.warning("请填写实体名称");
		}

		if (!form.module) {
			return ElMessage.warning("请填写模块");
		}

		if (!form.column) {
			return ElMessage.warning("请填写字段");
		}

		code.loading = true;

		// 清空
		code.clear();

		// 下一步
		step.next();

		code.tips("AI 开始编码");

		await sleep(300);

		await code[`create${lang.value}`]();

		await code.createVue();

		code.tips("编码完成");

		code.loading = false;

		if (isDev) {
			ElMessageBox.confirm("编码完成，是否创建文件？", "提示", {
				type: "success",
				confirmButtonText: "开始创建",
				cancelButtonText: "稍后再看"
			})
				.then(() => {
					createFile();
				})
				.catch(() => null);
		}
	},

	// 解析字段
	async parseColumn() {
		const a = ai.invokeFlow("comm-parse-entity-column", {
			entity: code.getContent(`${lang.value}-entity`)
		});

		const b = ai.invokeFlow("comm-parse-column", {
			entity: code.getContent(`${lang.value}-entity`)
		});

		code.req = Promise.all([a, b]).then((res) => {
			if (res[0]?.columns) {
				code.data.columns = res[0].columns.map((e: EpsColumn) => {
					if (res[1]?.columns) {
						e.component = res[1].columns[e.propertyName] || "input";
					}
					return e;
				});

				code.data.columns.push({
					comment: "更新时间",
					length: 0,
					component: "datetime",
					nullable: false,
					propertyName: "updateTime",
					type: "datetime"
				});

				code.data.columns.push({
					comment: "创建时间",
					length: 0,
					component: "datetime",
					nullable: false,
					propertyName: "createTime",
					type: "datetime"
				});
			}
		});
	},

	// 创建vue
	async createVue() {
		const item = code.add("Vue 页面", "vue");

		item.content = "";

		assign(code.data, form);

		code.tips("Vue 代码开始生成");

		if (!code.req) {
			code.parseColumn();
		}

		code.tips("AI 分析中");

		await code.req;

		// 生成内容
		item.content = menu.createVue({
			...code.data,
			module: form.module
		});

		await sleep(300);

		// 格式化
		refs.editor.formatCode();

		code.tips("Vue 生成成功");
	},

	// 添加 tab
	add(label: string, flow: string) {
		let item = code.list.find((e) => e.value == flow);

		if (!item) {
			item = reactive<CodeItem>({
				label,
				value: flow,
				content: "",
				_content: ""
			});

			code.list.push(item);
		}

		code.active = flow;

		return item;
	},

	// 获取数据
	get(value: string) {
		return code.list.find((e) => e.value == value)!;
	},

	// 获取内容
	getContent(value: string) {
		return code.list.find(
			(e) => e.value == value || e.value.toLocaleLowerCase() == value.toLocaleLowerCase()
		)?.content;
	},

	// 设置内容
	async setContent(label: string, flow: string, data?: any) {
		return new Promise((resolve) => {
			const item = code.add(label, flow);

			// 是否结束
			let isEnd = false;

			// 所有内容
			let content = "";

			ai.invokeFlow(flow, { ...form, ...data }, (res) => {
				isEnd = res.isEnd;

				if (!res.isEnd) {
					content += res.content;

					if (content.indexOf(`\`\`\`${lang.tpl}\n`) == 0) {
						item._content = content
							.replace(new RegExp(`^\\\`\\\`\\\`${lang.tpl}\\n`, "g"), "")
							.replace(/```$/, "");
					}
				}
			});

			const timer = setInterval(() => {
				if (step.value != "coding") {
					clearInterval(timer);
					return;
				}

				const v = item._content[item.content.length] || "";

				if (isEnd) {
					if (!v) {
						clearInterval(timer);
						resolve(item.content);
						return false;
					}
				}

				item.content += v;

				// 滚动到底
				if (flow == code.active) {
					refs.editor?.revealLine(99999);
				}
			}, 5);
		});
	},

	// 复制
	copy() {
		copy(code.getContent(code.active)!);
		ElMessage.success("复制成功");

		// 存本地，方便调试
		storage.set("ai-code.list", code.list);
		storage.set("ai-code.data", code.data);
		storage.set("ai-code.form", form);
	},

	// 重新生成
	async refresh() {
		code.loading = true;
		code.req = null;
		await code.createVue();
		code.loading = false;
	}
});

const activeCode = computed(() => {
	return code.list.find((e) => e.value == code.active);
});

// 滚动文案
const desc = reactive({
	list: [] as string[],
	text: "",

	change() {
		switch (step.value) {
			case "enter":
				desc.list = ["请简要描述您的功能，AI帮你写代码"];
				break;

			case "form":
				desc.list = ["准备就绪，配置预设参数"];
				break;

			default:
				desc.list = [
					"COOL为开发者而生",
					"只需少量的口语提示就能完成特定的功能，大大节省开发时间"
				];
		}

		desc.start();
	},

	set(arr: string[]) {
		desc.list = arr;
		desc.start();
	},

	t1: null as any,
	t2: null as any,
	start() {
		desc.stop();

		function next(n: number) {
			const val = desc.list[n];

			if (val) {
				const next2 = (n2: number) => {
					const v = val[n2];

					if (v) {
						desc.t2 = setTimeout(() => {
							desc.text += v;
							next2(n2 + 1);
						}, 60);
					} else {
						desc.t2 = setTimeout(() => {
							if (desc.list.length > 1) {
								desc.t1 = setInterval(() => {
									desc.text = desc.text.slice(0, -1);

									if (!desc.text) {
										clearInterval(desc.t1);
										next(n + 1);
									}
								}, 50);
							}
						}, 1500);
					}
				};

				next2(0);
			} else {
				next(0);
			}
		}

		if (!isEmpty(desc.list)) {
			next(0);
		}
	},

	stop() {
		if (desc.t1) {
			clearInterval(desc.t1);
		}

		if (desc.t2) {
			clearTimeout(desc.t2);
		}

		desc.text = "";
	},

	init() {
		desc.change();
	}
});

// 创建文件
function createFile() {
	if (!isDev) {
		return ElMessage.error("只有在开发环境下才能创建文件");
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
			submit(data, { close }) {
				code.tips("创建 Vue 文件中，过程可能会发生页面及服务重启");

				// 添加菜单、权限
				menu.create({
					code: code.getContent("vue"),
					...code.data,
					...data,
					name: form.entity
				})
					.then((create) => {
						const files = {};

						// 文件内容
						code.list.forEach((e) => {
							const i = e.value.indexOf("-");
							let k = e.value;
							if (i >= 0) {
								k = k.substring(i + 1, k.length);
								files[k] = code.getContent(e.value);
							}
						});

						// 创建后端文件
						service.base.sys.menu.create({
							...form,
							...code.data,
							...files
						});

						// 每3s检测服务状态
						const timer = setInterval(() => {
							code.tips("检测后端服务是否启动");

							service
								.request({
									url: "/admin/base/open/eps"
								})
								.then((res) => {
									if (res && !isEmpty(res)) {
										code.tips("文件创建成功");
										ElMessage.success("文件创建成功");
										clearInterval(timer);
										create();
									}
								});
						}, 3000);
					})
					.catch(() => null);

				close();
			}
		}
	});
}

// 文档
function toDoc() {
	window.open("https://cool-js.com/");
}

// 返回
function toBack() {
	ElMessageBox.confirm(`确定要返回 ${config.app.name} 吗？`, "提示", {
		type: "warning"
	})
		.then(() => {
			router.back();
		})
		.catch(() => {});
}

onMounted(() => {
	lang.get();
	desc.init();

	// 测试
	if (step.value == "coding") {
		code.list = storage.get("ai-code.list") || [];

		if (storage.get("ai-code.data")) {
			code.data = storage.get("ai-code.data");
		}

		if (storage.get("ai-code.form")) {
			assign(form, storage.get("ai-code.form"));
		}
	}
});
</script>

<style lang="scss" scoped>
$color: #41d1ff;

.ai-code {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100vh;
	overflow: hidden;

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: #090c13;
		display: flex;
		justify-content: center;

		.a {
			background-color: $color;
			transform: rotate(20deg);
			right: -10px;
		}

		.b {
			background-color: #4165d7;
			transform: rotate(-20deg);
			right: 10px;
		}

		.a,
		.b {
			height: 300px;
			width: 420px;
			position: relative;
			opacity: 0.4;
			border-radius: 100%;
			filter: blur(60px);
			top: 30vh;
			animation: fb 5s ease-in-out infinite;
		}

		@keyframes fb {
			0% {
				filter: blur(60px);
			}

			40% {
				filter: blur(150px);
			}

			80% {
				filter: blur(60px);
			}

			100% {
				filter: blur(60px);
			}
		}
	}

	.back {
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 20px;
		top: 20px;
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.8);
		border-radius: 30px;
		padding: 6px 13px 6px 10px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 12px;
		z-index: 9;

		.el-icon {
			font-size: 16px;
			margin-right: 8px;
		}

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.panel {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		height: 100%;
		width: 1040px;
		max-width: 100%;

		.editor {
			background-color: #080e14;
			width: 100%;

			.topbar {
				display: flex;
				align-items: center;
				height: 36px;
				padding: 0 12px;

				.dots {
					display: flex;

					span {
						display: inline-block;
						height: 12px;
						width: 12px;
						border-radius: 12px;
						background-color: #2f3447;
						margin-right: 8px;

						&:first-child {
							cursor: pointer;

							&:hover {
								background-color: var(--el-color-danger);
							}
						}
					}
				}
			}

			.content {
				background-color: #0f151e;
			}
		}

		.btn-primary {
			border: 0;
			background-size: 300% 100%;
			background-image: linear-gradient(-60deg, $color, rgba($color, 0.5), $color);
			background-position: 100% 0px;
			box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.2);
			border-radius: 8px;
			letter-spacing: 1px;
			color: #111;
			transition: all 0.3s ease;

			.el-icon {
				transition: transform 0.1s;
			}

			&:hover {
				background-position: 0% 0px;

				.el-icon {
					transform: translateX(5px);
				}
			}
		}

		.head {
			padding: 50px 0;
			text-align: center;
			color: #fff;
			line-height: 1;
			letter-spacing: 2px;
			user-select: none;
			transition: all 0.2s ease 0.1s;

			.title {
				display: inline-block;
				font-size: 40px;
				background-clip: text;
				font-weight: bold;
				text-shadow: 0 5px 10px #333;
				transition: all 0.3s;
				transition-delay: 0.2s;
			}

			.tag {
				margin-top: 30px;
				font-size: 18px;
				color: #eee;

				span {
					color: $color;
					padding: 0 2px;
				}
			}

			.desc {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 35px;
				padding: 0 1px;
				color: #fff;
				font-size: 22px;
				margin-top: 50px;

				&::after {
					content: "";
					display: inline-block;
					margin-left: 4px;
					height: 22px;
					width: 3px;
					background-color: #fff;
					border-radius: 3px;
					animation: shan 1s ease infinite;
				}

				@keyframes shan {
					0% {
						opacity: 0;
					}

					50% {
						opacity: 1;
					}

					100% {
						opacity: 0;
					}
				}
			}
		}

		.start {
			height: 50px;
			text-align: center;
			margin: 0 auto;
			flex-shrink: 0;

			.el-button {
				height: 40px;
				background-color: #fff;
				border-radius: 8px;
			}

			.go {
				width: 140px;

				.el-icon {
					margin-left: 5px;
					color: #444;
				}
			}

			.doc {
				background-color: transparent;
				width: 100px;
				color: #fff;
				border-width: 2px;
				border-color: rgba(255, 255, 255, 0.7);
			}
		}

		.enter {
			display: flex;
			align-items: center;
			margin: 0 auto;
			position: relative;
			animation: enter 0.3s forwards;
			width: 10px;

			:deep(.el-input__wrapper) {
				background-color: rgba(0, 0, 0, 0.3);
				padding: 10px 20px;
				border-radius: 12px;
				box-shadow: 0 0 10px 1px #4165d719;

				.el-input__inner {
					color: #fff;
					font-size: 16px;
					text-align: center;
					letter-spacing: 2px;
				}
			}

			.icon {
				position: absolute;
				right: 18px;
				color: #ccc;
				font-size: 18px;
				cursor: pointer;

				&:hover {
					color: #fff;
				}
			}
		}

		@keyframes enter {
			from {
				width: 10px;
			}

			to {
				width: 320px;
			}
		}

		.form {
			transform: translateY(50vh);
			width: calc(100% - 40px);
			transition: all 0.3s ease;
			margin: 0 auto;

			.editor {
				border-radius: 8px;

				.content {
					color: #fff;
					box-sizing: border-box;
					border-radius: 0 0 8px 8px;
					padding: 5px 0 10px 0;

					.row {
						font-size: 12px;
						margin-bottom: 10px;

						&:last-child {
							margin-bottom: 0;
						}

						.label {
							display: flex;
							align-items: center;
							padding: 5px 15px;
							font-size: 12px;
							margin-bottom: 5px;
							color: #999;

							.el-icon {
								margin-left: 4px;
								cursor: pointer;
							}
						}

						:deep(.el-input__wrapper) {
							background-color: #2f344722;
							box-shadow: none;
							padding: 0 15px;

							.el-input__inner {
								color: #fff;
							}

							.el-icon {
								margin-left: 2px;
							}
						}

						&.module {
							position: relative;

							:deep(.el-input__wrapper) {
								padding-left: 35px;
							}

							.add {
								cursor: pointer;
								margin-right: 8px;
								position: absolute;
								left: 15px;
								top: 40px;
							}
						}
					}
				}
			}

			.btns {
				display: flex;
				justify-content: center;

				.el-button {
					height: 50px;
					width: 200px;
					font-size: 16px;
				}

				.cl-svg {
					font-size: 18px;
					margin-left: 5px;
					color: #333;
				}
			}

			.tips {
				color: #eee;
				text-align: center;
				font-size: 14px;
				user-select: none;
				margin-top: 30px;
			}

			.module-list {
				.item {
					border-radius: 6px;
					display: flex;
					align-items: center;
					height: 30px;
					padding: 0 10px;
					cursor: pointer;
					border-radius: 6px;
					font-size: 12px;

					&:hover {
						background-color: var(--el-fill-color-light);
					}
				}
			}

			&.show {
				transform: translateY(0);

				.btns {
					margin-top: 60px;
				}
			}
		}

		.coding {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 100vh;
			width: 100%;
			animation: coding 0.3s forwards;
			box-sizing: border-box;
			opacity: 0;
			z-index: 10;

			.editor {
				height: 100%;
				border-radius: 10px 10px 0 0;
			}

			.content {
				height: calc(100% - 36px);
				background-color: #080e14;

				.tabs {
					display: flex;
					height: 40px;

					.item {
						display: flex;
						align-items: center;
						justify-content: center;
						padding: 0 15px;
						font-size: 12px;
						cursor: pointer;
						color: var(--el-color-info);

						&.active {
							background-color: #0f151e;
							color: #fff;
						}

						&:hover {
							color: #eee;
						}
					}

					.op {
						display: flex;
						align-items: center;
						margin-left: auto;
						margin-right: 5px;

						.el-icon {
							height: 30px;
							width: 30px;
							color: #fff;
							font-size: 15px;
							cursor: pointer;
							border-radius: 5px;

							&:hover {
								background-color: #0f151e;
							}
						}
					}
				}

				.code {
					height: calc(100% - 190px);
				}

				.console {
					height: 150px;
					padding: 5px 0;
					box-sizing: border-box;
					border-top: 1px solid #2f3447;

					.item {
						font-size: 12px;
						padding: 5px 10px;
						color: #fff;

						.date {
							margin-right: 5px;
							color: #ccc;
						}

						.el-icon {
							margin: 0 5px;
							font-size: 14px;
							position: relative;
							top: 3px;
						}
					}
				}
			}
		}

		@keyframes coding {
			from {
				opacity: 0;
				transform: translateY(10vh);
			}

			to {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
}
</style>
