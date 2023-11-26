<template>
	<div class="cl-date-picker">
		<el-date-picker
			v-model="date"
			:type="type"
			:default-time="defaultTime"
			:value-format="valueFormat"
			:style="{ width }"
			@change="onChange"
		/>

		<el-radio-group v-model="btnType" @change="onBtnTypeChange" v-if="quickBtn && isRange">
			<el-radio-button label="day">今日</el-radio-button>
			<el-radio-button label="week">本周</el-radio-button>
			<el-radio-button label="month">本月</el-radio-button>
			<el-radio-button label="year">今年</el-radio-button>
		</el-radio-group>
	</div>
</template>

<script lang="ts" setup name="cl-date-picker">
import { useCrud } from "@cool-vue/crud";
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";

const props = defineProps({
	modelValue: Array,
	type: {
		type: String,
		default: "datetimerange"
	},
	valueFormat: {
		type: String,
		default: "YYYY-MM-DD HH:mm:ss"
	},
	prop: {
		type: String
	},
	width: String,
	quickBtn: Boolean
});

const emit = defineEmits(["update:modelValue", "change"]);

const Crud = useCrud();

// 是否是范围
const isRange = computed(() => props.type.includes("range"));

// 默认时间
const defaultTime = ref(
	isRange.value ? [new Date("2000-01-01 00:00:00"), new Date("2000-01-01 23:59:59")] : undefined
);

// 日期
const date = ref();

// 按钮类型
const btnType = ref("month");

// 日期改变
function onChange(value: any[]) {
	// 重置按钮类型
	btnType.value = "";

	// 参数
	let params = {};

	if (isRange.value) {
		let [startTime, endTime] = value || [];

		if (props.type == "monthrange") {
			startTime = dayjs(startTime).format("YYYY-MM-01 00:00:00");
			endTime = dayjs(endTime).endOf("month").format("YYYY-MM-DD 23:59:59");
		}

		params = {
			[props.prop ? `${props.prop}StartTime` : "startTime"]: startTime,
			[props.prop ? `${props.prop}EndTime` : "endTime"]: endTime
		};
	} else {
		params = {
			// @ts-ignore
			[props.prop]: value
		};
	}

	Crud.value?.refresh({
		...params,
		page: 1
	});

	emit("update:modelValue", value);
	emit("change", value);
}

// 按钮类型改变
function onBtnTypeChange() {
	date.value = isRange.value ? [] : undefined;

	let start = dayjs();
	let end = dayjs();

	switch (btnType.value) {
		case "day":
			break;
		case "week":
			start = dayjs().startOf("week").add(1, "day");
			break;
		case "month":
			start = dayjs().startOf("month");
			break;
		case "year":
			start = dayjs().startOf("year");
			break;
	}

	const startTime = start.format("YYYY-MM-DD");
	const endTime = end.format("YYYY-MM-DD");

	Crud.value?.refresh({
		page: 1,
		startTime,
		endTime
	});

	emit("update:modelValue", [startTime, endTime]);
	emit("change", [startTime, endTime]);
}

function init() {
	onBtnTypeChange();
}

watch(
	() => props.modelValue,
	(val) => {
		date.value = val;
	},
	{
		immediate: true
	}
);

defineExpose({
	init
});
</script>

<style lang="scss" scoped>
.cl-date-picker {
	display: inline-flex;

	:deep(.el-date-editor) {
		box-sizing: border-box;
		margin-right: 10px;
	}
}
</style>
