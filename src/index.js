/*'use strict';

console.log("Begin Web Service");
//Sanity Kill
process.on('uncaughtException', function (err) {
    console.log('Uncaught Exception ' + err + ' , quitting');
    process.exit(1);
});

var database = require('sqlite.js');

//POC DB Query Code

var callmeandquit = function () {
    console.log("Done - exit");
    process.exit();
};

var callme = function () {
    console.log("Done - keep running");
};


var sql = "select * from Task";

//database.
ConnectAndQuery(sql, callmeandquit);


//database.query(sql, callme);

//End POC



//Initial Attempt at making a repository work

var taskRepository = require('./TaskRepository.js');
var taskAssignment = require('./TaskAssignment.js');

//3 refers to WorkFlowProcessId = it's magic

var wibble = new taskRepository({
    WorkflowProcessId: 3,
    dbContext: database
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

wibble.save(theTaskAssignment, callme);

//As this is node, it keeps running unless we exit

process.exit();


var express = require('express');
var app = express();

console.log("Registering endpoint: /");
app.get('/', function (req, res) {
    res.send('hello ROOT world');
});

console.log("Registering endpoint: /stubbed");
app.get('/stubbed', function (req, res) {
    res.send('hello STUBBED');
});

console.log("Registering endpoint: /testing");
app.get('/testing', function (req, res) {
    res.send('this is a test endpoint');
});

console.log("Registering endpoint: /jsonendpoint");
app.get('/jsonendpoint', function (req, res) {
    res.json({
        "mykey": "myvalue",
        "testy": "something",
        "exnum": 123
    });
});

app.get('/data', function (req, res) {
    db.get("SELECT value FROM counts", function (err, row) {
        res.json({
            "count": row.value
        });
    });
});

app.post('/data', function (req, res) {
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


app.listen(3000);*/