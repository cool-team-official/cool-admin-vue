<template>
	<cl-upsert ref="Upsert">
		<template #prepend="{ scope }">
			<el-divider>前</el-divider>
		</template>

		<template #append="{ scope }">
			<el-divider>后</el-divider>
		</template>
	</cl-upsert>
</template>

<script lang="tsx" setup>
import { setFocus, useRefs, useUpsert } from "../hooks";

const { refs, setRefs } = useRefs();

const Upsert = useUpsert({
	items: [
		{
			prop: "user",
			component: {
				name: "cl-form-card",
				props: {
					label: "用户信息"
				}
			},
			children: [
				{
					label: "账号",
					prop: "account",
					span: 12,
					required: true,
					component: {
						name: "el-input"
					}
				},
				{
					label: "密码",
					prop: "password",
					span: 12,
					required: true,
					component: {
						name: "el-input",
						props: {
							type: "password"
						}
					}
				},
				() => {
					return {
						label: "手机号",
						prop: "phone",
						hidden: Upsert.value?.mode == "update",
						component: {
							name: "el-input"
						}
					};
				}
			]
		},
		{
			label: "姓名",
			renderLabel: () => {
				return <p style="color: green">姓名</p>;
			},
			prop: "name",
			required: true,
			component: {
				name: "el-input"
			}
		},
		{
			type: "tabs",
			props: {
				type: "card",
				labels: [
					{
						label: "基础",
						value: "base"
					},
					{
						label: "其他",
						value: "other"
					}
				]
			}
		},
		{
			label: "年龄",
			group: "base",
			prop: "age",
			component: {
				name: "el-input-number"
			}
		},
		{
			label: "工作",
			group: "other",
			prop: "work",
			component: {
				name: "el-select",
				options: []
			}
		}
	],

	plugins: [setFocus("account")],

	onOpened() {
		Upsert.value?.setOptions("work", [
			{
				label: "法师",
				value: 1
			},
			{
				label: "战士",
				value: 2
			}
		]);

		// Upsert.value?.setProps("account", {
		// 	disabled: Upsert.value?.mode == "update"
		// });
	},

	onClose(action, done) {
		console.log("action", action);
		done();
	},

	onClosed() {
		console.log("closed");
	},

	onSubmit(data, { close }) {
		console.log("submit", data);
		close();
	}
});
</script>
