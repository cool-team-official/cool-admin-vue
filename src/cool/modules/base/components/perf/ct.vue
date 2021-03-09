<template>
	<div class="ct">
		<el-row :gutter="20">
			<el-col :lg="6" :md="12" :xs="24">
				<div class="block">
					<p class="label">负载状态</p>

					<el-popover width="100" trigger="hover">
						<div class="system-perf-progress-popover">
							<ul>
								<li>CPU：{{ cpu.perc | fixed2 }} %</li>
								<li>内存：{{ mem.perc | fixed2 }} %</li>
							</ul>
						</div>

						<el-progress
							slot="reference"
							type="circle"
							:percentage="lb.perc | fixed2"
							:color="lb.perc | status_color"
						></el-progress>
					</el-popover>
				</div>
			</el-col>

			<el-col :lg="6" :md="12" :xs="24">
				<div class="block">
					<p class="label">CPU存使用率</p>

					<el-progress
						type="circle"
						:percentage="cpu.perc | fixed2"
						:color="cpu.perc | status_color"
					></el-progress>
				</div>
			</el-col>

			<el-col :lg="6" :md="12" :xs="24">
				<div class="block">
					<p class="label">内存使用率</p>

					<el-popover width="100" trigger="hover">
						<div class="system-perf-progress-popover">
							<ul>
								<li>总数：{{ mem.total | unit_size }}</li>
								<li>已使用：{{ mem.used | unit_size }}</li>
							</ul>
						</div>

						<el-progress
							slot="reference"
							type="circle"
							:percentage="mem.perc | fixed2"
							:color="mem.perc | status_color"
						></el-progress>
					</el-popover>
				</div>
			</el-col>

			<el-col :lg="6" :md="12" :xs="24" v-for="(item, index) in disk.list" :key="index">
				<div class="block">
					<p class="label">{{ item.mount }}</p>

					<el-popover width="100" trigger="hover">
						<div class="system-perf-progress-popover">
							<ul>
								<li>总数：{{ item.size | unit_size }}</li>
								<li>已使用：{{ item.used | unit_size }}</li>
							</ul>
						</div>

						<el-progress
							slot="reference"
							type="circle"
							:percentage="item.use | fixed2"
							:color="item.use | status_color"
						></el-progress>
					</el-popover>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Common from "./common";

export default {
	filters: {
		status_color(v) {
			if (v < 50) {
				return "#67C23A";
			}

			if (v < 70) {
				return "#E6A23C";
			}

			if (v < 100) {
				return "#F56C6C";
			}
		}
	},

	mixins: [Common],

	data() {
		return {
			lb: {
				perc: 0
			},
			redis: {
				options: {},
				perc: 0
			},
			mysql: {
				options: {},
				number: 0,
				perc: 0
			},
			cpu: {
				options: {},
				perc: 0
			},
			mem: {
				perc: 0,
				total: 0,
				used: 0
			},
			disk: {
				list: [],
				all: 0
			}
		};
	},

	methods: {
		refresh(res) {
			const { data } = res;
			const item = data[data.length - 1];

			this.toMysql(res, item.mysql);
			this.toRedis(res, item.redis);
			this.toCPU(res, item.server.cpu);
			this.toDisk(item.server.disk.filter(e => e.size));
			this.toMem(item.server.mem);
			this.toLB();
		},

		toLB() {
			let mem = this.mem.perc;
			let cpu = this.cpu.perc;

			if (mem >= 90) {
				this.lb.perc = mem;
			} else if (cpu >= 80) {
				this.lb.perc = cpu;
			} else {
				this.lb.perc = mem * 0.4 + cpu * 0.6;
			}
		},

		toCPU(undefined, cpu) {
			this.cpu.perc = cpu.currentload;
		},

		toMem(mem) {
			this.mem.perc = (mem.buffcache / mem.total) * 100;
			this.mem.total = mem.total;
			this.mem.used = mem.buffcache;
		},

		toDisk(disk) {
			this.disk.all = disk.reduce((a, b) => a + b.size, 0);

			this.disk.list = disk.map(e => {
				e.use = e.use.toFixed(2);

				return e;
			});
		},

		toRedis(undefined, item) {
			this.redis.perc = parseFloat(item.Memory.used_memory_dataset_perc);
		},

		toMysql(undefined, item) {
			let free = 0;
			let used = 0;

			item.mysqlSize.forEach(e => {
				free += parseFloat(e.data_free);
				used += parseFloat(e.data_size);
			});

			this.mysql.number = item.mysqlSize.length;
			this.mysql.perc = (used / (free + used)).toFixed(2);
		}
	}
};
</script>

<style lang="scss">
.system-perf-progress-popover {
	ul {
		li {
			list-style: none;
			line-height: 30px;
		}
	}
}
</style>

<style lang="scss" scoped>
.ct {
	background-color: #fff;

	.block {
		background-color: #fff;
		width: 100%;
		border-radius: 3px;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		padding: 20px;
		box-sizing: border-box;
		position: relative;
		height: 220px;
		cursor: pointer;

		.label {
			font-size: 16px;
			height: 40px;
		}

		.perc {
			position: absolute;
			padding: 5px 10px;
			background-color: #fff;
		}

		.c {
			height: 50px;

			.echarts {
				height: 100%;
				width: 100%;
			}
		}
	}
}
</style>
