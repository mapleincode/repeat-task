/**
 * created by maple 2017-01-10
 */
'use strict';

const EventEmitter = require('events').EventEmitter;

const Tigger = require('./lib/trigger');
const ts = require('./lib/timestamp');

module.exports = class Task extends EventEmitter {
    constructor(heartbeatCheckTime, taskExpireTime, defaultTime) {
        super();

        if (typeof heartbeatCheckTime === 'object') {
            const {
                hbCheckTime: _heartbeatCheckTime,
                expireTime: _taskExpireTime,
                defaultTime: _defaultTime
            } = heartbeatCheckTime;

            heartbeatCheckTime = _heartbeatCheckTime;
            taskExpireTime = _taskExpireTime;
            defaultTime = _defaultTime;
        }

        // heartbeatCheckTime
        this.heartbeatCheckTime = heartbeatCheckTime || 10000;
        // taskExpireTime
        this.taskExpireTime = taskExpireTime || 20000;

        // task name list
        this.taskNames = [];
        // task list
        this.tasks = [];
        // task intervalTime list
        this.taskIntervalTimes = [];
        // task heartbeatTime list
        this.heartbeatTimes = [];
        // task tigger list
        this.tiggers = [];
        // task options
        this.taskOptions = [];

        this.defaultTime = defaultTime;
    }
    _startTasks() {
        let self = this;
        // start tasks
        self.taskNames.forEach((taskName, index) => {
            let taskIntervalTime = self.taskIntervalTimes[index];
            let task = self.tasks[index];
            let t = new Tigger(taskIntervalTime);
            let options = self.taskOptions[index];
            t.on('done', () => {
                self.heartbeatTimes[index] = ts.get();
                let beginTime;
                if(options.timing) {
                    beginTime = ts.getMs();
                }
                task(() => {
                    if(beginTime && options.timing) {
                        self.emit('log', `【  TASK  】${taskName} RUN TIME ${ts.getMs() - beginTime} ms`);
                    }
                });
                self.emit('log', `【  TASK  】${taskName} START RUN at time ${ts.get()}`);
            });
            t.start();
            self.tiggers[index] = t;
        });
    }
    run() {
        // start check tasks
        this._startTasks();
        this.emit('start');
    }
    stop() {
        let tiggers = this.tiggers;
        try {
            for(let t of tiggers) {
                if(!t || typeof t.stop !== 'function') continue;
                t.stop();
                t.removeAllListeners();
            }
        } catch(e) {
            this.emit('error', e);
        }
        this.emit('stop');
        
    }
    addTask(taskName, task, taskIntervalTime, options) {
        if (typeof taskIntervalTime === 'object') {
            options = taskIntervalTime;
            taskIntervalTime = null;
        }

        // 默认间隔时间
        if (!taskIntervalTime) {
            taskIntervalTime = this.defaultTime;
        }

        if(!taskName || !parseInt(taskIntervalTime)) {
            return this.emit('error', new Error('illegal taskName & intervalTime'));
        }
        if(!task || typeof task !== 'function') {
            return this.emit('error', new Error('task should be function'));
        }
        if(this.taskNames.indexOf(taskName) > -1) {
            return this.emit('error', new Error(`taskName ${taskName} is existed!`));
        }

        this.taskNames.push(taskName);
        this.tasks.push(task);
        this.taskIntervalTimes.push(parseInt(taskIntervalTime));
        this.heartbeatTimes.push(null);
        this.taskOptions.push(options || {});
    }
};
