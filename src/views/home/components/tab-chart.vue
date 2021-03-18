<template>
	<div class="tab-chart">
		<div class="tab-chart__header">
			<ul class="tab-chart__tab">
				<li class="active">销售额</li>
				<li>访问量</li>
			</ul>

			<span class="tab-chart__year">2020</span>
		</div>

		<div class="tab-chart__container">
			<vue-echarts :options="chartOptions" autoresize></vue-echarts>
		</div>
	</div>
</template>

<script>
import VueEcharts from "vue-echarts";
import { mapGetters } from "vuex";

export default {
	components: {
		VueEcharts
	},

	data() {
		return {
			chartOptions: {
				grid: {
					top: "20px",
					bottom: "30px",
					right: "10px",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: [],
					offset: 5,
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					}
				},
				yAxis: {
					type: "value",
					offset: 20,
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					}
				},
				tooltip: {
					trigger: "axis",
					formatter: (comp, value) => {
						const [serie] = comp;

						return `${serie.seriesName}：${serie.value}`;
					},
					axisPointer: {
						show: true,
						status: "shadow",
						z: -1,
						shadowStyle: {
							color: "#E6F7FF"
						},
						type: "shadow"
					},
					extraCssText: "width:120px; white-space:pre-wrap"
				},
				series: [
					{
						barWidth: 25,
						name: "付款笔数",
						type: "bar",
						data: [],
						itemStyle: {
							normal: {
								color: "#4165d7"
							}
						}
					},
					{
						type: "bar",
						barWidth: 25,
						xAxisIndex: 0,
						barGap: "-100%",
						data: [],
						itemStyle: {
							normal: {
								color: "#f1f1f9"
							}
						},
						zlevel: -1
					}
				]
			}
		};
	},

	computed: {
		...mapGetters(["browser"])
	},

	watch: {
		"browser.isMini": {
			immediate: true,
			handler(v) {
				this.chartOptions.series.map(e => {
					e.barWidth = v ? 15 : 25;
				});
			}
		}
	},

	created() {
		this.chartOptions.xAxis.data = new Array(12).fill(1).map((e, i) => i + 1 + "月");
		this.chartOptions.series[0].data = new Array(12)
			.fill(1)
			.map(() => parseInt(Math.random() * 100));
		this.chartOptions.series[1].data = new Array(12).fill(100);
	}
};
</script>

<style lang="scss" scoped>
.tab-chart {
	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 50px;
		padding: 0 20px;

		ul {
			li {
				list-style: none;
				float: left;
				margin-right: 20px;
				font-size: 15px;
				color: #dbdbdb;
				cursor: pointer;

				&.active {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}

	&__year {
		font-size: 14px;
		position: relative;

		&::before {
			display: block;
			content: "";
			height: 8px;
			width: 8px;
			border-radius: 8px;
			background-color: #000;
			position: absolute;
			left: -15px;
			top: 4px;
		}
	}

	&__container {
		height: 300px;
		padding: 0 15px;

		.echarts {
			height: 100%;
			width: 100%;
		}
	}
}
</style>
