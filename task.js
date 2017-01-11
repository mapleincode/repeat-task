/**
 * created by maple 2017-01-10
 */
'use strict';

const EventEmitter = require("events").EventEmitter;

const Tigger = require('./lib/trigger');
const ts = require('./lib/timestamp');

class Task extends EventEmitter {
    constructor(heartbeatCheckTime, taskExpireTime) {
        super();
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
                        self.emit('log', `【  TASK  】${taskName} 运行时间 ${ts.getMs() - beginTime} ms`)
                    }
                });
                self.emit('log', `【  TASK  】${taskName} 开始运行 ${ts.get()}`);
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
        if(!taskName || !parseInt(taskIntervalTime)) {
            return this.emit('error', new Error('非法的 taskName 和 intervalTime'));
        }
        if(!task || typeof task !== 'function') {
            return this.emit('error', new Error('非法的 task: 不存在或者 TypeError'));
        }
        if(this.taskNames.indexOf(taskName) > -1) {
            return this.emit('error', new Error(`taskName ${taskName} 已存在`));
        }
        this.taskNames.push(taskName);
        this.tasks.push(task);
        this.taskIntervalTimes.push(parseInt(taskIntervalTime));
        this.heartbeatTimes.push(null);
        this.taskOptions.push(options || {});
    }
}
