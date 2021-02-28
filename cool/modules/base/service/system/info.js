import { BaseService, Service, Permission } from "cl-admin";

@Service("sys/info")
class SysInfo extends BaseService {
	@Permission("record")
	record() {
		return this.request({
			url: "/record"
		});
	}
}

export default SysInfo;
