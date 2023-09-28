export const CodeSnippets = {
	db: `import { BaseEntity } from '@cool-midway/core';
import { Column, Entity } from 'typeorm';

/**
 * 描述
 */
@Entity('xxx_xxx')
export class xxxEntity extends BaseEntity {
    @Column({ comment: 'xxx' })
    xxx: string;
}`,
	func: `import { CloudCrud } from '@cool-midway/cloud';

/**
 * 描述
 */
export class Xxx extends CloudCrud {
    async main() {
        this.setCurdOption({
            entity: 'xxx',
			api: ['add', 'delete', 'update', 'info', 'list', 'page']
        });
    }
}`,
	req: `{
	"method": "xxx",
	"params": {
		
	}
}`
};

export const CodeDeclare = `
declare module 'typeorm' {
  export declare function Entity(options?: EntityOptions): ClassDecorator;
  export declare function Entity(name?: string, options?: EntityOptions): ClassDecorator;

  export interface EntityOptions {
    /**
     * Table name.
     * If not specified then naming strategy will generate table name from entity name.
     */
    name?: string;
    /**
     * Specifies a default order by used for queries from this table when no explicit order by is specified.
     */
    orderBy?: OrderByCondition | ((object: any) => OrderByCondition | any);
    /**
     * Table's database engine type (like "InnoDB", "MyISAM", etc).
     * It is used only during table creation.
     * If you update this value and table is already created, it will not change table's engine type.
     * Note that not all databases support this option.
     */
    engine?: string;
    /**
     * Database name. Used in Mysql and Sql Server.
     */
    database?: string;
    /**
     * Schema name. Used in Postgres and Sql Server.
     */
    schema?: string;
    /**
     * Indicates if schema synchronization is enabled or disabled for this entity.
     * If it will be set to false then schema sync will and migrations ignore this entity.
     * By default schema synchronization is enabled for all entities.
     */
    synchronize?: boolean;
    /**
     * If set to 'true' this option disables Sqlite's default behaviour of secretly creating
     * an integer primary key column named 'rowid' on table creation.
     * @see https://www.sqlite.org/withoutrowid.html.
     */
    withoutRowid?: boolean;
  }

  export declare function Column(options: ColumnOptions): PropertyDecorator;

  /**
   * Describes all column's options.
   */
  export interface ColumnOptions extends ColumnCommonOptions {
    /**
     * Column type. Must be one of the value from the ColumnTypes class.
     */
    type?: ColumnType;
    /**
     * Column name in the database.
     */
    name?: string;
    /**
     * Column type's length. Used only on some column types.
     * For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).
     */
    length?: string | number;
    /**
     * Column type's display width. Used only on some column types in MySQL.
     * For example, INT(4) specifies an INT with a display width of four digits.
     */
    width?: number;
    /**
     * Indicates if column's value can be set to NULL.
     * Default value is "false".
     */
    nullable?: boolean;
    /**
     * Indicates if column value is not updated by "save" operation.
     * It means you'll be able to write this value only when you first time insert the object.
     * Default value is "false".
     *
     * @deprecated Please use the \`update\` option instead.  Careful, it takes
     * the opposite value to readonly.
     *
     */
    readonly?: boolean;
    /**
     * Indicates if column value is updated by "save" operation.
     * If false, you'll be able to write this value only when you first time insert the object.
     * Default value is "true".
     */
    update?: boolean;
    /**
     * Indicates if column is always selected by QueryBuilder and find operations.
     * Default value is "true".
     */
    select?: boolean;
    /**
     * Indicates if column is inserted by default.
     * Default value is "true".
     */
    insert?: boolean;
    /**
     * Default database value.
     */
    default?: any;
    /**
     * ON UPDATE trigger. Works only for MySQL.
     */
    onUpdate?: string;
    /**
     * Indicates if this column is a primary key.
     * Same can be achieved when @PrimaryColumn decorator is used.
     */
    primary?: boolean;
    /**
     * Specifies if column's value must be unique or not.
     */
    unique?: boolean;
    /**
     * Column comment. Not supported by all database types.
     */
    comment?: string;
    /**
     * The precision for a decimal (exact numeric) column (applies only for decimal column), which is the maximum
     * number of digits that are stored for the values.
     */
    precision?: number | null;
    /**
     * The scale for a decimal (exact numeric) column (applies only for decimal column), which represents the number
     * of digits to the right of the decimal point and must not be greater than precision.
     */
    scale?: number;
    /**
     * Puts ZEROFILL attribute on to numeric column. Works only for MySQL.
     * If you specify ZEROFILL for a numeric column, MySQL automatically adds the UNSIGNED attribute to this column
     */
    zerofill?: boolean;
    /**
     * Puts UNSIGNED attribute on to numeric column. Works only for MySQL.
     */
    unsigned?: boolean;
    /**
     * Defines a column character set.
     * Not supported by all database types.
     */
    charset?: string;
    /**
     * Defines a column collation.
     */
    collation?: string;
    /**
     * Array of possible enumerated values.
     */
    enum?: (string | number)[] | Object;
    /**
     * Exact name of enum
     */
    enumName?: string;
    /**
     * If this column is primary key then this specifies the name for it.
     */
    primaryKeyConstraintName?: string;
    /**
     * If this column is foreign key then this specifies the name for it.
     */
    foreignKeyConstraintName?: string;
    /**
     * Generated column expression.
     */
    asExpression?: string;
    /**
     * Generated column type.
     */
    generatedType?: "VIRTUAL" | "STORED";
    /**
     * Identity column type. Supports only in Postgres 10+.
     */
    generatedIdentity?: "ALWAYS" | "BY DEFAULT";
    /**
     * Return type of HSTORE column.
     * Returns value as string or as object.
     */
    hstoreType?: "object" | "string";
    /**
     * Indicates if this column is an array.
     * Can be simply set to true or array length can be specified.
     * Supported only by postgres.
     */
    array?: boolean;
    /**
     * Specifies a value transformer that is to be used to (un)marshal
     * this column when reading or writing to the database.
     */
    transformer?: ValueTransformer | ValueTransformer[];
    /**
     * Spatial Feature Type (Geometry, Point, Polygon, etc.)
     */
    spatialFeatureType?: string;
    /**
     * SRID (Spatial Reference ID (EPSG code))
     */
    srid?: number;
  }

  export declare function Index(options?: IndexOptions): ClassDecorator & PropertyDecorator;
  export interface IndexOptions {
    /**
     * Indicates if this composite index must be unique or not.
     */
    unique?: boolean;
    /**
     * The SPATIAL modifier indexes the entire column and does not allow indexed columns to contain NULL values.
     * Works only in MySQL and PostgreSQL.
     */
    spatial?: boolean;
    /**
     * The FULLTEXT modifier indexes the entire column and does not allow prefixing.
     * Works only in MySQL.
     */
    fulltext?: boolean;
    /**
     * NULL_FILTERED indexes are particularly useful for indexing sparse columns, where most rows contain a NULL value.
     * In these cases, the NULL_FILTERED index can be considerably smaller and more efficient to maintain than
     * a normal index that includes NULL values.
     *
     * Works only in Spanner.
     */
    nullFiltered?: boolean;
    /**
     * Fulltext parser.
     * Works only in MySQL.
     */
    parser?: string;
    /**
     * Index filter condition.
     */
    where?: string;
    /**
     * If true, the index only references documents with the specified field.
     * These indexes use less space but behave differently in some situations (particularly sorts).
     * This option is only supported for mongodb database.
     */
    sparse?: boolean;
    /**
     * Builds the index in the background so that building an index an does not block other database activities.
     * This option is only supported for mongodb database.
     */
    background?: boolean;
    /**
     * Specifies a time to live, in seconds.
     * This option is only supported for mongodb database.
     */
    expireAfterSeconds?: number;
  }
}

declare module '@cool-midway/core' {
  export declare abstract class BaseEntity extends CoolBaseEntity {
    id: number;
    createTime: Date;
    updateTime: Date;
  }
}

declare module '@cool-midway/cloud' {
  export type ApiTypes = "add" | "delete" | "update" | "page" | "info" | "list";
  // Crud配置

  export interface CurdOption {
    // 路由前缀，不配置默认是按Controller下的文件夹路径
    prefix?: string;
    // curd api接口
    api: ApiTypes[];
    // 分页查询配置
    pageQueryOp?: QueryOp | Function;
    // 非分页查询配置
    listQueryOp?: QueryOp | Function;
    // 插入参数
    insertParam?: Function;
    // 操作之前
    before?: Function;
    // info 忽略返回属性
    infoIgnoreProperty?: string[];
    // 实体
    entity: any;
    // 服务
    service?: any;
    // api标签
    urlTag?: {
      name: "ignoreToken" | string;
      url: ApiTypes[];
    };
  }
  export interface JoinOp {
    // 实体
    entity: any;
    // 别名
    alias: string;
    // 关联条件
    condition: string;
    // 关联类型
    type?: "innerJoin" | "leftJoin";
  }

  // 字段匹配
  export interface FieldEq {
    // 字段
    column: string;
    // 请求参数
    requestParam: string;
  }
  // 查询配置
  export interface QueryOp {
    // 需要模糊查询的字段
    keyWordLikeFields?: string[];
    // 查询条件
    where?: Function;
    // 查询字段
    select?: string[];
    // 字段相等
    fieldEq?: string[] | FieldEq[];
    // 添加排序条件
    addOrderBy?: {};
    // 关联配置
    join?: JoinOp[];
    // 其他条件
    extend?: Function;
  }

  // Controller 配置
  export interface ControllerOption {
    // crud配置 如果是字符串则为路由前缀，不配置默认是按Controller下的文件夹路径
    curdOption?: CurdOption & string;
    // 路由配置
    routerOptions?: {
      // 是否敏感
      sensitive?: boolean;
      // 路由中间件
      middleware?: MiddlewareParamArray;
      // 别名
      alias?: string[];
      // 描述
      description?: string;
      // 标签名称
      tagName?: string;
    };
  }

  /**
   * 模块配置
   */
  export interface ModuleConfig {
      /** 名称 */
      name: string;
      /** 描述 */
      description: string;
      /** 模块中间件 */
      middlewares?: MiddlewareParamArray;
      /** 全局中间件 */
      globalMiddlewares?: MiddlewareParamArray;
      /** 模块加载顺序，默认为0，值越大越优先加载 */
      order?: number;
  }
  export interface CoolConfig {
      /** 是否自动导入数据库 */
      initDB?: boolean;
      /** crud配置 */
      crud?: {
          /** 软删除 */
          softDelete: boolean;
          /** 分页查询每页条数 */
          pageSize: number;
      };
      /** elasticsearch配置 */
      es?: {
          nodes: string[];
      };
      /** pay */
      pay?: {
          /** 微信支付 */
          wx?: CoolWxPayConfig;
          /** 支付宝支付 */
          ali?: CoolAliPayConfig;
      };
      /** rpc */
      rpc?: CoolRpcConfig;
      /** redis  */
      redis?: RedisConfig | RedisConfig[];
      /** 文件上传 */
      file?: {
          /** 上传模式 */
          mode: MODETYPE;
          /** 本地上传 文件地址前缀 */
          domain?: string;
          /** oss */
          oss?: OSSConfig;
          /** cos */
          cos?: COSConfig;
          /** qiniu */
          qiniu?: QINIUConfig;
      };
      /** IOT 配置 */
      iot: CoolIotConfig;
  }
  export interface CoolRpcConfig {
      /** 服务名称 */
      name: string;
      /** redis */
      redis: RedisConfig & RedisConfig[] & unknown;
  }
  export interface RedisConfig {
      /** host */
      host: string;
      /** password */
      password: string;
      /** port */
      port: number;
      /** db */
      db: number;
  }
  export declare enum MODETYPE {
      /** 本地 */
      LOCAL = "local",
      /** 云存储 */
      CLOUD = "cloud",
      /** 其他 */
      OTHER = "other"
  }
  export declare enum CLOUDTYPE {
      /** 阿里云存储 */
      OSS = "oss",
      /** 腾讯云存储 */
      COS = "cos",
      /** 七牛云存储 */
      QINIU = "qiniu"
  }
  /**
   * 上传模式
   */
  export interface Mode {
      /** 模式 */
      mode: MODETYPE;
      /** 类型 */
      type: string;
  }
  /**
   * 模块配置
   */
  export interface CoolFileConfig {
      /** 上传模式 */
      mode: MODETYPE;
      /** 阿里云oss 配置 */
      oss: OSSConfig;
      /** 腾讯云 cos配置 */
      cos: COSConfig;
      /** 七牛云 配置 */
      qiniu: QINIUConfig;
      /** 文件前缀 */
      domain: string;
  }
  /**
   * OSS 配置
   */
  export interface OSSConfig {
      /** 阿里云accessKeyId */
      accessKeyId: string;
      /** 阿里云accessKeySecret */
      accessKeySecret: string;
      /** 阿里云oss的bucket */
      bucket: string;
      /** 阿里云oss的endpoint */
      endpoint: string;
      /** 阿里云oss的timeout */
      timeout: string;
      /** 签名失效时间，毫秒 */
      expAfter?: number;
      /** 文件最大的 size */
      maxSize?: number;
  }
  /**
   * COS 配置
   */
  export interface COSConfig {
      /** 腾讯云accessKeyId */
      accessKeyId: string;
      /** 腾讯云accessKeySecret */
      accessKeySecret: string;
      /** 腾讯云cos的bucket */
      bucket: string;
      /** 腾讯云cos的区域 */
      region: string;
      /** 腾讯云cos的公网访问地址 */
      publicDomain: string;
      /** 上传持续时间 */
      durationSeconds?: number;
      /** 允许操作（上传）的对象前缀 */
      allowPrefix?: string;
      /** 密钥的权限列表 */
      allowActions?: string[];
  }
  export interface QINIUConfig {
      /** 七牛云accessKeyId */
      accessKeyId: string;
      /** 七牛云accessKeySecret */
      accessKeySecret: string;
      /** 七牛云cos的bucket */
      bucket: string;
      /** 七牛云cos的区域 */
      region: string;
      /** 七牛云cos的公网访问地址 */
      publicDomain: string;
      /** 上传地址 */
      uploadUrl?: string;
      /** 上传fileKey */
      fileKey?: string;
  }
  /**
   * 微信支付配置
   */
  export interface CoolWxPayConfig {
      /** 直连商户申请的公众号或移动应用appid。 */
      appid: string;
      /** 商户号 */
      mchid: string;
      /** 可选参数 证书序列号 */
      serial_no?: string;
      /** 回调链接 */
      notify_url: string;
      /** 公钥 */
      publicKey: Buffer;
      /** 私钥 */
      privateKey: Buffer;
      /** 可选参数 认证类型，目前为WECHATPAY2-SHA256-RSA2048 */
      authType?: string;
      /** 可选参数 User-Agent */
      userAgent?: string;
      /** 可选参数 APIv3密钥 */
      key?: string;
  }
  /**
   * 支付宝支付配置
   */
  export interface CoolAliPayConfig {
      /** 支付回调地址 */
      notifyUrl: string;
      /** 应用ID */
      appId: string;
      /**
       * 应用私钥字符串
       * RSA签名验签工具：https://docs.open.alipay.com/291/106097）
       * 密钥格式一栏请选择 “PKCS1(非JAVA适用)”
       */
      privateKey: string;
      /** 签名类型 */
      signType?: "RSA2" | "RSA";
      /** 支付宝公钥（需要对返回值做验签时候必填） */
      alipayPublicKey?: string;
      /** 网关 */
      gateway?: string;
      /** 网关超时时间（单位毫秒，默认 5s） */
      timeout?: number;
      /** 是否把网关返回的下划线 key 转换为驼峰写法 */
      camelcase?: boolean;
      /** 编码（只支持 utf-8） */
      charset?: "utf-8";
      /** api版本 */
      version?: "1.0";
      urllib?: any;
      /** 指定private key类型, 默认： PKCS1, PKCS8: PRIVATE KEY, PKCS1: RSA PRIVATE KEY */
      keyType?: "PKCS1" | "PKCS8";
      /** 应用公钥证书文件路径 */
      appCertPath?: string;
      /** 应用公钥证书文件内容 */
      appCertContent?: string | Buffer;
      /** 应用公钥证书sn */
      appCertSn?: string;
      /** 支付宝根证书文件路径 */
      alipayRootCertPath?: string;
      /** 支付宝根证书文件内容 */
      alipayRootCertContent?: string | Buffer;
      /** 支付宝根证书sn */
      alipayRootCertSn?: string;
      /** 支付宝公钥证书文件路径 */
      alipayPublicCertPath?: string;
      /** 支付宝公钥证书文件内容 */
      alipayPublicCertContent?: string | Buffer;
      /** 支付宝公钥证书sn */
      alipayCertSn?: string;
      /** AES密钥，调用AES加解密相关接口时需要 */
      encryptKey?: string;
      /** 服务器地址 */
      wsServiceUrl?: string;
  }
  /**
   * IOT配置
   */
  export interface CoolIotConfig {
      /** MQTT服务端口 */
      port: number;
      /** MQTT Websocket服务端口 */
      wsPort: number;
      /** redis 配置 mqtt cluster下必须要配置 */
      redis?: {
          /** host */
          host: string;
          /** port */
          port: number;
          /** password */
          password: string;
          /** db */
          db: number;
      };
      /** 发布消息配置 */
      publish?: PublishPacket;
      /** 认证 */
      auth?: {
          /** 用户 */
          username: string;
          /** 密码 */
          password: string;
      };
      /** 服务配置 */
      serve?: AedesOptions;
  }

  export declare abstract class CloudCrud {
    ctx: any;
    curdOption: CurdOption;
    coolCloudDb: CoolCloudDb;
    coolConfig: CoolConfig;
    entity: Repository<any>;
    app: IMidwayApplication;
    req: CloudReq;
    coolEventManager: CoolEventManager;
    protected sqlParams: any;
    setCurdOption(curdOption: CurdOption): void;
    /**
     * 设置实体
     * @param entityModel
     */
    setEntity(): Promise<void>;
    abstract main(req: CloudReq): Promise<void>;
    init(req: CloudReq): Promise<void>;
    /**
     * 参数安全性检查
     * @param params
     */
    paramSafetyCheck(params: any): Promise<boolean>;
    /**
     * 非分页查询
     * @param query 查询条件
     * @param option 查询配置
     */
    list(query: any): Promise<any>;
    /**
     * 执行SQL并获得分页数据
     * @param sql 执行的sql语句
     * @param query 分页查询条件
     * @param autoSort 是否自动排序
     */
    sqlRenderPage(sql: any, query: any, autoSort?: boolean): Promise<{
        list: any;
        pagination: {
            page: number;
            size: number;
            total: number;
        };
    }>;
    /**
     * 分页查询
     * @param connectionName 连接名
     */
    page(query: any): Promise<{
        list: any;
        pagination: {
            page: number;
            size: number;
            total: number;
        };
    }>;
    /**
     * 获得查询个数的SQL
     * @param sql
     */
    getCountSql(sql: any): string;
    /**
     * 操作entity获得分页数据，不用写sql
     * @param find QueryBuilder
     * @param query
     * @param autoSort
     * @param connectionName
     */
    entityRenderPage(find: SelectQueryBuilder<any>, query: any, autoSort?: boolean): Promise<{
        list: any[];
        pagination: {
            page: number;
            size: number;
            total: number;
        };
    }>;
    /**
     * 检查排序
     * @param sort 排序
     * @returns
     */
    private checkSort;
    /**
     * 原生查询
     * @param sql
     * @param params
     */
    nativeQuery(sql: any, params?: any): Promise<any>;
    /**
     * 获得ORM管理
     *  @param connectionName 连接名称
     */
    getOrmManager(): import("../db/source").CoolDataSource;
    private before;
    /**
     * 插入参数值
     * @param curdOption 配置
     */
    private insertParam;
    /**
     * 新增|修改|删除 之后的操作
     * @param data 对应数据
     */
    modifyAfter(data: any, type: 'delete' | 'update' | 'add'): Promise<void>;
    /**
     * 新增|修改|删除 之前的操作
     * @param data 对应数据
     */
    modifyBefore(data: any, type: 'delete' | 'update' | 'add'): Promise<void>;
    /**
     * 新增
     * @param param
     * @returns
     */
    add(param: any): Promise<{
        id: any;
    }>;
    /**
     * 新增|修改
     * @param param 数据
     */
    addOrUpdate(param: any | any[]): Promise<void>;
    /**
     * 删除
     * @param ids 删除的ID集合 如：[1,2,3] 或者 1,2,3
     */
    delete(ids: any): Promise<void>;
    /**
     * 软删除
     * @param ids 删除的ID数组
     * @param entity 实体
     */
    softDelete(ids: string[], entity?: Repository<any>, userId?: string): Promise<void>;
    /**
     * 修改
     * @param param 数据
     */
    update(param: any): Promise<void>;
    /**
     * 获得单个ID
     * @param id ID
     */
    info(id: any): Promise<any>;
    /**
     * 构建查询配置
     * @param query 前端查询
     * @param option
     */
    private getOptionFind;
  }
}
`;
