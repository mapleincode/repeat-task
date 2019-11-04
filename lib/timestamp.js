/**
 * @Author: maple
 * @Date: 2019-09-02 14:28:08
 * @LastEditors: maple
 * @LastEditTime: 2019-11-04 15:47:57
 */
/**
 * created by maple 2017-01-10
 */

function get() {
    return parseInt(new Date().getTime() / 1000);
}

exports.get = get;

exports.getMs = function() {
    return new Date().getTime();
};

exports.toLocaleString = function() {
    return new Date().toLocaleString();
}
