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
			label: "姓名",
			renderLabel: () => {
				return <p>1</p>;
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

	plugins: [setFocus()],

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
