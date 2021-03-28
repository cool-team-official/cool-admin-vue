import { BaseService, Service, Permission } from "@/core";

@Service("task/info")
class SysTask extends BaseService {
	@Permission("stop")
	stop(data: any) {
		return this.request({
			url: "/stop",
			method: "POST",
			data
		});
	}

	@Permission("start")
	start(data: any) {
		return this.request({
			url: "/start",
			method: "POST",
			data
		});
	}

	@Permission("once")
	once(data: any) {
		return this.request({
			url: "/once",
			method: "POST",
			data
		});
	}

	@Permission("log")
	log(params: any) {
		return this.request({
			url: "/log",
			params
		});
	}
}

export default SysTask;
