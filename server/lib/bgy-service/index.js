"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var crypto_1 = require("crypto");
var request_1 = require("./common/request");
var cookie_1 = require("./common/cookie");
var url_1 = require("url");
/** 与考勤系统交互的 SessionID 的 key */
exports.SESSION_KEY = 'PHPSESSID';
/**
 * 一个与办公易考勤系统交互的会话，
 * 存储了员工ID与服务器 Session ID
 */
var KQSession = /** @class */ (function () {
    function KQSession(userName) {
        this.userName = userName;
        this.cookie = new cookie_1["default"]();
        this.cookie.set('bangongyiuser100133043', userName);
    }
    /** 获取 GPS 坐标的 hash */
    KQSession.getGPSHash = function (_a) {
        var lat = _a.lat, lng = _a.lng;
        KQSession.hashObj.update(lng + "|" + lat);
        return KQSession.hashObj.digest('hex');
    };
    /** 获取与用户ID关联的会话ID */
    KQSession.prototype.getSessionID = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, sessionCookie, _a, cookieStr, key, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.cookie.remove(exports.SESSION_KEY);
                        return [4 /*yield*/, request_1["default"]({
                                path: '/attend/index/index?corpid=wx7a3ce8cf2cdfb04c&t=3',
                                headers: {
                                    Cookie: this.cookie.toString()
                                }
                            })];
                    case 1:
                        response = _b.sent();
                        sessionCookie = response.headers['set-cookie'][0];
                        _a = /(\w+)=([^;]+)/ig.exec(sessionCookie), cookieStr = _a[0], key = _a[1], value = _a[2];
                        this.cookie.set(exports.SESSION_KEY, value);
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 获取服务器时间，用于打卡 */
    KQSession.prototype.getServerTime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, timeStampStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request_1["default"]({
                            path: '/attend/check/get-time',
                            headers: {
                                Cookie: this.cookie.toString()
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, request_1.getContent(response)];
                    case 2:
                        timeStampStr = _a.sent();
                        return [2 /*return*/, parseInt(timeStampStr)];
                }
            });
        });
    };
    /** 初始会话，完成后可进行打卡操作 */
    KQSession.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSessionID()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 打卡 */
    KQSession.prototype.check = function (_a) {
        var deviceID = _a.deviceID, deviceType = _a.deviceType, location = __rest(_a, ["deviceID", "deviceType"]);
        return __awaiter(this, void 0, void 0, function () {
            var kqLocation, defaultLocationList, serverTime, param, response, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (deviceID === undefined || deviceType === undefined) {
                            throw new TypeError('参数 设备ID(deviceId) 与设备类型(deviceType) 不能为空！');
                        }
                        kqLocation = location;
                        if (!(!kqLocation.lat || !kqLocation.lng)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getGPSList()];
                    case 1:
                        defaultLocationList = _b.sent();
                        kqLocation = {
                            lat: defaultLocationList[0].lat,
                            lng: defaultLocationList[0].lng
                        };
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.getServerTime()];
                    case 3:
                        serverTime = _b.sent();
                        param = new url_1.URLSearchParams();
                        param.append('device_id', deviceID.toString());
                        param.append('device_type', deviceType.toString());
                        param.append('validityTime', serverTime.toString());
                        param.append('lat', kqLocation.lat.toString());
                        param.append('lng', kqLocation.lng.toString());
                        return [4 /*yield*/, request_1["default"]({
                                path: '/attend/check',
                                method: 'post',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    Cookie: this.cookie.toString()
                                }
                            }, param.toString())];
                    case 4:
                        response = _b.sent();
                        console.log("\u6253\u5361\u53C2\u6570\uFF1A " + param.toString());
                        console.log("Cookie: " + this.cookie.toString());
                        return [4 /*yield*/, request_1.getObject(response)];
                    case 5:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /** 获取允许考勤打卡的位置列表 */
    KQSession.prototype.getGPSList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request_1["default"]({
                            path: '/attend/check/gps-list',
                            headers: {
                                Cookie: this.cookie.toString()
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, request_1.getObject(response)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.data.map(function (_a) {
                                var config = _a.config;
                                return config;
                            })];
                }
            });
        });
    };
    /** 获取【早退】标识，返回 1 表示打卡时将做为早退，0 表示正常 */
    KQSession.prototype.getEarlyFlag = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request_1["default"]({
                            path: '/attend/check/is-early',
                            headers: {
                                Cookie: this.cookie.toString()
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, request_1.getContent(response)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, parseInt(result)];
                }
            });
        });
    };
    KQSession.hashObj = crypto_1.createHash('sha256');
    return KQSession;
}());
exports["default"] = KQSession;
// async function test() {
//   const session = new KQSession('wanli|||e31c10f4094f50c178d31528dad19920');
//   await session.init();
//   const serverTime = await session.getServerTime();
//   console.log(`服务器时间： ${new Date(serverTime * 1000).toLocaleString()}`);
//   const gpsList = await session.getGPSList();
//   console.log(`可打卡位置列表：${gpsList.map((range) => `${range.address}(${KQSession.getGPSHash(range)})`).join(', ')}`);
//   const earlyFlag = await session.getEarlyFlag();
//   console.log(`是否早退：${earlyFlag === 1 ? '是' : '否'}`);
//   // const checkResult = await session.check({ deviceID: 34128, deviceType: 0, lat: '30.63762894523005', lng: '104.07323170017331' });
//   // console.log(`打卡：\r\n ${JSON.stringify(checkResult, null, '  ')}`);
// }
// test();
//# sourceMappingURL=index.js.map