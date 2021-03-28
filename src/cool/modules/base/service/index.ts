import Common from "./common";
import Open from "./open";
import SysUser from "./system/user";
import SysMenu from "./system/menu";
import SysRole from "./system/role";
import SysDept from "./system/dept";
import SysTask from "./system/task";
import SysParam from "./system/param";
import SysLog from "./system/log";
import PluginInfo from "./plugin/info";

export default {
	common: new Common(),
	open: new Open(),
	system: {
		user: new SysUser(),
		menu: new SysMenu(),
		role: new SysRole(),
		dept: new SysDept(),
		task: new SysTask(),
		param: new SysParam(),
		log: new SysLog()
	},
	plugin: {
		info: new PluginInfo()
	}
};
