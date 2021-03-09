import { BaseService, Service, Permission } from "cl-admin";

@Service("base/plugin/info")
class PluginInfo extends BaseService {
	@Permission("config")
	config(data) {
		return this.request({
			url: "/config",
			method: "POST",
			data
		});
	}

	@Permission("getConfig")
	getConfig(params) {
		return this.request({
			url: "/getConfig",
			params
		});
	}

	@Permission("enable")
	enable(data) {
		return this.request({
			url: "/enable",
			method: "POST",
			data
		});
	}
}

export default PluginInfo;
