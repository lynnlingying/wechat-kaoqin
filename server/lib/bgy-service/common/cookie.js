"use strict";
exports.__esModule = true;
var querystring_1 = require("querystring");
var default_1 = /** @class */ (function () {
    function default_1() {
        this.cookie = {};
    }
    default_1.prototype.set = function (name, value) {
        this.cookie[name] = value;
    };
    default_1.prototype.remove = function (name) {
        delete this.cookie[name];
    };
    default_1.prototype.toString = function () {
        var _this = this;
        return Object.keys(this.cookie).reduce(function (prev, key) {
            var value = _this.cookie[key];
            var str = key + "=" + querystring_1.escape(value);
            return prev ? prev + "; " + str : str;
        }, '');
    };
    return default_1;
}());
exports["default"] = default_1;
//# sourceMappingURL=cookie.js.map