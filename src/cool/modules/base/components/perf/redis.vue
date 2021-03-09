<template>
	<div class="perf-redis">
		<p class="title">Redis</p>

		<el-row class="fn">
			<el-col :span="8">
				<div class="block">
					<div class="icon _disk">
						<icon-svg name="perf-disk"></icon-svg>
					</div>

					<ul class="b">
						<li>
							<p>已使用</p>
							<p>{{ used_memory | unit_size }}</p>
						</li>
					</ul>
				</div>
			</el-col>

			<el-col :span="8">
				<div class="block">
					<div class="icon _network">
						<icon-svg name="perf-network"></icon-svg>
					</div>

					<ul class="b scroller1">
						<li>
							<p>输入</p>
							<p>{{ total_net_input_bytes | unit_size }}</p>
						</li>
						<li>
							<p>输出</p>
							<p>{{ total_net_output_bytes | unit_size }}</p>
						</li>
					</ul>
				</div>
			</el-col>

			<el-col :span="8">
				<div class="block">
					<div class="icon _db">
						<icon-svg name="perf-db"></icon-svg>
					</div>

					<ul class="b scroller1">
						<li v-for="(item, index) in dbList" :key="index">
							<p>{{ item.label }}</p>
							<p>{{ item.value }} key</p>
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
			dbList: [],
			chartOptions: {},
			total_net_input_bytes: 0,
			total_net_output_bytes: 0,
			used_memory: 0
		};
	},

	methods: {
		refresh({ data, time }) {
			const item = data[data.length - 1];
			const { Keyspace, Stats, Memory } = item.redis;

			let list = [];

			for (let i in Keyspace) {
				list.push({
					label: i,
					value: Keyspace[i].split(",")[0].split("=")[1]
				});
			}

			this.total_net_input_bytes = Stats.total_net_input_bytes;
			this.total_net_output_bytes = Stats.total_net_output_bytes;
			this.used_memory = Memory.used_memory;

			this.chartOptions = this.onChart(
				time,
				data.map(e => e.redis.Stats.instantaneous_ops_per_sec),
				{
					color: "204, 32, 20",
					smooth: false
				}
			);

			this.dbList = list;
		},

		onChart(x, y) {
			return {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						lineStyle: {
							color: "#F56C6C"
						}
					},
					backgroundColor: "rgb(255,255,255)",
					padding: [5, 10],
					textStyle: {
						color: "#F56C6C"
					},
					extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)",
					formatter: arr => {
						return `${arr[0].data} / S（每秒操作数）`;
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
							fontSize: 12
						}
					},
					data: x
				},
				yAxis: {
					type: "value",
					show: false,
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
						show: true,
						lineStyle: {
							color: ["#609ee9"]
						}
					},
					axisLabel: {
						margin: 10,
						textStyle: {
							fontSize: 12
						}
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
											color: "rgba(245, 108, 108, 0.5)"
										},
										{
											offset: 1,
											color: "rgba(245, 108, 108, 0.1)"
										}
									],
									false
								)
							}
						},
						itemStyle: {
							normal: {
								color: "#F56C6C"
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
.perf-redis {
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
		margin: 0 10px;

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

			&._network {
				color: #409eff;
			}

			&._db {
				color: #e6a23c;
			}
		}

		.a {
			font-size: 13px;
		}

		.b {
			display: flex;
			text-align: center;
			width: 100%;
			overflow: auto hidden;

			li {
				list-style: none;
				flex: 1;
				margin: 0 8px;

				&:first-child {
					margin-left: 0;
				}

				&:last-child {
					margin-right: 0;
				}

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
