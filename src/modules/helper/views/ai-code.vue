<template>
	<el-scrollbar :ref="setRefs('scrollbar')">
		<div class="ai-code">
			<div class="bg">
				<div class="a"></div>
				<div class="b"></div>
			</div>

			<div class="back" @click="router.back">
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
						placeholder="如：收货地址、商品列表"
						@keydown.enter="step.next"
					/>

					<el-icon class="icon is-loading" v-if="step.loading">
						<loading />
					</el-icon>

					<cl-svg class="icon" name="enter" v-else />
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
								<span></span>
								<span></span>
								<span></span>
							</div>
						</div>

						<div class="content">
							<template v-if="step.value == 'form'">
								<div class="row">
									<div class="label">
										实体名称

										<el-tooltip
											placement="top"
											content="指某类事物的集合名称，如：收货地址、商品列表"
										>
											<el-icon>
												<question-filled />
											</el-icon>
										</el-tooltip>
									</div>

									<el-input v-model="form.entity" placeholder="请输入">
										<template #prefix>
											<el-icon>
												<arrow-right-bold />
											</el-icon>
										</template>
									</el-input>
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

									<el-input v-model="form.module" placeholder="请输入">
										<template #prefix>
											<el-popover
												:ref="setRefs('modulePopover')"
												:teleported="false"
												:popper-style="{
													padding: '5px',
													borderRadius: '6px'
												}"
												placement="left"
											>
												<template #reference>
													<el-icon class="add">
														<circle-plus />
													</el-icon>
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
										</template>
									</el-input>
								</div>

								<div class="row">
									<div class="label">
										字段

										<el-tooltip
											placement="top"
											content="实体数据的字段名称，如：ID、姓名、手机号"
										>
											<el-icon>
												<question-filled />
											</el-icon>
										</el-tooltip>
									</div>

									<el-input v-model="form.column" placeholder="请输入">
										<template #prefix>
											<el-icon class="icon">
												<arrow-right-bold />
											</el-icon>
										</template>
									</el-input>
								</div>

								<div class="row">
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

									<el-input v-model="form.other" placeholder="请输入">
										<template #prefix>
											<el-icon>
												<arrow-right-bold />
											</el-icon>
										</template>
									</el-input>
								</div>
							</template>
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
								<span
									@click="
										() => {
											if (!code.loading) {
												step.prev();
											}
										}
									"
								></span>
								<span></span>
								<span></span>
							</div>

							<div class="print">
								<el-icon class="is-loading">
									<refresh />
								</el-icon>
								<span>生成 {{ last(code.tabs)?.label }} 代码中</span>
							</div>
						</div>

						<div class="content">
							<div class="tabs">
								<div
									class="item"
									v-for="(item, index) in code.tabs"
									:key="index"
									:class="{
										active: index == code.tabs.length - 1
									}"
								>
									{{ item.label }}
								</div>

								<div class="op">
									<el-icon>
										<download />
									</el-icon>
								</div>
							</div>

							<div class="code">
								<cl-editor-monaco
									height="100%"
									:border="false"
									:options="{
										theme: 'ai-code--dark'
									}"
									v-model="code.tabs[code.tabs.length - 1].content"
									language="typescript"
									v-if="last(code.tabs)"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 创建菜单 -->
			<cl-form ref="Form" />
		</div>
	</el-scrollbar>
</template>

<script lang="tsx" setup name="helper-ai-code">
import { onMounted, reactive, watch, nextTick } from "vue";
import { useCool, storage, module } from "/@/cool";
import {
	Refresh,
	Download,
	Back,
	ArrowRightBold,
	Loading,
	CirclePlus,
	QuestionFilled
} from "@element-plus/icons-vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { debounce, isEmpty, last } from "lodash-es";
import { useClipboard } from "@vueuse/core";
import { useMenu, useAi } from "../hooks";
import { isDev } from "/@/config";
import { useForm } from "@cool-vue/crud";
import type { CodeType } from "../types";
import * as monaco from "monaco-editor";
import { sleep } from "/@/cool/utils";

const { service, refs, setRefs, router } = useCool();
const { copy } = useClipboard();
const menu = useMenu();
const ai = useAi();
const Form = useForm();

// 编辑器样式
monaco.editor.defineTheme("ai-code--dark", {
	base: "vs-dark",
	inherit: true,
	rules: [],
	colors: {
		"editor.background": "#0f151e",
		"editor.inactiveSelectionBackground": "#0f151e"
	}
});

// 表单
const form = reactive({
	entity: "收货地址",
	module: "user",
	other: "",
	column: "用户ID、用户名、收货人、手机号、收货地址、是否默认"
});

// 执行步骤
const step = reactive({
	loading: false,
	value: "form",
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

// 代码
const code = reactive({
	tabs: [] as { label: string; value: string; content: string }[],

	// 生成中
	loading: false,

	// 获取字段
	async getColumns() {
		return ai
			.invokeFlow("comm-column", {
				name: form.entity
			})
			.then((res) => {
				form.column = res.columns;
			});
	},

	// 清空
	clear() {
		code.tabs = [];
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

		await sleep(300);

		// entity 代码
		const entity = await code.setContent("Entity 实体", "node-entity");

		// entity 关键数据
		const entityData = await ai.invokeFlow("comm-parse-entity", {
			entity
		});

		// service 代码
		const service = await code.setContent("Service 服务层", "node-service", {
			...entityData
		});

		// service 关键数据
		const serviceData = await ai.invokeFlow("comm-parse-service", {
			service
		});

		// controller 代码
		await code.setContent("Controller 控制器", "node-controller", {
			...serviceData,
			...entityData
		});

		code.loading = false;
	},

	// 设置内容
	async setContent(label: string, flow: string, data?: any) {
		return new Promise((resolve) => {
			const item = {
				label,
				value: flow,
				content: ""
			};

			code.tabs.push(item);

			if (item) {
				let content = "";

				ai.invokeFlow(flow, { ...form, ...data }, (res) => {
					if (res.isEnd) {
						resolve(item.content);
					} else {
						content += res.content;

						if (content.indexOf("```typescript\n") == 0) {
							item.content = content
								.replace(/^```typescript\n/g, "")
								.replace(/```$/, "");
						}
					}
				});
			}
		});
	},

	// 复制代码
	copy(k: CodeType) {
		copy(codes[k]);
		ElMessage.success("复制成功");
	}
});

// 滚动文案
const desc = reactive({
	list: [] as string[],
	text: "",

	change() {
		console.log(111);

		switch (step.value) {
			case "enter":
				desc.list = ["请简要描述您的功能，AI帮你写代码"];
				break;

			case "form":
				desc.list = ["准备就绪，配置预设参数"];
				break;

			default:
				desc.list = [
					"为开发者生成优质编程代码",
					"只需少量的口语提示就能完成特定的功能，大大节省开发时间"
				];
		}

		desc.start();
	},

	t1: null as any,
	t2: null as any,
	start() {
		desc.stop();

		function next(n: number) {
			const val = desc.list[n];

			if (val) {
				function next2(n2: number) {
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
				}

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

// 滚动条
const scroller = {
	timer: null as any,

	scrollTo({ el, top }: { el?: string; top?: number }) {
		const scrollbar = refs.scrollbar.wrapRef;

		if (el) {
			top = scrollbar.querySelector(el).offsetTop;
		}

		scrollbar.scrollTo({
			top,
			behavior: "smooth"
		});
	},

	start() {
		this.stop();

		this.timer = setInterval(() => {
			if (codes.entity) {
				this.scrollTo({
					top: Math.random() + 10000
				});
			}
		}, 100);
	},

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
};

// 临时数据
const temp = reactive({
	disabled: false,
	coding: "" as "" | CodeType,
	data: {
		router: "",
		prefix: "",
		path: "",
		module: "",
		fileName: "",
		className: "",
		other: "",
		columns: [],
		api: []
	},
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
const codes = reactive<{ [key: string]: string }>({
	entity: "",
	controller: "",
	vue: ""
});

// 结束
function stop() {
	temp.disabled = false;
	temp.coding = "";
	scroller.stop();
}

// 重置
function reset() {
	stop();
	codes.entity = "";
	codes.controller = "";
	codes.vue = "";
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
					code: codes.vue,
					...temp.data,
					...data
				})
					.then((create) => {
						// 创建后端文件
						service.base.sys.menu.create({
							...form,
							...temp.data,
							controller: codes.controller,
							entity: codes.entity
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

// 创建vue
const createVue = debounce((auto?: boolean) => {
	async function next() {
		if (codes.entity) {
			// ai分析
			await ai.matchType({ columns: temp.data.columns, name: form.entity });

			// 生成代码
			codes.vue = menu.createVue(temp.data);

			stop();

			setTimeout(() => {
				scroller.scrollTo({ el: `.codes .is-vue` });
				refs.codeVue.formatCode();
			}, 300);
		}
	}

	if (auto) {
		next();
	} else {
		ElMessageBox.confirm("此操作将会重新生成vue代码，是否继续？", "提示", {
			type: "warning"
		})
			.then(async () => {
				temp.coding = "vue";
				codes.vue = "";

				await parseEntity();
				next();
			})
			.catch(() => null);
	}
}, 300);

// 解析实体
async function parseEntity() {
	await service.base.sys.menu
		.parse({
			entity: codes.entity,
			module: form.module
		})
		.then((res) => {
			temp.data = {
				...form,
				...res,
				router: res.path.replace("/admin", ""),
				prefix: res.path,
				api: temp.api
			};
		});
}

// 文档
function toDoc() {
	window.open("https://cool-js.com/");
}

// 监听表单
watch(
	() => form,
	(val) => {
		storage.set("ai-create.form", val);
	}
);

onMounted(() => {
	desc.init();
});
</script>

<style lang="scss" scoped>
$color: #41d1ff;

.ai-code {
	display: flex;
	flex-direction: column;
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

		.el-icon {
			font-size: 16px;
			margin-right: 8px;
		}

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.panel {
		position: relative;
		height: 100%;
		width: 1040px;

		.editor {
			background-color: #080e14;
			margin-bottom: 60px;

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
			padding: 25vh 0 50px 0;
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
				margin-top: 100px;

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

			.el-button {
				height: 40px;
				background-color: #fff;
			}

			.go {
				width: 140px;
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
			overflow: hidden;
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
				color: #fff;
				font-size: 18px;
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
			transform: translateY(40vh);
			width: 1000px;
			transition: all 0.3s ease;
			margin: 0 auto;

			.editor {
				box-shadow: 0 0 1px 1px rgba($color, 0.7);
				border-radius: 8px;

				.content {
					color: #fff;
					box-sizing: border-box;
					border-radius: 0 0 8px 8px;
					padding: 10px 0;

					.row {
						font-size: 14px;
						margin-bottom: 10px;

						&:last-child {
							margin-bottom: 0;
						}

						.label {
							display: flex;
							align-items: center;
							padding: 5px 15px;
							color: #999;

							.el-icon {
								margin-left: 4px;
								cursor: pointer;
								font-size: 12px;
							}
						}

						:deep(.el-input__wrapper) {
							background-color: transparent;
							box-shadow: none;

							.el-input__inner {
								color: #fff;
							}

							.el-icon {
								margin-left: 2px;
							}
						}

						&.module {
							.add {
								cursor: pointer;
								margin-right: 8px;
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
				margin: 50px 0 0 0;
				user-select: none;
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
			}
		}

		.coding {
			position: absolute;
			bottom: 0;
			left: 0;
			transition: all 0.3s ease;
			height: 0;
			width: 100%;
			animation: coding 0.3s forwards;
			border: 5px solid rgba(255, 255, 255, 0.1);
			border-radius: 10px 10px 0 0;
			border-bottom: 0;

			.editor {
				height: 100%;
				border-radius: 10px 10px 0 0;
			}

			.topbar {
				.dots {
					span {
						cursor: pointer;

						&:first-child {
							&:hover {
								background-color: var(--el-color-danger);
							}
						}
					}
				}

				.print {
					display: flex;
					align-items: center;
					margin-left: auto;
					color: #fff;

					.el-icon {
						margin-right: 5px;
						font-size: 15px;
					}
				}
			}

			.content {
				height: calc(100% - 36px);

				.tabs {
					display: flex;
					height: 40px;
					background-color: #080e14;

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
							font-size: 18px;
							cursor: pointer;
							border-radius: 5px;

							&:hover {
								background-color: #0f151e;
							}
						}
					}
				}

				.code {
					height: calc(100% - 40px);
				}
			}
		}

		@keyframes coding {
			from {
				height: 0;
			}

			to {
				height: 75vh;
			}
		}

		&.is-coding {
			.head {
				transform: translateY(-120px);
			}
		}
	}
}
</style>
