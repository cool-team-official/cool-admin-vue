<template>
	<div class="menu-perms">
		<el-cascader
			v-model="value"
			separator=":"
			clearable
			filterable
			:options="options"
			:props="{ multiple: true }"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { isObject } from "lodash";

export default defineComponent({
	name: "menu-perms",

	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		const { service } = useCool();

		// 绑定值
		const value = ref<string[]>([]);

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

			function flat(d: any) {
				if (isObject(d)) {
					for (const i in d) {
						const { permission } = d[i];

						if (permission) {
							perms = [...perms, Object.values(permission)].flat();
						} else {
							flat(d[i]);
						}
					}
				}
			}

			flat(service);

			perms
				.map((e) => e.replace("admin:", "").split(":"))
				.forEach((arr) => {
					function col(i: number, d: any[]) {
						const key = arr[i];

						if (d) {
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
						}
					}

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
.menu-perms {
	:deep(.el-cascader) {
		width: 100%;
	}
}
</style>
