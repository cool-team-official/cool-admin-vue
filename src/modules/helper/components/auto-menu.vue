<template>
	<el-button type="success" @click="open" v-if="isDev">{{ $t('快速创建') }}</el-button>

	<cl-form ref="Form">
		<template #slot-entity="{ scope }">
			<el-cascader
				v-model="scope.entity"
				filterable
				clearable
				separator="."
				:options="tree"
				:placeholder="$t('请选择数据结构')"
				@change="onEntityChange"
			/>
		</template>
	</cl-form>

	<ai-code-dev path="/ai" :ref="setRefs('aiCode')" hide />
</template>

<script lang="ts" setup>
defineOptions({
	name: 'menu-create'
});

import { isEmpty } from 'lodash-es';
import { useCool } from '/@/cool';
import { useForm } from '@cool-vue/crud';
import { deepPaths } from '/@/cool/utils';
import { computed, onMounted } from 'vue';
import { useMenu } from '../hooks';
import { useI18n } from 'vue-i18n';
import { isDev } from '/@/config';
import AiCodeDev from './ai-code/dev.vue';

const { service, mitt, refs, setRefs } = useCool();
const menu = useMenu();
const Form = useForm();
const { t } = useI18n();

// 实体列表
const list: any[] = [];

// 实体树形列表
const tree = computed(() => deepPaths(list.map(e => e.value)));

// 打开
function open() {
	refs.aiCode.send('getEps');

	Form.value?.open({
		title: t('快速创建'),
		width: '800px',
		items: [
			{
				prop: 'entity',
				label: t('数据结构'),
				component: {
					name: 'slot-entity'
				},
				span: 8,
				required: true
			},
			{
				prop: 'parentId',
				label: t('上级节点'),
				span: 16,
				component: {
					name: 'cl-menu-select',
					props: {
						type: 1,
						placeholder: t('请选择上级节点')
					}
				}
			},
			{
				prop: 'name',
				label: t('菜单名称'),
				span: 8,
				component: {
					name: 'el-input',
					props: {
						placeholder: t('请输入菜单名称')
					}
				},
				required: true
			},
			{
				prop: 'router',
				label: t('菜单路由'),
				span: 8,
				component: {
					name: 'el-input',
					props: {
						placeholder: t('请输入菜单路由，如：/test')
					}
				},
				rules: {
					required: true,
					validator(_, value, callback) {
						if (!(value || '').startsWith('/')) {
							callback(new Error(t('必须以 / 开头')));
						} else {
							callback();
						}
					}
				}
			},
			{
				prop: 'orderNum',
				label: t('菜单排序'),
				span: 8,
				value: 1,
				component: {
					name: 'el-input-number',
					props: {
						placeholder: t('请填写菜单排序'),
						min: 0,
						max: 99,
						'controls-position': 'right'
					}
				}
			},
			{
				prop: 'icon',
				label: t('菜单图标'),
				component: {
					name: 'cl-menu-icon',
					props: {
						showIcon: true,
						placeholder: t('请选择图标')
					}
				}
			},
			{
				prop: 'keepAlive',
				value: true,
				flex: false,
				label: t('路由缓存'),
				component: {
					name: 'cl-switch'
				}
			}
		],
		op: {
			saveButtonText: t('开始创建')
		},
		on: {
			async submit(data, { done, close }) {
				const entity = list.find(e => e.value == data.entity.join('/'));

				// 发送消息
				refs.aiCode.send(
					'createVue',
					{
						...entity,
						router: data.router
					},
					(code: string) => {
						menu.create({
							...data,
							module: entity.module,
							prefix: entity.prefix,
							api: entity.api,
							code
						})
							.then(create => {
								mitt.emit('helper.createMenu');

								create();
								close();
							})
							.catch(err => {
								console.error(err);
								done();
							});
					}
				);
			}
		}
	});
}

import { ref } from 'vue';

// 菜单列表
const menuList = ref<any[]>([]);
service.base.sys.menu.list().then(res => {
	menuList.value = res.filter( item => item.type==0 );
});

// 实体切换
function onEntityChange(val: any) {
	const item = list.find(e => e.value == val?.join('/'));

	if (item) {
		Form.value?.setForm('router', `/${item.value}`);
		Form.value?.setForm('module', item.module);

		if ( item.menu ){
			Form.value?.setForm('name', item.menu + '管理' );
		}

		const module = `/${item.module}`
		menuList.value.forEach( menuItem => {
			if (menuItem.router == module ) {
				Form.value?.setForm('parentId', menuItem.id );
			}
		})

	}
}

onMounted(() => {
	service.base.open.eps().then((res: EpsData) => {
		for (const i in res) {
			res[i].forEach(e => {
				if (!isEmpty(e.columns)) {
					list.push({
						value: e.prefix.substring(7),
						...e
					});
				}
			});
		}
	});
});
</script>

<style lang="scss" scoped>
.hide {
	height: 0;
	width: 0;
	opacity: 0;
	overflow: hidden;
}
</style>
