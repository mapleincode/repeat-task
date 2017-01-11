# repeat-task

## Explain

a simple tool to run the repeat tasks;

## Usage

```javascript
const Task = require('repeat-task);

const t = new Task();

// add tasks
t.addTask('TaskName1', task1, taskIntervalTime1, {
    timing: true
});
t.addTask('TaskName2', task2, taskIntervalTime2, {
    timing: true
});

// run
t.run();

// listen log
t.on('log', function(log) {
    console.log(log);
});

//listen error
t.on('error', function(err) {
    console.error(err);
});

```