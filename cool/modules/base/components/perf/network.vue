<template>
	<div class="network">
		<p class="title">流量</p>

		<ul>
			<li
				class="rx"
				@click="change('上行')"
				:class="[chartOptions.legend.selected['上行'] ? 'on' : 'off']"
			>
				<p>上行</p>
				<p>{{ tx_sec | unit_size }}</p>
			</li>

			<li
				class="tx"
				@click="change('下载')"
				:class="[chartOptions.legend.selected['下载'] ? 'on' : 'off']"
			>
				<p>下载</p>
				<p>{{ rx_sec | unit_size }}</p>
			</li>

			<li class="send">
				<p>总发送</p>
				<p>{{ tx_bytes | unit_size }}</p>
			</li>

			<li class="receive">
				<p>总接收</p>
				<p>{{ rx_bytes | unit_size }}</p>
			</li>
		</ul>

		<vue-echarts v-if="visible" autoresize :options="chartOptions"></vue-echarts>
	</div>
</template>

<script>
import echarts from "echarts";
import Common from "./common";

export default {
	mixins: [Common],

	props: {
		data: null
	},

	data() {
		return {
			visible: true,
			chartOptions: {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						lineStyle: {
							color: "#ddd"
						}
					},
					backgroundColor: "rgba(255,255,255,1)",
					padding: [5, 10],
					textStyle: {
						color: "#7588E4"
					},
					extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)",
					formatter: (arr) => {
						return arr
							.map((e, i) => (i == 0 ? "上行：" : "下载：") + this.conByte(e.value))
							.join("<br>");
					}
				},
				legend: {
					data: ["上行", "下载"],
					selected: {
						上行: true,
						下载: true
					},
					left: "1000%"
				},
				grid: {
					bottom: "5%",
					top: "10%",
					left: "10px",
					right: "10px",
					containLabel: true
				},
				xAxis: {
					type: "category",
					data: [],
					boundaryGap: false,
					splitLine: {
						show: true,
						interval: "auto",
						lineStyle: {
							color: ["#D4DFF5"]
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: "#609ee9"
						}
					},
					axisLabel: {
						margin: 10,
						textStyle: {
							fontSize: 14
						}
					}
				},
				yAxis: {
					type: "value",
					splitLine: {
						show: true,
						lineStyle: {
							color: ["#D4DFF5"]
						}
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false,
						lineStyle: {
							color: "#609ee9"
						}
					},
					axisLabel: {
						margin: 10,
						textStyle: {
							fontSize: 14
						},
						formatter: (value) => {
							return this.conByte(value);
						}
					}
				},
				series: [
					{
						type: "line",
						showSymbol: false,
						symbol: "circle",
						symbolSize: 6,
						data: [],
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: "rgba(255, 202, 89, 0.5)"
										},
										{
											offset: 1,
											color: "rgba(255, 202, 89, 0.2)"
										}
									],
									false
								)
							}
						},
						itemStyle: {
							normal: {
								color: "#f7b851"
							}
						},
						lineStyle: {
							normal: {
								width: 1
							}
						}
					},
					{
						type: "line",
						showSymbol: false,
						symbol: "circle",
						symbolSize: 6,
						data: [],
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(
									0,
									0,
									0,
									1,
									[
										{
											offset: 0,
											color: "rgba(216, 244, 247, 1)"
										},
										{
											offset: 1,
											color: "rgba(216, 244, 247, 1)"
										}
									],
									false
								)
							}
						},
						itemStyle: {
							normal: {
								color: "#58c8da"
							}
						},
						lineStyle: {
							normal: {
								width: 1
							}
						}
					}
				]
			},
			rx_bytes: 0,
			tx_bytes: 0,
			rx_sec: 0,
			tx_sec: 0
		};
	},

	methods: {
		change(n) {
			this.chartOptions.legend.selected[n] = !this.chartOptions.legend.selected[n];
			this.visible = false;

			this.$nextTick(() => {
				this.visible = true;
			});
		},

		refresh(res) {
			let { data = [], time } = res;

			let network = data[data.length - 1].server.network;

			this.rx_bytes = 0;
			this.tx_bytes = 0;

			network.forEach((e) => {
				this.rx_bytes += e.rx_bytes;
				this.tx_bytes += e.tx_bytes;
			});

			this.rx_sec = network.reduce((a, b) => a + b.rx_sec, 0);
			this.tx_sec = network.reduce((a, b) => a + b.tx_sec, 0);
			this.chartOptions.xAxis.data = time;

			this.chartOptions.series[0].name = "上行";
			this.chartOptions.series[0].data = data.map((e) =>
				e.server.network.reduce((a, b) => a + b.tx_sec, 0)
			);

			this.chartOptions.series[1].name = "下载";
			this.chartOptions.series[1].data = data.map((e) =>
				e.server.network.reduce((a, b) => a + b.rx_sec, 0)
			);
		}
	}
};
</script>

<style lang="scss" scoped>
.network {
	background-color: #fff;
	padding: 15px;

	.title {
		font-size: 16px;
		border-bottom: 1px solid #eee;
		padding-bottom: 15px;
	}

	ul {
		display: flex;
		margin-top: 30px;
		text-align: center;

		li {
			list-style: none;
			flex: 1;

			&.rx {
				color: #f7b851;
			}

			&.tx {
				color: #58c8da;
			}

			p {
				&:first-child {
					font-size: 12px;
					color: #999;
				}

				&:last-child {
					font-size: 15px;
					margin-top: 10px;
				}
			}
		}

		li:nth-last-child(n + 3) p {
			cursor: pointer;
			position: relative;

			&:hover {
				opacity: 0.8;
			}
		}

		li:nth-last-child(n + 3) p:first-child::before {
			display: block;
			content: "";
			height: 8px;
			width: 8px;
			border-radius: 8px;
			position: absolute;
			left: calc(50% - 26px);
			top: calc(50% - 4px);
			background-color: #eee;
		}

		li:nth-child(1).on p:first-child::before {
			background-color: #f7b851;
		}

		li:nth-child(2).on p:first-child::before {
			background-color: #58c8da;
		}
	}

	.echarts {
		height: 350px;
		width: 100%;
	}
}
</style>
