<template>
	<div class="view-home">
		<el-row :gutter="15">
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-sales />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-views />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-paid />
				</div>
			</el-col>
			<el-col :lg="6" :md="12" :xs="24">
				<div class="card">
					<count-effect />
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15">
			<el-col :lg="14" :xs="24">
				<div class="card">
					<tab-chart />
				</div>
			</el-col>
			<el-col :lg="10" :xs="24">
				<div class="card">
					<sales-rank />
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="15">
			<el-col :lg="14" :sm="24">
				<div class="card card--last">
					<hot-search />
				</div>
			</el-col>
			<el-col :lg="10" :sm="24">
				<div class="card card--last">
					<category-ratio />
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" name="home" setup>
import CategoryRatio from "./components/category-ratio.vue";
import CountSales from "./components/count-sales.vue";
import CountViews from "./components/count-views.vue";
import CountPaid from "./components/count-paid.vue";
import CountEffect from "./components/count-effect.vue";
import TabChart from "./components/tab-chart.vue";
import SalesRank from "./components/sales-rank.vue";
import HotSearch from "./components/hot-search.vue";
</script>

<style lang="scss">
.view-home {
	.card {
		background-color: #fff;
		border-radius: 5px;
		margin-bottom: 15px;
		font-size: 12px;
		letter-spacing: 0.5px;
		color: #000;

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
