<template>

	<el-select-v2
		v-model="value"
		style="width: 240px"
		:multiple="multiple"
		filterable
		remote
		:remote-method="remoteMethod"
		clearable
		:options="options"
		:loading="loading"
		placeholder="Please enter a keyword"
	/>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BaseService } from '/@/cool';

export default defineComponent({
	name: 'remote-select',
	props: {

		// 服务器请求地址
		namespace: {
			type: String,
		},

		// 显示给用户看的字段
		field: {
			type: String,
			default: 'title',
		},

		// 是否多选
		multiple: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		return {
			value: '',
			loading: false,
			options: [],
			service: Object as BaseService,
		};
	},
	mounted() {
		this.service = new BaseService( this.namespace )

		this.remoteMethod('')
	},
	methods: {
		async remoteMethod(query: string = '') {

			this.loading = true;

			const res: any = await this.service.page( { keyWord: query, page: 1, size: 100 } )

			this.options = res.list.map((item) => {
				return {
					value: item.id,
					label: item[this.field]
				}
			})

			this.loading = false;


		}
	}
});
</script>

<style scoped lang="scss"></style>
