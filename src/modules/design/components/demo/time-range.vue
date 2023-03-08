<template>
	<div class="demo-time-range">
		<demo-item :label="labelStart" :placeholder="placeholder" :required="required" arrow-icon />
		<demo-item :label="labelEnd" :placeholder="placeholder" :required="required" arrow-icon />
		<demo-item :label="`${labelDuration}(小时)`" v-if="duration"></demo-item>
	</div>
</template>

<script lang="ts" name="demo-time-range" setup>
defineProps({
	labelStart: String,
	labelEnd: String,
	labelDuration: String,
	required: Boolean,
	placeholder: {
		type: String,
		default: "请选择"
	},
	arrowIcon: Boolean,
	duration: Boolean
});
</script>
