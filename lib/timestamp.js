/**
 * @Author: maple
 * @Date: 2019-09-02 14:28:08
 * @LastEditors: maple
 * @LastEditTime: 2020-10-28 18:34:41
 */
/**
 * created by maple 2017-01-10
 */

function get () {
  return parseInt(new Date().getTime() / 1000);
}

exports.get = get;

exports.getMs = function () {
  return new Date().getTime();
};

exports.toLocaleString = function () {
  return new Date().toLocaleString();
};
