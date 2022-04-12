<template>
	<div class="cl-theme" @click="open">
		<el-badge type="primary" is-dot>
			<icon-svg name="icon-discover" :size="15"></icon-svg>
		</el-badge>
	</div>

	<el-drawer v-model="visible" title="设置主题" size="350px" append-to-body>
		<el-form label-position="top">
			<el-form-item label="推荐">
				<ul class="cl-theme__comd">
					<li @click="setComd(item)" v-for="(item, name) in themes" :key="name">
						<div
							class="w"
							:style="{
								backgroundColor: item.color
							}"
						>
							<check v-show="item.color == form.theme.color" />
						</div>

						<span>{{ item.label }}</span>
					</li>
				</ul>
			</el-form-item>

			<el-form-item label="自定义主色">
				<el-color-picker v-model="form.color" @change="setColor" />
				<span class="ml-10px">{{ form.color }}</span>
			</el-form-item>
		</el-form>
	</el-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { setTheme, themes } from "../utils";
import { module } from "/@/cool/utils";
import store from "store";
import { Check } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default defineComponent({
	name: "cl-theme",

	components: {
		Check
	},

	setup() {
		// 当前主题
		const theme = reactive<any>(store.get("theme") || module.get("theme"));

		// 表单
		const form = reactive<any>({
			color: theme.color || "",
			theme
		});

		// 抽屉
		const visible = ref<boolean>(false);

		function open() {
			visible.value = true;
		}

		function setColor(color: string) {
			setTheme({ color });
		}

		function setComd(item: any) {
			form.theme = item;
			form.color = item.color;
			setTheme(item);
			ElMessage.success(`切换主题：${item.label}`);
		}

		return {
			form,
			themes,
			theme,
			visible,
			open,
			setColor,
			setComd
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-theme {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;

	&__comd {
		display: flex;
		flex-wrap: wrap;

		li {
			display: inline-flex;
			align-items: center;
			list-style: none;
			margin-right: 15px;
			cursor: pointer;

			.w {
				height: 20px;
				width: 20px;
				border-radius: 3px;
				margin: 5px 10px 5px 0;
				text-align: center;
				color: #fff;
				line-height: 20px;
				padding: 2px;
				box-sizing: border-box;

				.el-icon {
					height: 100%;
					width: 100%;
				}
			}

			&:hover {
				opacity: 0.7;
			}
		}
	}
}
</style>
