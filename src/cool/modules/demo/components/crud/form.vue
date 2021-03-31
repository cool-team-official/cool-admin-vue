<template>
	<div class="demo-form">
		<el-button size="mini" @click="open">打开表单</el-button>

		<cl-form ref="formRef">
			<!-- 内嵌crud -->
			<template #slot-crud>
				<cl-crud @load="onCrudLoad">
					<cl-table
						:auto-height="false"
						:columns="[
							{
								label: '#',
								type: 'index',
								width: 60
							},
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
		</cl-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, resolveComponent, h } from "vue";
import Test from "./test.vue";
import { TestService } from "../../utils/service";
import { CrudLoad, FormItem, FormRef } from "@/crud/types";

export default defineComponent({
	name: "demo-form",

	setup() {
		const formRef = ref<FormRef>();

		function renderDivider(label: string) {
			const el: any = resolveComponent("el-divider");

			return h(
				el,
				{
					"content-position": "left"
				},
				{
					default: () => label
				}
			);
		}

		const items: FormItem[] = [
			{
				props: {
					labelWidth: "0px"
				},
				component: () => {
					return renderDivider("测试组件渲染");
				}
			},
			{
				label: ".vue 组件",
				component: Test
			},
			{
				label: "jsx",
				component: {
					name: "render-jsx",

					setup() {
						const value = ref<string>("Hello");

						return {
							value
						};
					},

					render(ctx: any) {
						return h(
							"p",
							{},
							{
								default: () => {
									return ctx.value;
								}
							}
						);
					}
				}
			},
			{
				props: {
					labelWidth: "0px"
				},
				component: () => {
					return renderDivider("测试内嵌CRUD");
				}
			},
			{
				props: {
					labelWidth: "0px"
				},
				component: {
					name: "slot-crud"
				}
			},
			{
				props: {
					labelWidth: "0px"
				},
				component: () => {
					return renderDivider("测试验证规则");
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
					labelWidth: "0px"
				},
				component: () => {
					return renderDivider("测试显隐");
				}
			},
			{
				label: "奇术",
				prop: "qs",
				value: [],
				component: {
					name: "el-select",
					props: {
						placeholder: "请选择奇术",
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
					props: {
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
				hidden: ({ scope }: any) => {
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
				hidden: ({ scope }: any) => {
					return scope.wx != 0;
				},
				component: ({ h }: any) => {
					return h("p", "以甘甜雨露的滋润使人精力充沛");
				}
			},
			{
				label: "风雪冰天",
				prop: "s2",
				hidden: ({ scope }: any) => {
					return scope.wx != 0;
				},
				component: ({ h }: any) => {
					return h("p", "召唤漫天风雪，对敌方造成巨大的杀伤力");
				}
			},
			{
				label: "三昧真火",
				prop: "h",
				hidden: ({ scope }: any) => {
					return scope.wx != 1;
				},
				component: ({ h }: any) => {
					return h("p", "召唤三昧真火焚烧敌方的仙术");
				}
			},
			{
				label: "惊雷闪",
				prop: "l",
				hidden: ({ scope }: any) => {
					return scope.wx != 2;
				},
				component: ({ h }: any) => {
					return h("p", "召唤惊雷无数，对敌方全体进行攻击，是十分强力的仙术");
				}
			},
			{
				label: "如沐春风",
				prop: "f",
				hidden: ({ scope }: any) => {
					return scope.wx != 3;
				},
				component: ({ h }: any) => {
					return h("p", "温暖柔和的复苏春风，使人回复活力");
				}
			},
			{
				label: "艮山壁障",
				prop: "t",
				hidden: ({ scope }: any) => {
					return scope.wx != 4;
				},
				component: ({ h }: any) => {
					return h("p", "以艮山之灵形成一道壁障，受此壁障守护者刀枪不入");
				}
			}
		];

		function open() {
			formRef.value?.open({
				width: "1000px",
				props: {
					labelWidth: "140px"
				},
				items
			});
		}

		function onCrudLoad({ ctx, app }: CrudLoad) {
			ctx.service(TestService).done();
			app.refresh();
		}

		function addVad(list: Array<any>) {
			list.push({
				val: ""
			});
		}

		return {
			open,
			formRef,
			onCrudLoad,
			addVad
		};
	}
});
</script>

<style lang="scss" scoped>
.demo-form {
	margin-left: 10px;
}
</style>
