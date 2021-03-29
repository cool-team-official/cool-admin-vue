<template>
	<div class="cl-menu-perms">
		<el-cascader
			v-model="value"
			separator=":"
			clearable
			filterable
			:options="options"
			:props="{ multiple: true }"
			@change="onChange"
		></el-cascader>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from "vue";

export default defineComponent({
	name: "cl-menu-perms",

	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const $service = inject<any>("service");

		// 绑定值
		const value = ref<any[]>([]);

		// 权限列表
		const options = ref<any[]>([]);

		// 监听改变
		function onChange(row: any) {
			emit("update:modelValue", row.map((e: any) => e.join(":")).join(","));
		}

		// 解析权限
		(function parsePerm() {
			const list: any[] = [];
			let perms: any[] = [];

			const flat = (obj: any) => {
				for (const i in obj) {
					const { permission } = obj[i];

					if (permission) {
						perms = [...perms, Object.values(permission)].flat();
					} else {
						flat(obj[i]);
					}
				}
			};

			flat($service);

			perms
				.filter(e => e.includes(":"))
				.map(e => e.split(":"))
				.forEach(arr => {
					const col = (i: number, d: any[]) => {
						const key = arr[i];

						const index = d.findIndex((e: any) => e.label == key);

						if (index >= 0) {
							col(i + 1, d[index].children);
						} else {
							const isLast = i == arr.length - 1;

							d.push({
								label: key,
								value: key,
								children: isLast ? null : []
							});

							if (!isLast) {
								col(i + 1, d[d.length - 1].children || []);
							}
						}
					};

					col(0, list);
				});

			options.value = list;
		})();

		// 监听值
		watch(
			() => props.modelValue,
			(val: string) => {
				value.value = val ? val.split(",").map((e: string) => e.split(":")) : [];
			},
			{
				immediate: true
			}
		);

		return {
			value,
			options,
			onChange
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-menu-perms {
	:deep(.el-cascader) {
		width: 100%;
	}
}
</style>
