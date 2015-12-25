//Tests loading a class from the repository and starting the web service


'use strict';
var database = require('../SqlliteDatabase.js');
var express = require('express');
var http = require('http');
var app = express();
//Initial Attempt at making a repository work
var taskRepository = require('../TaskRepository.js');
var taskAssignment = require('../TaskAssignment.js');

var port = process.env.PORT || 3000;
var host = process.env.HOST || "127.0.0.1";


console.log("Begin Web Service");
//Sanity Kill
process.on('uncaughtException', function (err) {
    console.log('Uncaught Exception ' + err + ' , quitting');
    process.exit(1);
});

var db = new database();
var sql = "select * from Task";

function myfunc() {}

//db.log();
//db.log1("select", myfunc);

db.ConnectAndQuery(sql, myfunc);

//3 refers to WorkFlowProcessId = it's magic

var taskrepo = new taskRepository({
    WorkflowProcessId: 3,
    dbContext: db
});

var _TaskId = 1;
var _DateAssigned = '15/1/2015';
var _GroupId = '1';
var _AccessType = 1;
var _NodeId = 1;

var theTaskAssignment = new taskAssignment({
    TaskId: _TaskId,
    DateAssigned: _DateAssigned,
    GroupId: _GroupId,
    AccessType: _AccessType,
    NodeId: _NodeId
});

console.log(theTaskAssignment.DateAssigned);

taskrepo.load(theTaskAssignment, myfunc);


//taskrepo.save(theTaskAssignment, myfunc);





//Web Service Code

console.log("Registering endpoint: /");
app.get('/', function (req, res) {
    res.send('PW Review Process Web Service');
});

console.log("Registering endpoint: /Initialise");
app.get('/Initialise', function (req, res) {
    res.send('Begin Review Process');
});

console.log("Registering endpoint: /End");
app.get('/End', function (req, res) {
    res.send('End Review Process');
});

console.log("Registering endpoint: /Approve");
app.get('/Approve', function (req, res) {
    res.send('Approved');
});

console.log("Registering endpoint: /Reject");
app.get('/Reject', function (req, res) {
    res.send('Rejected');
});

console.log("Registering endpoint: /getTask");
app.get('/getTask', function (req, res) {
    var sql = "SELECT value, detail FROM counts";
    db.ConnectAndQuery(sql, function (err, row) {
        res.json({
            "value": row.value,
            "detail": row.detail
        });
    });
});

app.post('/setTask', function (req, res) {
    db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function (err, row) {
        if (err) {
            console.err(err);
            res.status(500);
        } else {
            res.status(202);
        }
        res.end();
    });
});

var server = http.createServer(app).listen(port, host, function () {
    console.log("Server listening to %s:%d within %s environment",
        host, port, app.get('env'));
});

app.listen(port);