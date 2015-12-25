//Test loading a Task Object from the repository

require("babel/register");

var database = require('../TediousDatabase.js');
var taskRepository = require('../TaskRepository.js');
var theTask = require('../Model/Task.js');

console.log('Initialise');

var db = new database();
var taskrepo = new taskRepository({
    WorkflowProcessId: 3,
    dbContext: db
});


var task3 = new theTask();
task3.TaskId = 1;
console.log(task3.TableName);

var captureresults = function (rows, rowCount) {
    console.log("Result Capture:" + rowCount);
    console.log(rows);
    console.log(task3);
    console.log("=====================================");
    console.log("Node ID after load" + task3.DateUpdated);
    //deferred.resolve();
};

taskrepo.load(task3, captureresults);