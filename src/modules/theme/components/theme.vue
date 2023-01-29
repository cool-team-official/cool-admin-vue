<template>
	<div class="cl-theme">
		<el-badge type="primary" is-dot @click="open">
			<cl-svg name="icon-discover" :size="15" />
		</el-badge>

		<template v-if="theme.name == 'default'">
			<el-switch
				:style="{
					marginLeft: '15px'
				}"
				inline-prompt
				v-model="isDark"
				:active-icon="Moon"
				:inactive-icon="Sunny"
			/>
		</template>
	</div>

	<el-drawer v-model="visible" title="设置主题" size="350px" append-to-body>
		<div class="cl-theme__drawer">
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
					<span
						:style="{
							marginLeft: '10px'
						}"
						>{{ form.color }}</span
					>
				</el-form-item>

				<el-form-item label="菜单分组显示">
					<el-switch v-model="form.theme.isGroup" @change="setGroup"></el-switch>
				</el-form-item>

				<el-form-item label="转场动画">
					<el-switch
						v-model="form.theme.transition"
						active-value="slide"
						inactive-value="none"
						@change="setTransition"
					></el-switch>
				</el-form-item>
			</el-form>
		</div>
	</el-drawer>
</template>

<script lang="ts" setup name="cl-theme">
import { reactive, ref } from "vue";
import { Check, Moon, Sunny } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useBase } from "/$/base";
import { useDark } from "@vueuse/core";
import { storage } from "/@/cool";
import { Theme } from "../types";
import { setTheme, themes } from "../utils";

const { menu } = useBase();

// 是否暗黑模式
const isDark = ref(useDark());

// 当前主题
const theme = reactive<Theme>(storage.get("theme"));

// 表单
const form = reactive<{ color: string; theme: Theme }>({
	color: theme.color || "",
	theme
});

// 抽屉
const visible = ref(false);

// 打开
function open() {
	visible.value = true;
}

// 清除暗黑模式
function clearDark() {
	isDark.value = false;
}

// 设置颜色
function setColor(color: any) {
	setTheme({ color });
	clearDark();
}

// 设置推荐
function setComd(item: any) {
	Object.assign(form.theme, item);
	form.color = item.color;
	setTheme(item);
	clearDark();
	ElMessage.success(`切换主题：${item.label}`);
}

// 设置分组
function setGroup(val: any) {
	setTheme({ isGroup: val });
	menu.setMenu();
}

// 设置转场动画
function setTransition(val: any) {
	setTheme({ transition: val });
}
</script>

<style lang="scss" scoped>
.cl-theme {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	padding: 0 10px;

	&__comd {
		display: flex;
		flex-wrap: wrap;

		li {
			display: inline-flex;
			align-items: center;
			list-style: none;
			margin-right: 15px;
			cursor: pointer;
			color: #000;

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

	&__drawer {
		:deep(.el-form-item) {
			background-color: #f7f7f7;
			padding: 10px;
			border-radius: 5px;
			border: 1px solid var(--el-border-color);

			.el-form-item__label {
				color: #000;
			}
		}
	}
}
</style>
