<template>
	<div class="dp-config">
		<div class="head" v-show="t">
			<span>{{ t }}</span>
			<el-button text type="danger" @click="del" v-if="showDel">删除</el-button>
		</div>

		<div class="tips" v-if="tips">
			<el-icon>
				<warning-filled />
			</el-icon>
			<span>{{ tips }}</span>
		</div>

		<el-scrollbar class="scrollbar" v-if="visible">
			<div class="form">
				<cl-form inner ref="Form">
					<template #slot-required="{ scope }">
						<el-checkbox v-model="scope.required" @change="onRChange">必填</el-checkbox>
					</template>
				</cl-form>

				<el-empty :image-size="100" v-show="!t" description="未选择组件" />
			</div>
		</el-scrollbar>
	</div>
</template>

<script lang="tsx" setup>
import { useForm } from "@cool-vue/crud";
import { computed, nextTick, reactive, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { WarningFilled } from "@element-plus/icons-vue";
import { useDp } from "../hooks";

const { mitt } = useCool();
const { dp } = useDp();
const Form = useForm();

const visible = ref(true);
const t = ref("");
const data = reactive<any>({});
const tips = ref("");

// 是否组
const isGroup = computed(() => data.isTemp);

// 是否显示删除套件
const showDel = computed(() => {
	return isGroup.value || (!!dp.getGroup(data.id) && data.isDel === false);
});

function refresh(options: any) {
	for (const i in data) {
		delete data[i];
	}

	Object.assign(data, options);

	const { title, items = [] } = options.config;

	t.value = title || "未配置";
	tips.value = options.config.tips;

	Form.value?.open({
		form: options.component.props,
		items,
		props: {
			labelPosition: "top"
		},
		op: {
			hidden: true
		}
	});
}

function onRChange(v: any) {
	if (isGroup.value) {
		data.component.props.children.forEach((e: any) => {
			e.component.props.required = v;
		});
	}
}

function del() {
	clear();
	dp.removeBy({
		id: dp.getGroup(data.id).id
	});
}

function clear() {
	Form.value?.close();
	t.value = "";
	tips.value = "";
}

let stop: any = null;

mitt.on("dp.setConfig", (options: any) => {
	visible.value = false;

	if (stop) {
		stop();
	}

	nextTick(() => {
		visible.value = true;

		nextTick(() => {
			refresh(options || {});

			stop = watch(
				() => Form.value?.form,
				(val) => {
					if (val) {
						Object.assign(options.component.props, val);
					}
				},
				{
					immediate: true,
					deep: true
				}
			);
		});
	});
});

mitt.on("dp.clearConfig", clear);
</script>

<style lang="scss" scoped>
.dp-config {
	height: 100%;
	width: 350px;
	overflow: hidden;
	background-color: #fff;
	border-radius: 6px;

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 54px;
		font-size: 18px;
		color: #262626;
		padding: 0 15px;
		border-bottom: 1px solid #ebeef5;
	}

	.tips {
		display: inline-flex;
		align-items: center;
		background-color: #fff8d5;
		color: #ffbb00;
		margin: 10px 24px 0 24px;
		padding: 0 20px 0 4px;
		border-radius: 4px;

		.el-icon {
			margin: 5px;
			font-size: 15px;
		}

		span {
			font-size: 12px;
		}
	}

	.scrollbar {
		height: calc(100% - 55px);
	}

	.form {
		padding: 16px 24px;
		box-sizing: border-box;

		:deep(.form-label) {
			font-size: 16px;
			color: #000;

			span {
				font-size: 12px;
				color: #bfbfbf;
				margin-left: 10px;
			}
		}

		:deep(.el-form-item__label) {
			color: #000;
			font-size: 16px;
		}
	}
}
</style>
