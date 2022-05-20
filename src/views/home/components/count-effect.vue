<template>
	<div class="count-effect">
		<div class="card">
			<div class="card__header">
				<span class="label">总销售额</span>
				<span class="value">￥15920</span>
			</div>

			<div class="card__container">
				<el-progress :percentage="50" :stroke-width="8" />
			</div>

			<div class="card__footer">
				<ul class="count-effect__cop">
					<li>
						<span>周同比</span>

						<div class="fall">
							<i class="el-icon-bottom-right"></i>
							<span>-4%</span>
						</div>
					</li>

					<li>
						<span>日同比</span>

						<div class="rise">
							<i class="el-icon-top-right"></i>
							<span>+7%</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.count-effect {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		li {
			display: flex;
			list-style: none;
			flex: 1;
			color: #d8d8d8;

			.fall,
			.rise {
				display: flex;
				align-items: center;
				margin-left: 10px;
			}

			.fall {
				color: #13ae7c;
			}

			.rise {
				color: #f21e37;
			}
		}
	}

	.card__container {
		padding-top: 15px;
		padding-right: 10px;
		box-sizing: border-box;
	}
}
</style>
