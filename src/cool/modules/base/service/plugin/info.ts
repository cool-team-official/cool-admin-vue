import { BaseService, Service, Permission } from "@/core";

@Service("base/plugin/info")
class PluginInfo extends BaseService {
	@Permission("config")
	config(data: any) {
		return this.request({
			url: "/config",
			method: "POST",
			data
		});
	}

	@Permission("getConfig")
	getConfig(params: any) {
		return this.request({
			url: "/getConfig",
			params
		});
	}

	@Permission("enable")
	enable(data: any) {
		return this.request({
			url: "/enable",
			method: "POST",
			data
		});
	}
}

export default PluginInfo;
