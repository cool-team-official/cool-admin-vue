import { BaseService, Service, Permission } from "/@/core";

@Service("test")
class Test extends BaseService {
	// 继承后可使用：page、list、add、delete、update、info 6个基本接口

	// 添加其他接口
	@Permission("batchAdd") // 是否需要权限控制，建议参数与请求地址保持一致
	batchAdd(params: any): Promise<any> {
		return this.request({
			url: "/batchAdd",
			method: "GET",
			params
			// 参数与 axios 一致
		});
	}
}

export default Test;
