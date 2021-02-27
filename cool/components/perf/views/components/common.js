import VueEcharts from "vue-echarts";

function unit_size(v) {
	if (v === 0) return "0 B";
	let k = 1024;
	let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let i = Math.floor(Math.log(v) / Math.log(k));

	return (v / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

export default {
	components: {
		VueEcharts
	},

	filters: {
		unit_size,

		fixed2(v) {
			return v ? parseFloat(parseFloat(v).toFixed(2)) : 0;
		}
	},

	methods: {
		conByte: unit_size
	}
};
