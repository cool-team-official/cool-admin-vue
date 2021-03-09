<template>
	<cl-scrollbar>
		<div class="system-perf">
			<ct ref="ct"></ct>

			<network ref="network"></network>

			<el-row :gutter="20">
				<el-col :lg="12" :xs="24" style="margin-top: 15px">
					<redis ref="redis"></redis>
				</el-col>

				<el-col :lg="12" :xs="24" style="margin-top: 15px">
					<mysql ref="mysql"></mysql>
				</el-col>
			</el-row>
		</div>
	</cl-scrollbar>
</template>

<script>
import Ct from "../components/perf/ct";
import Network from "../components/perf/network";
import Redis from "../components/perf/redis";
import Mysql from "../components/perf/mysql";

export default {
	components: {
		Network,
		Ct,
		Redis,
		Mysql
	},

	beforeRouteLeave(to, from, next) {
		clearTimeout(this.tiemr);
		next();
	},

	data() {
		return {
			list: {},
			tiemr: null
		};
	},

	mounted() {
		this.refresh();

		this.tiemr = setInterval(this.refresh, 3000);
	},

	methods: {
		refresh() {
			this.$service.system.info.record().then(res => {
				const { network, ct, redis, mysql } = this.$refs;

				if (network) {
					network.refresh(res);
				}

				if (ct) {
					ct.refresh(res);
				}

				if (redis) {
					redis.refresh(res);
				}

				if (mysql) {
					mysql.refresh(res);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.system-perf {
}
</style>
