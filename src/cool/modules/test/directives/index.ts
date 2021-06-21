// 参考官方例子 https://v3.vuejs.org/guide/custom-directive.html

export default {
	// 聚焦元素
	focus: {
		mounted(el) {
			el.focus();
		}
	}
};

// 在模块中使用
// <input v-focus />
