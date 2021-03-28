<template>
	<div class="count-paid">
		<div class="card">
			<div class="card__header">
				<span class="label">支付笔数</span>
				<span class="value">6560</span>
			</div>

			<div class="card__container">
				<v-chart :option="chartOption" autoresize></v-chart>
			</div>

			<div class="card__footer">
				<span class="label">转化率</span>
				<span class="value">60%</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
	setup() {
		const chartOption = reactive({
			grid: {
				left: "10%",
				top: 0,
				right: "10%",
				bottom: 0
			},
			xAxis: {
				type: "category",
				data: ["00:00", "2:00", "4:00", "6:00", "8:00", "10:00", "12:00", "14:00"],
				boundaryGap: false
			},
			yAxis: {
				type: "value",
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisLabel: {
					show: false
				}
			},
			series: [
				{
					barWidth: 18,
					name: "付款笔数",
					type: "bar",
					data: [81, 24, 77, 13, 87, 92, 68, 55],
					itemStyle: {
						normal: {
							color: "#4165d7"
						}
					}
				},
				{
					type: "bar",
					barWidth: 18,
					xAxisIndex: 0,
					barGap: "-100%",
					data: [100, 100, 100, 100, 100, 100, 100, 100],
					itemStyle: {
						normal: {
							color: "#f1f1f9"
						}
					},
					zlevel: -1
				}
			]
		});

		return {
			chartOption
		};
	}
});
</script>

<style lang="scss" scoped>
.count-paid {
	.card {
		.echarts {
			height: 50px;
			width: 100%;
		}

		&__container {
			padding: 0;
		}
	}
}
</style>
