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
