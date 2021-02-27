<template>
	<cl-scrollbar>
		<div class="home">
			<el-row :gutter="15">
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-sales></count-sales>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-views></count-views>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-paid></count-paid>
					</div>
				</el-col>
				<el-col :lg="6" :md="12" :xs="24">
					<div class="card">
						<count-effect></count-effect>
					</div>
				</el-col>
			</el-row>

			<el-row :gutter="15">
				<el-col :lg="14" :xs="24">
					<div class="card">
						<tab-chart></tab-chart>
					</div>
				</el-col>
				<el-col :lg="10" :xs="24">
					<div class="card">
						<sales-rank></sales-rank>
					</div>
				</el-col>
			</el-row>

			<el-row :gutter="15">
				<el-col :lg="14" :sm="24">
					<div class="card card--last">
						<hot-search></hot-search>
					</div>
				</el-col>
				<el-col :lg="10" :sm="24">
					<div class="card card--last">
						<category-ratio></category-ratio>
					</div>
				</el-col>
			</el-row>
		</div>
	</cl-scrollbar>
</template>

<script>
import CategoryRatio from "./components/category-ratio";
import CountSales from "./components/count-sales";
import CountViews from "./components/count-views";
import CountPaid from "./components/count-paid";
import CountEffect from "./components/count-effect";
import TabChart from "./components/tab-chart";
import SalesRank from "./components/sales-rank";
import HotSearch from "./components/hot-search";

export default {
	components: {
		CategoryRatio,
		CountSales,
		CountViews,
		CountPaid,
		CountEffect,
		TabChart,
		SalesRank,
		HotSearch
	}
};
</script>

<style lang="scss" scoped>
.home {
	/deep/.card {
		background-color: #fff;
		border-radius: 5px;
		margin-bottom: 15px;
		font-size: 12px;
		letter-spacing: 0.5px;

		&__header {
			display: flex;
			align-items: center;
			height: 50px;
			padding: 0 20px;

			.label {
				font-size: 12px;
			}

			.value {
				font-size: 18px;
				font-weight: bold;
				margin-left: 10px;
			}
		}

		&__container {
			padding: 0 20px;
			height: 50px;
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			border-top: 1px solid #f7f7f7;
			font-size: 12px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;

			.label {
				margin-right: 10px;
			}

			.value {
				font-size: 13px;
			}
		}
	}
}
</style>
