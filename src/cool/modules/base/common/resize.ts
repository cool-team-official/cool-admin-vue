import store from "@/store";

const lock: any = {
	menuCollapse: null,
	showAMenu: null
};

function resize() {
	// 更新数据
	store.commit("SET_BROWSER");

	const { browser, menuCollapse, app } = store.getters;

	if (browser.isMini) {
		// 小屏幕下隐藏一级菜单
		if (lock.showAMenu === null) {
			lock.showAMenu = app.conf.showAMenu;
			store.commit("UPDATE_APP", {
				conf: {
					showAMenu: false
				}
			});
		}

		// 小屏幕下收起左侧菜单
		if (lock.menuCollapse === null) {
			lock.menuCollapse = menuCollapse;
			store.commit("COLLAPSE_MENU", true);
		}
	} else {
		// 大屏幕下显示一级菜单
		if (lock.showAMenu !== null) {
			store.commit("UPDATE_APP", {
				conf: {
					showAMenu: lock.showAMenu
				}
			});
			lock.showAMenu = null;
		}

		// 大屏幕下展开左侧菜单
		if (lock.menuCollapse !== null) {
			store.commit("COLLAPSE_MENU", lock.menuCollapse);
			lock.menuCollapse = null;
		}
	}
}

window.onload = function() {
	window.addEventListener("resize", resize);
	resize();
};
