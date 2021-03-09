<template>
	<div class="perf-mysql">
		<p class="title">Mysql</p>

		<el-row class="fn">
			<el-col :span="8">
				<div class="block">
					<div class="icon _disk">
						<icon-svg name="perf-disk"></icon-svg>
					</div>

					<ul class="b">
						<li>
							<p>已使用</p>
							<p>{{ data_size }}</p>
						</li>
					</ul>
				</div>
			</el-col>

			<el-col :span="8">
				<div class="block">
					<div class="icon _cache">
						<icon-svg name="perf-cache"></icon-svg>
					</div>

					<ul class="b">
						<li>
							<p>缓存数</p>
							<p>{{ Threads_cached }}</p>
						</li>
					</ul>
				</div>
			</el-col>

			<el-col :span="8">
				<div class="block">
					<div class="icon _connect">
						<icon-svg name="perf-connect"></icon-svg>
					</div>

					<ul class="b">
						<li>
							<p>连接数</p>
							<p>{{ Threads_connected }}</p>
						</li>
					</ul>
				</div>
			</el-col>
		</el-row>

		<vue-echarts ref="chart" :options="chartOptions" autoresize></vue-echarts>
	</div>
</template>

<script>
import echarts from "echarts";
import Common from "./common";

export default {
	mixins: [Common],

	data() {
		return {
			chartOptions: {},
			Threads_connected: 0,
			Threads_cached: 0,
			data_size: 0
		};
	},

	methods: {
		refresh({ data, time }) {
			const item = data[data.length - 1];
			const { mysqlConn, mysqlSize } = item.mysql;

			this.Threads_cached = mysqlConn[0].Threads_cached;
			this.Threads_connected = mysqlConn[1].Threads_connected;
			this.data_size = mysqlSize.reduce((a, b) => a + parseFloat(b.data_size), 0) + "mb";

			this.chartOptions = this.onChart(
				time,
				data.map(e => e.mysql.mysqlConn[3].Threads_running)
			);
		},

		onChart(x, y) {
			return {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						lineStyle: {
							color: "rgb(15, 75, 111)"
						}
					},
					backgroundColor: "rgb(255,255,255)",
					padding: [5, 10],
					textStyle: {
						color: "rgb(15, 75, 111)"
					},
					extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)",
					formatter: arr => {
						return `线程数：${arr[0].data}`;
					}
				},
				grid: {
					left: "10px",
					right: "10px",
					bottom: "10px",
					top: "30px"
				},
				xAxis: {
					type: "category",
					show: false,
					boundaryGap: false,
					splitLine: {
						interval: "auto"
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					axisLabel: {
						margin: 10,
						textStyle: {
							fontSize: 12
						}
					},
					data: x
				},
				yAxis: {
					type: "value",
					show: false,
					splitLine: {
						show: true
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true
					}
				},
				series: [
					{
						type: "line",
						smooth: true,
						showSymbol: false,
						symbol: "circle",
						symbolSize: 6,
						data: y,
						markPoint: {
							symbolSize: 30,
							data: [
								{ type: "max", name: "最大值" },
								{ type: "min", name: "最小值" }
							]
						},
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
											color: "rgba(15, 75, 111, 0.5)"
										},
										{
											offset: 1,
											color: "rgba(15, 75, 111, 0.1)"
										}
									],
									false
								)
							}
						},
						itemStyle: {
							normal: {
								color: "rgb(15, 75, 111)"
							}
						},
						lineStyle: {
							normal: {
								width: 1
							}
						}
					}
				]
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.perf-mysql {
	background-color: #fff;

	.title {
		font-size: 16px;
		padding: 15px;
		border-bottom: 1px solid #f7f7f7;
	}

	.block {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 160px;
		font-size: 13px;

		.icon {
			height: 60px;
			width: 60px;
			margin-bottom: 10px;
			border: 1px dashed #eee;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 3px;
			margin-top: 25px;

			.icon-svg {
				font-size: 40px;
			}

			&._disk {
				color: #67c23a;
			}

			&._cache {
				color: #409eff;
			}

			&._connect {
				color: #e6a23c;
			}
		}

		.a {
			font-size: 13px;
		}

		.b {
			display: flex;
			text-align: center;
			width: 150px;

			li {
				list-style: none;
				flex: 1;

				p {
					&:first-child {
						margin-bottom: 5px;
						font-size: 12px;
						color: #999;
					}
				}
			}
		}
	}

	.echarts {
		height: 150px;
		width: 100%;
		margin-top: 10px;
	}
}
</style>
