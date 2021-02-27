import Common from "./common";
import Open from "./open";
import SysUser from "./user";
import SysMenu from "./menu";
import SysRole from "./role";
import SysDept from "./dept";
import PluginInfo from "./plugin";

export default {
	common: new Common(),
	open: new Open(),
	system: {
		user: new SysUser(),
		menu: new SysMenu(),
		role: new SysRole(),
		dept: new SysDept()
	},
	plugin: {
		info: new PluginInfo()
	}
};
