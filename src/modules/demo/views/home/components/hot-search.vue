<template>
	<div class="hot-search">
		<div class="hot-search__header">
			<span>线上热门搜索</span>
		</div>

		<div class="hot-search__container">
			<el-row class="hot-search__chart" :gutter="20">
				<el-col :md="12" :xs="24">
					<div class="block">
						<div class="count">
							<div class="number">
								<span>搜索用户数</span>
								<span>1242</span>
							</div>
							<div class="rise">
								<i class="el-icon-top-right"></i>
								<span>+7%</span>
							</div>
						</div>

						<v-chart :option="chartOption()" autoresize />
					</div>
				</el-col>

				<el-col :md="12" :xs="24">
					<div class="block is-last">
						<div class="count">
							<div class="number">
								<span>关注用户数</span>
								<span>365</span>
							</div>
							<div class="rise">
								<i class="el-icon-top-right"></i>
								<span>+2%</span>
							</div>
						</div>

						<v-chart :option="chartOption()" autoresize />
					</div>
				</el-col>
			</el-row>

			<div class="hot-search__table">
				<cl-crud ref="Crud" padding="0">
					<cl-row>
						<cl-table ref="Table" :border="false" />
					</cl-row>
				</cl-crud>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { useCrud, useTable } from "@cool-vue/crud";

const Crud = useCrud(
	{
		service: {
			page() {
				return Promise.resolve({
					list: [
						{
							keyWord: "无线耳机",
							users: 983,
							ud: 5
						},
						{
							keyWord: "运动耳机",
							users: 763,
							ud: -3
						},
						{
							keyWord: "蓝牙音箱",
							users: 328,
							ud: 7
						},
						{
							keyWord: "4k显示屏",
							users: 144,
							ud: 4
						},
						{
							keyWord: "罗技 G530",
							users: 121,
							ud: -1
						}
					]
				});
			}
		}
	},
	(app) => {
		app.refresh();
	}
);

const Table = useTable({
	autoHeight: false,
	contextMenu: [],
	columns: [
		{
			label: "排名",
			type: "index",
			width: 60
		},
		{
			label: "搜索关键词",
			prop: "keyWord",
			minWidth: 100
		},
		{
			label: "用户数",
			prop: "users",
			minWidth: 100
		},
		{
			label: "周涨幅",
			prop: "ud",
			sortable: "desc",
			minWidth: 100
		}
	]
});

function chartOption() {
	return {
		grid: {
			left: 0,
			top: 10,
			right: 0,
			bottom: 0
		},
		xAxis: {
			type: "category",
			data: [],
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
				name: "总访问量",
				type: "line",
				smooth: true,
				showSymbol: false,
				symbol: "circle",
				symbolSize: 6,
				data: new Array(12)
					.fill(1)
					.map(() => parseInt((Math.random() * 1000).toFixed(0)) + 500),
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1,
						[
							{
								offset: 0,
								color: "#D1E5FF"
							},
							{
								offset: 1,
								color: "#FFFFFF"
							}
						],
						false
					)
				},
				itemStyle: {
					color: "#4165d7"
				},
				lineStyle: {
					width: 2
				}
			}
		]
	};
}
</script>

<style lang="scss" scoped>
.hot-search {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__container {
		padding-bottom: 10px;
	}

	&__chart {
		padding: 0 20px;

		.block {
			.count {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10px;
				height: 40px;

				.fall,
				.rise {
					display: flex;
					align-items: center;
					margin-left: 10px;
					font-size: 15px;
				}

				.fall {
					color: #13ae7c;
				}

				.rise {
					color: #f21e37;
				}

				.number {
					display: flex;
					align-items: center;

					span {
						font-size: 13px;

						&:last-child {
							margin-left: 10px;
							font-size: 15px;
							font-weight: bold;
						}
					}
				}
			}

			.echarts {
				height: 70px;
				width: 100%;
			}
		}
	}

	&__table {
		padding: 10px;
		margin: 0 10px;
		border-radius: 6px;
		background-color: var(--el-bg-color);
	}
}
</style>
