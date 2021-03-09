<template>
	<cl-crud ref="crud" @load="onLoad">
		<el-row type="flex" align="middle">
			<cl-refresh-btn></cl-refresh-btn>
			<cl-add-btn></cl-add-btn>
			<cl-multi-delete-btn></cl-multi-delete-btn>
			<cl-query
				field="status"
				:list="[
					{
						label: '启用',
						value: 1
					},
					{
						label: '禁用',
						value: 0
					}
				]"
			></cl-query>
			<cl-filter label="状态">
				<el-select
					size="mini"
					v-model="selects.status"
					@change="
						val => {
							refresh({
								status: val,
								page: 1
							});
						}
					"
				>
					<el-option value="" label="全部"></el-option>
					<el-option :value="0" label="禁用"></el-option>
					<el-option :value="1" label="启用"></el-option>
				</el-select>
			</cl-filter>
			<el-button size="mini" @click="openForm">自定义测试表单</el-button>
			<cl-flex1></cl-flex1>
			<cl-search-key
				field="name"
				:field-list="[
					{
						label: '姓名',
						value: 'name'
					},
					{
						label: '身份证',
						value: 'idCard'
					}
				]"
			></cl-search-key>
			<cl-adv-btn></cl-adv-btn>
		</el-row>

		<el-row>
			<cl-table ref="table" v-bind="table.props" v-on="table.on"> </cl-table>
		</el-row>

		<el-row>
			<cl-pagination></cl-pagination>
		</el-row>

		<!-- 高级搜索 -->
		<cl-adv-search ref="adv-search" v-bind="advSearch.props" v-on="advSearch.on">
		</cl-adv-search>

		<!-- 编辑、新增 -->
		<cl-upsert ref="upsert" v-bind="upsert.props" v-on="upsert.on"> </cl-upsert>

		<!-- 自定义表单 -->
		<cl-form ref="form">
			<!-- 动态增减表单验证 -->
			<template #slot-validate="{ scope }">
				<el-form-item
					v-for="(item, index) in scope.vads"
					:key="index"
					:prop="'vads.' + index + '.val'"
					:rules="{ required: true, message: '请输入' }"
				>
					<el-input v-model="item.val"></el-input>
				</el-form-item>

				<el-button @click="addVad(scope.vads)">添加行</el-button>
			</template>

			<!-- 内嵌crud -->
			<template #slot-crud>
				<cl-crud @load="onUpsertCrudLoad">
					<cl-table
						:props="{
							'max-height': '300px'
						}"
						:columns="[
							{
								label: '姓名',
								prop: 'name'
							},
							{
								label: '存款',
								prop: 'price'
							},
							{
								label: '创建时间',
								prop: 'createTime'
							}
						]"
					></cl-table>
				</cl-crud>
			</template>
		</cl-form>
	</cl-crud>
</template>

<script>
import { TestService } from "../utils/service";

export default {
	name: "crud-demo",

	data() {
		return {
			selects: {
				status: ""
			},
			table: {
				on: {
					"row-click": row => {
						console.log("行点击", row);
					}
				},

				props: {
					columns: [
						{
							type: "selection",
							align: "center",
							width: 60
						},
						{
							label: "姓名",
							prop: "name",
							align: "center",
							"min-width": 120
						},
						{
							label: "存款",
							prop: "price",
							sortable: true,
							align: "center",
							"min-width": 120
						},
						{
							label: "状态",
							prop: "status",
							align: "center",
							"min-width": 120,
							dict: [
								{
									label: "启用",
									value: 1,
									type: "primary"
								},
								{
									label: "禁用",
									value: 0,
									type: "danger"
								}
							]
						},
						{
							label: "创建时间",
							prop: "createTime",
							align: "center",
							"min-width": 150
						},
						{
							label: "操作",
							type: "op",
							align: "center",
							buttons: [
								"edit",
								"delete",
								({ h, scope }) => {
									return h(
										"el-button",
										{
											props: {
												type: "text",
												size: "mini"
											},
											on: {
												click: () => {
													this.$refs["crud"].rowAppend({
														name: scope.row.name
													});
												}
											}
										},
										"追加"
									);
								}
							]
						}
					]
				}
			},
			upsert: {
				on: {
					open() {
						console.log("cl-upsert 打开");
					},

					close() {
						console.log("cl-upsert 关闭");
					}
				},
				props: {
					onOpen: (isEdit, data, { done, submit, close }) => {
						console.log("cl-upsert 打开钩子", isEdit, data);
					},

					onClose(done) {
						console.log("cl-upsert 关闭钩子");
						done();
					},

					onInfo(data, { next, done, close }) {
						console.log("cl-upsert 详情钩子", data);
						done(data);
					},

					onSubmit(isEdit, data, { next, close, done }) {
						console.log("cl-upsert 提交钩子", `是否编辑 ${isEdit}`, data);
						next(data);
					},

					items: [
						{
							label: "姓名",
							prop: "name",
							component: {
								name: "el-input"
							},
							rules: {
								required: true,
								message: "姓名不能为空"
							}
						},
						{
							label: "存款",
							prop: "price",
							value: 0,
							component: {
								name: "el-input-number"
							}
						},
						{
							label: "状态",
							prop: "status",
							value: 1,
							component: {
								name: "el-radio-group",
								options: [
									{
										label: "启用",
										value: 1
									},
									{
										label: "禁用",
										value: 0
									}
								]
							},
							rules: {
								required: true,
								message: "状态不能为空"
							}
						}
					]
				}
			},
			advSearch: {
				on: {
					open(data) {
						console.log("adv-search 打开", data);
					},
					close() {
						console.log("adv-search 关闭");
					},
					reset() {
						console.log("adv-search 重置");
					},
					clear() {
						console.log("adv-search 清空");
					}
				},
				props: {
					onOpen(data, { next }) {
						console.log("adv-search 打开钩子", data);
						next();
					},
					onClose(done) {
						console.log("adv-search 关闭钩子");
						done();
					},
					onSearch(data, { next, close }) {
						console.log("adv-search 搜索钩子", data);
						next(data);
					},
					opList: ["search", "reset", "clear", "close"],
					items: [
						{
							label: "昵称",
							prop: "name",
							component: {
								name: "el-input",
								attrs: {
									placeholder: "搜索昵称"
								}
							}
						},
						{
							label: "状态",
							prop: "status",
							component: {
								name: "el-radio-group",
								options: [
									{
										label: "启用",
										value: 1
									},
									{
										label: "禁用",
										value: 0
									}
								]
							}
						}
					]
				}
			}
		};
	},

	methods: {
		openForm() {
			this.$refs["form"].open({
				title: "自定义表单",
				width: "1000px",
				props: {
					"label-width": "150px"
				},
				on: {
					open(data, { close, submit, done }) {
						console.log("cl-form 打开钩子", data);
					},

					close(done) {
						console.log("cl-form 关闭钩子");
						done();
					},

					submit: (data, { close, done, next }) => {
						console.log("cl-form 提交钩子", data);

						setTimeout(() => {
							done();
							this.$message.success("提交成功");
						}, 1500);
					}
				},
				form: {
					qs: [1]
				},
				items: [
					{
						props: {
							"label-width": "0px"
						},
						component: ({ h }) => {
							return h(
								"el-divider",
								{
									props: {
										"content-position": "left"
									}
								},
								"测试内嵌CRUD"
							);
						}
					},
					{
						props: {
							"label-width": "0px"
						},
						component: {
							name: "slot-crud"
						}
					},
					{
						props: {
							"label-width": "0px"
						},
						component: ({ h }) => {
							return h(
								"el-divider",
								{
									props: {
										"content-position": "left"
									}
								},
								"测试验证规则"
							);
						}
					},
					{
						prop: "vads",
						value: [],
						label: "动态增减表单验证",
						component: {
							name: "slot-validate"
						}
					},
					{
						props: {
							"label-width": "0px"
						},
						component: ({ h }) => {
							return h(
								"el-divider",
								{
									props: {
										"content-position": "left"
									}
								},
								"测试显隐"
							);
						}
					},
					{
						label: "奇术",
						prop: "qs",
						value: [],
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择奇术"
							},
							props: {
								multiple: true
							},
							options: [
								{
									label: "烟水还魂",
									value: 1
								},
								{
									label: "雨恨云愁",
									value: 2
								}
							]
						}
					},
					{
						label: "技能",
						prop: "jn",
						value: 1,
						component: {
							name: "el-select",
							attrs: {
								placeholder: "请选择技能"
							},
							options: [
								{
									label: "飞羽箭",
									value: 1
								},
								{
									label: "落星式",
									value: 2
								}
							]
						}
					},
					{
						label: "五行",
						prop: "wx",
						value: 0,
						hidden: ({ scope }) => {
							return scope.jn == 1;
						},
						component: {
							name: "el-radio-group",
							options: [
								{
									label: "水",
									value: 0
								},
								{
									label: "火",
									value: 1
								},
								{
									label: "雷",
									value: 2
								},
								{
									label: "风",
									value: 3
								},
								{
									label: "土",
									value: 4
								}
							]
						}
					},
					{
						label: "雨润",
						prop: "s1",
						hidden: ({ scope }) => {
							return scope.wx != 0;
						},
						component: ({ h }) => {
							return h("p", "以甘甜雨露的滋润使人精力充沛");
						}
					},
					{
						label: "风雪冰天",
						prop: "s2",
						hidden: ({ scope }) => {
							return scope.wx != 0;
						},
						component: ({ h }) => {
							return h("p", "召唤漫天风雪，对敌方造成巨大的杀伤力");
						}
					},
					{
						label: "三昧真火",
						prop: "h",
						hidden: ({ scope }) => {
							return scope.wx != 1;
						},
						component: ({ h }) => {
							return h("p", "召唤三昧真火焚烧敌方的仙术");
						}
					},
					{
						label: "惊雷闪",
						prop: "l",
						hidden: ({ scope }) => {
							return scope.wx != 2;
						},
						component: ({ h }) => {
							return h("p", "召唤惊雷无数，对敌方全体进行攻击，是十分强力的仙术");
						}
					},
					{
						label: "如沐春风",
						prop: "f",
						hidden: ({ scope }) => {
							return scope.wx != 3;
						},
						component: ({ h }) => {
							return h("p", "温暖柔和的复苏春风，使人回复活力");
						}
					},
					{
						label: "艮山壁障",
						prop: "t",
						hidden: ({ scope }) => {
							return scope.wx != 4;
						},
						component: ({ h }) => {
							return h("p", "以艮山之灵形成一道壁障，受此壁障守护者刀枪不入");
						}
					}
				]
			});
		},

		onLoad({ ctx, app }) {
			ctx.service(TestService)
				.permission(() => {
					return {
						add: true,
						update: true,
						delete: true
					};
				})
				.done();

			app.refresh();
		},

		refresh(params) {
			this.$refs["crud"].refresh(params);
		},

		onUpsertCrudLoad({ ctx, app }) {
			ctx.service(TestService).done();
			app.refresh();
		},

		addVad(list) {
			list.push({
				val: ""
			});
		}
	}
};
</script>
