<template>
	<div class="sales-rank">
		<div class="sales-rank__header">
			<span>门店销售额排名</span>
		</div>

		<div class="sales-rank__container">
			<div class="sales-rank__filter">
				<ul>
					<li
						v-for="(item, index) in options.type"
						:key="index"
						:class="{
							active: item.value == type
						}"
						@click="changeDate(item.value)"
					>
						{{ item.label }}
					</li>
				</ul>

				<el-date-picker v-model="date" type="date" />
			</div>

			<ul class="sales-rank__list">
				<li>
					<span>1</span>
					<span>北京市朝阳区三里屯路</span>
					<span>323201</span>
				</li>
				<li>
					<span>2</span>
					<span>北京市朝阳区建国路-华贸购物中心</span>
					<span>278442</span>
				</li>
				<li>
					<span>3</span>
					<span>北京市朝阳区朝阳北路</span>
					<span>202368</span>
				</li>
				<li>
					<span>4</span>
					<span>北京市东城区王府井大街</span>
					<span>156320</span>
				</li>
				<li>
					<span>5</span>
					<span>北京市西城区西单北大街-大悦城</span>
					<span>98852</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

// 日期
const date = ref();

// 类型
const type = ref("day");

// 选项
const options = reactive({
	type: [
		{
			label: "今日",
			value: "day"
		},
		{
			label: "本周",
			value: "week"
		},
		{
			label: "本月",
			value: "month"
		},
		{
			label: "全年",
			value: "year"
		}
	]
});

function changeDate(value: string) {
	type.value = value;
}
</script>

<style lang="scss" scoped>
.sales-rank {
	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		font-size: 15px;
		font-weight: bold;
		padding: 0 20px;
	}

	&__container {
		padding: 0 20px;
	}

	&__filter {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;

		ul {
			display: flex;
			align-items: center;
			margin-right: 20px;
			flex: 1;
			max-width: 220px;

			li {
				list-style: none;
				font-size: 14px;
				cursor: pointer;
				color: #d8d8d8;
				white-space: nowrap;
				margin-right: 10px;
				flex: 1;

				&.active {
					color: #000;
				}

				&:not(.active):hover {
					color: #999;
				}
			}
		}

		:deep(.el-date-editor) {
			width: 150px;
		}
	}

	&__list {
		height: 260px;

		li {
			display: flex;
			align-items: center;
			height: 51px;
			list-style: none;
			font-size: 13px;
			cursor: pointer;

			span {
				&:first-child {
					display: inline-block;
					height: 14px;
					width: 14px;
					border-radius: 14px;
					text-align: center;
					line-height: 14px;
					font-size: 12px;
				}

				&:nth-child(2) {
					flex: 1;
					margin: 0 10px;
					letter-spacing: 0.5px;
					color: #222;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
			}

			&:nth-last-child(n + 3) {
				span {
					&:first-child {
						background-color: #000;
						color: #fff;
					}
				}
			}

			&:hover {
				span:nth-child(2) {
					text-decoration: underline;
				}
			}
		}
	}
}
</style>
