/** 与考勤系统交互的 SessionID 的 key */
export declare const SESSION_KEY = "PHPSESSID";
/**
 * 一个与办公易考勤系统交互的会话，
 * 存储了员工ID与服务器 Session ID
 */
export default class KQSession {
    readonly userName: string;
    private static hashObj;
    /** 获取 GPS 坐标的 hash */
    static getGPSHash({lat, lng}: KQ.Range): string;
    constructor(userName: string);
    private cookie;
    /** 获取与用户ID关联的会话ID */
    private getSessionID();
    /** 获取服务器时间，用于打卡 */
    getServerTime(): Promise<number>;
    /** 初始会话，完成后可进行打卡操作 */
    init(): Promise<void>;
    /** 打卡 */
    check({deviceID, deviceType, ...location}: KQ.CheckOption): Promise<KQ.ServerResult<KQ.CheckResult>>;
    /** 获取允许考勤打卡的位置列表 */
    getGPSList(): Promise<KQ.Range[]>;
    /** 获取【早退】标识，返回 1 表示打卡时将做为早退，0 表示正常 */
    getEarlyFlag(): Promise<number>;
}
