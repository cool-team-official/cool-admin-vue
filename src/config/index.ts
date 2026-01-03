import { storage } from '../cool';
import dev from './dev';
import prod from './prod';

// 是否开发模式
export const isDev = import.meta.env.DEV;

// 配置
export const config = {
	// 项目信息
	app: {
		name: import.meta.env.VITE_NAME,

		// 菜单
		menu: {
			// 是否分组显示
			isGroup: false,
			// 自定义菜单列表
			list: []
		},

		// 路由
		router: {
			// 模式
			mode: 'hash',
			// 转场动画
			transition: 'slide'
		}
	},

	// 国际化配置
	i18n: {
		locale: storage.get('locale') || 'zh-cn',
		languages: [
			{
				label: '中文',
				value: 'zh-cn'
			},
			{
				label: '繁体中文',
				value: 'zh-tw'
			},
			{
				label: 'English',
				value: 'en'
			}
		]
	},

	// 忽略规则
	ignore: {
		// 不显示请求进度条
		NProgress: ['__cool_*'],
		// 页面不需要登录验证
		token: []
	},

	// 当前环境
	...(isDev ? dev : prod)
};

export * from './proxy';
