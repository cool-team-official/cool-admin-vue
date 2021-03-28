import { BaseService, Service, Permission } from "@/core";

@Service("base/sys/log")
class SysLog extends BaseService {
	@Permission("clear")
	clear() {
		return this.request({
			url: "/clear",
			method: "POST"
		});
	}

	@Permission("getKeep")
	getKeep() {
		return this.request({
			url: "/getKeep"
		});
	}

	@Permission("setKeep")
	setKeep(value: any) {
		return this.request({
			url: "/setKeep",
			method: "POST",
			data: {
				value
			}
		});
	}
}

export default SysLog;
