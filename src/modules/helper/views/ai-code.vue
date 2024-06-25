<template>
	<el-scrollbar :ref="setRefs('scrollbar')">
		<div class="ai-code">
			<div class="bg">
				<div class="a"></div>
				<div class="b"></div>
			</div>

			<div class="panels" :class="[`is-${step.value}`]">
				<div class="panel-free">
					<div class="head">
						<p class="title">Cool Ai 极速编码</p>
						<p class="tag">让软件开发<span>再</span>快一点</p>
						<p class="desc">
							{{ desc.text }}
						</p>
					</div>

					<div class="enter" v-if="step.value == 'none'">
						<el-input
							v-model="form.name"
							placeholder="如：收货地址、商品列表"
							@focus="desc.change('name')"
							@keydown.enter="step.next"
						/>
						<cl-svg name="enter" class="icon" />
					</div>

					<template v-if="step.value == 'form'">
						<div class="editor">
							<div class="topbar">
								<div class="dots">
									<span></span>
									<span></span>
									<span></span>
								</div>
							</div>

							<div class="content">
								<div class="form">
									<div
										class="form-item"
										v-for="(item, index) in form.list"
										:key="index"
									>
										<p class="label">{{ item.label }}</p>

										<el-input resize="none" :placeholder="item.desc">
											<template #prefix>
												<el-icon>
													<arrow-right />
												</el-icon>
											</template>
										</el-input>
									</div>
								</div>
							</div>
						</div>

						<div class="btns">
							<el-button
								size="large"
								color="#41d1ff"
								:icon="Promotion"
								:disabled="temp.disabled"
								:loading="temp.disabled"
								@click="next"
							>
								{{
									temp.disabled
										? "思考中"
										: codes.entity.length
										  ? "重新生成"
										  : "下一步"
								}}
							</el-button>
						</div>

						<div class="tips">如遇见 “代码缺失”、“请求超时”，请尝试「刷新」吧</div>
					</template>
				</div>

				<div class="panel-code">
					<div class="editor">
						<div class="topbar">
							<div class="dots">
								<span @click="step.prev"></span>
								<span></span>
								<span></span>
							</div>

							<div class="print">
								<el-icon class="is-loading">
									<refresh />
								</el-icon>
								<span>生成 vue 代码中</span>
							</div>
						</div>

						<div class="content">
							<div class="tabs">
								<div class="item">Entity 实体数据</div>
								<div class="item active">Service 服务层</div>
								<div class="item">Controll 控制器</div>
								<div class="item">Vue 前端页面</div>

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
								/>
							</div>

							<!-- <div class="op">
								<el-button :icon="CloseBold" @click="reset"> 取消 </el-button>
								<el-button color="#41d1ff" @click="createFile">
									创建文件
								</el-button>
							</div> -->
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
import { onMounted, reactive, watch } from "vue";
import { useCool, storage } from "/@/cool";
import { Promotion, Refresh, Download, ArrowRight } from "@element-plus/icons-vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { debounce, isEmpty } from "lodash-es";
import { useClipboard } from "@vueuse/core";
import { useMenu, useAi } from "../hooks";
import { isDev } from "/@/config";
import { useForm } from "@cool-vue/crud";
import type { CodeType } from "../types";
import * as monaco from "monaco-editor";

const { service, refs, setRefs } = useCool();
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

// 执行步骤
const step = reactive({
	value: "none",

	list: ["none", "form", "coding"],

	next() {
		const i = step.list.indexOf(step.value);

		if (i < step.list.length - 1) {
			step.value = step.list[i + 1];
		}
	},

	prev() {
		const i = step.list.indexOf(step.value);

		if (i > 0) {
			step.value = step.list[i - 1];
		}
	}
});

// 滚动文案
const desc = reactive({
	list: [] as string[],
	text: "",

	change(action?: string) {
		if (action == "name") {
			desc.list = ["请简要描述您的功能，AI帮你写代码"];
		} else {
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
						setTimeout(() => {
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

// 编辑器
const editor = reactive({
	options: {
		fontSize: 15
	}
});

// 表单
const form = reactive({
	name: "",
	columns: [],
	list: [
		{
			label: "请填写功能名称",
			desc: "如：收货地址、商品列表、订单列表",
			loading: false,
			next() {}
		},
		{
			desc: "请填写功能名称，如：收货地址、商品列表、订单列表",
			loading: false,
			next() {}
		}
	]
});

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

function send(type: CodeType = "entity", data: any) {
	// 禁用
	temp.disabled = true;

	// 设置
	temp.coding = type;

	// 发送请求
	ai.send({
		...data,
		type,
		isAll: false
	});

	// 开始滚动
	scroller.start();
}

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

// 下一步，生成代码
function next() {
	step.next();

	return;

	if (!form.module) {
		return ElMessage.warning("请选择模块");
	}

	if (!form.name) {
		return ElMessage.warning("请填写实体名称");
	}

	if (isEmpty(form.columns)) {
		return ElMessage.warning("请填写字段");
	}

	function done() {
		reset();
		send("entity", {
			...form,
			columns: form.columns.split("、")
		});
	}

	if (codes.entity) {
		ElMessageBox.confirm("此操作将重新生成代码，是否继续？", "提示", {
			type: "warning"
		})
			.then(() => {
				done();
			})
			.catch(() => null);
	} else {
		done();
	}
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
			await ai.matchType({ columns: temp.data.columns, name: form.name });

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

// 监听表单
watch(
	() => form,
	(val) => {
		storage.set("ai-create.form", val);
	}
);

onMounted(() => {
	desc.init();

	ai.connect({
		onMessage(content) {
			codes[temp.coding] = content;
		},
		async onComplete() {
			switch (temp.coding) {
				case "entity":
					await parseEntity();
					send("controller", temp.data);
					break;

				case "controller":
					createVue(true);
					break;
			}
		}
	});
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
			top: 120px;
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

	.panels {
		position: relative;
		z-index: 2;

		.editor {
			border-radius: 6px;
			overflow: hidden;
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

				:deep(.el-input__wrapper) {
					background-color: transparent;
					box-shadow: none;
					padding: 10px;

					.el-input__inner {
						color: #fff;
					}
				}
			}
		}

		.panel-free {
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 100vh;
			width: 1040px;
			max-width: 100%;
			flex-shrink: 0;

			.editor {
				box-shadow: 0 0 1px 1px rgba($color, 0.7);

				.form {
					height: 300px;

					&-item {
						.label {
							color: #fff;
						}
					}
				}
			}

			.enter {
				display: flex;
				align-items: center;
				margin: 0 auto;
				width: 360px;
				position: relative;

				:deep(.el-input__wrapper) {
					background-color: rgba(0, 0, 0, 0.3);
					padding: 10px;
					border-radius: 12px;
					box-shadow: 0 0 10px 1px #4165d719;

					.el-input__inner {
						color: #fff;
						text-align: center;
						font-size: 16px;
						letter-spacing: 2px;
					}
				}

				.icon {
					position: absolute;
					right: 18px;
					color: #666;
					font-size: 18px;
				}
			}

			.head {
				padding: 0 0 50px 0;
				text-align: center;
				color: #fff;
				line-height: 1;
				letter-spacing: 2px;
				user-select: none;

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
					font-size: 22px;

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
					margin-top: 60px;

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

			.btns {
				display: flex;
				justify-content: center;

				.el-button {
					padding: 0 40px;
					font-size: 15px;
				}
			}

			.tips {
				color: var(--el-text-color-secondary);
				text-align: center;
				font-size: 14px;
				margin: 30px 0;
				user-select: none;
			}
		}

		.panel-code {
			position: absolute;
			bottom: 0;
			left: -100px;
			height: 0;
			width: calc(100% + 200px);
			background-color: #090c13;
			border-radius: 12px 12px 0 0;
			border: 5px solid rgba(255, 255, 255, 0.1);
			border-bottom: 0;
			box-sizing: border-box;
			transition: height 0.5s ease-in-out;
			overflow: hidden;

			.editor {
				height: 100%;
				overflow: hidden;

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
		}

		&.is-coding {
			.panel-free {
				.title {
					transform: translateY(-5vh);
				}
			}

			.panel-code {
				height: calc(100% - 20vh);
			}
		}
	}
}
</style>
