<template>
	<div class="count-sales">
		<div class="card">
			<div class="card__header">
				<span class="label">总用户数</span>
				<span class="value">3685</span>
			</div>

			<div class="card__container">
				<ul class="count-sales__cop">
					<li>
						<span>周同比</span>

						<div class="fall">
							<el-icon>
								<bottom-right />
							</el-icon>

							<span>-6%</span>
						</div>
					</li>

					<li>
						<span>日同比</span>

						<div class="rise">
							<el-icon>
								<top-right />
							</el-icon>

							<span>+12%</span>
						</div>
					</li>
				</ul>
			</div>

			<div class="card__footer">
				<span class="label">日增用户数</span>
				<span class="value">69</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BottomRight, TopRight } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
.count-sales {
	&__cop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 50px;

		li {
			display: flex;
			list-style: none;
			flex: 1;
			color: var(--el-color-info);

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
}
</style>
