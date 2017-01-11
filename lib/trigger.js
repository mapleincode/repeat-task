/**
 * created by maple 2017-01-10
 */
'use strict';

const EventEmitter = require("events").EventEmitter;

class Trigger extends EventEmitter {
    constructor(intervalTime) {
        super();
        this.intervalTime = intervalTime;
        this.runningStatus = true;
        this.setMaxListeners(0);
        if(isNaN(parseInt(intervalTime))) {
            this.emit('error', new Error('非正常数值'))
        }
    }
    std(intervalTime) {
        const self = this;
        setTimeout(function () {
            if(self.runningStatus) {
                self.emit('done');
                self.std(intervalTime);
            }
        }, intervalTime);
    }
    start() {
        const intervalTime = this.intervalTime;
        this.std(intervalTime);
    }
    stop() {
        this.runningStatus = false;
    }
    restart() {
        this.runningStatus = true;
        this.std(this.intervalTime);
    }
}

module.exports = Trigger;
