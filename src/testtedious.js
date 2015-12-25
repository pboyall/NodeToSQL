//Test a web service sitting on the Tedious Database Connection


'use strict';
//Database Handler (can plug in SqlliteDatabase.js instead)
var database = require('./TediousDatabase.js');
//Does REST Web Services
var express = require('express');
var http = require('http');

var path = require('path');
var fs = require('fs');

//Provides logging
var logger = require('morgan');
var log4js = require('log4js');
//Automates one log per day
var FileStreamRotator = require('file-stream-rotator');
//Generates IDs
var uuid = require('node-uuid');
//Provides promises to handle sync/async issues
var Q = require('Q');

//Initial Attempt at making a repository work
var taskRepository = require('./TaskRepository.js');

//The classes that map to the database tables (one on one mapping)
//Can do this with an index.js and just require the folder (so easy to add new classes) but for now code explicitly so it's more obvious
var taskAssignment = require('./Model/TaskAssignment.js');
var task = require('./Model/Task.js');
var ApprovalProcessTypes = require('./Model/ApprovalProcessTypes.js');
var BranchCondition = require('./Model/BranchCondition.js');
var branchnode = require('./Model/BranchNode.js');
var GroupRoleRelation = require('./Model/GroupRoleRelation.js');
var TaskNode = require('./Model/TaskNode.js');
var TaskAssignmentHistory = require('./Model/TaskAssignmentHistory.js');
var UserGroup = require('./Model/UserGroup.js');

//Configure logger
var theAppLog = log4js.getLogger();
var logDirectory = __dirname + '/log';
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
var accessLogStream = FileStreamRotator.getStream({
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});

//Initialise Web Service Config
var app = express();
//Set to use loggin
app.use(logger('dev', {
    stream: accessLogStream
}));


var port = process.env.PORT || 3000;
var host = process.env.HOST || "127.0.0.1";
console.log("Begin Web Service");
//Sanity Kill Method for entire Node Module
process.on('uncaughtException', function (err) {
    console.log('Uncaught Exception ' + err + ' , quitting');
    process.exit(1);
});

//Create the database object to inject into everything
var db = new database();

//Run Checks to ensure database is up
var myf = function myfunc(rows, rowCount) {
    console.log("Database connection varified");
    console.log("****************************************************************");
    setUpWebService().then(runRestOfServer());
};
console.log("****************************************************************");
console.log("System Verification Tasks");

db.ConnectAndQuery("select * from Task", myf);

var setUpWebService = function () {

    var deferred = Q.defer();

    //Web Service Code

    console.log("Set Up Web Service");
    console.log("================================================");

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
        deferred.resolve();
    });

    //app.listen(port);

    console.log("================================================");

    //Handle errors
    //if (error) {
    //        deferred.reject(new Error(error));
    //    } else {
    //        deferred.resolve(text);
    //    }

    return deferred.promise;

};



//3 refers to WorkFlowProcessId = it's magic


var runRestOfServer = function () {
    var deferred = Q.defer();

    var taskrepo = new taskRepository({
        WorkflowProcessId: 3,
        dbContext: db
    });

    var _TaskId = 1;
    var _DateAssigned = '2015-01-15';
    var _GroupId = '1';
    var _AccessType = 1;
    var _NodeId = 1;
    var _DateUpdated = '2015-01-16';
    var _Status = "A";
    var _RaiserUserId = 1;
    var _ApprovalType = 3;
    var _StartNodeId = 1;
    var _CompanyId = 1;
    var _FunctionId = 1;
    var _ProductId = 1;
    var _RegionId = 1;
    var _GuardId = 1;
    var _ApprovalProcessId = 1;
    var _ApprovalProcessType = 3;
    var _ConditionId = 1;
    var _ConditionTest = 1;
    var _ConditionDescription = 1;
    var _OutputNodeId = 1;
    var _GroupRelationId = 1;
    var _MasterGroupId = 1;
    var _RelativeGroupId = 1;
    var _Enabled = 1;
    var _RelationTypeId = 1;
    var _StartDate = '2015-03-20';
    var _EndDate = '2015-04-30';
    var _GroupRoleWeight = 1;
    var _Type = 1;
    var _Outcome = 1;
    var _TaskAssignmentHistoryId = 1;
    var _ApproverId = 1;
    var _PersonId = 1;

    var theTaskAssignment = new taskAssignment({
        TaskId: _TaskId,
        DateAssigned: _DateAssigned,
        GroupId: _GroupId,
        AccessType: _AccessType,
        NodeId: _NodeId
    });

    var theTask = new task({
        TaskId: _TaskId,
        DateUpdated: _DateUpdated,
        Status: _Status,
        RaiserUserId: _RaiserUserId,
        ApprovalProcessType: _ApprovalProcessType
    });

    var AP = new ApprovalProcessTypes({
        ApprovalProcessId: _ApprovalProcessId,
        StartNodeId: _StartNodeId,
        ApprovalType: _ApprovalType,
        CompanyId: _CompanyId,
        FunctionId: _FunctionId,
        ProductId: _ProductId,
        RegionId: _RegionId
    });

    var BC = new BranchCondition({
        ConditionId: _ConditionId,
        ConditionTest: _ConditionTest,
        ConditionDescription: _ConditionDescription
    });

    var BN = new ApprovalProcessTypes({
        GuardId: _GuardId,
        NodeId: _NodeId,
        OutputNodeId: _OutputNodeId,
        ConditionId: _ConditionId,
        RelationTypeId: _RelationTypeId,
        Type: _Type,
        AccessType: _AccessType
    });

    var GR = new GroupRoleRelation({
        GroupRelationId: _GroupRelationId,
        MasterGroupId: _MasterGroupId,
        RelativeGroupId: _RelativeGroupId,
        DateUpdated: _DateUpdated,
        Enabled: _Enabled,
        RelationTypeId: _RelationTypeId,
        StartDate: _StartDate,
        EndDate: _EndDate,
        ApprovalProcessId: _ApprovalProcessId,
        GroupRoleWeight: _GroupRoleWeight
    });

    var theTaskAssignmentHistory = new TaskAssignmentHistory({
        TaskId: _TaskId,
        GroupId: _GroupId,
        NodeId: _NodeId,
        DateUpdated: _DateUpdated,
        Outcome: _Outcome,
        TaskAssignmentHistoryId: _TaskAssignmentHistoryId,
        ApproverId: _ApproverId,
        ConditionTest: _ConditionTest
    });

    var UG = new UserGroup({
        GroupId: _GroupId,
        PersonId: _PersonId,
        DateUpdated: _DateUpdated,
        Enabled: _Enabled,
        StartDate: _StartDate,
        EndDate: _EndDate
    });

    var captureresults = function (rows, rowCount) {
        console.log("Result Capture:" + rowCount);
        console.log(rows);
        console.log("=====================================");
        deferred.resolve();
    };

    console.log("Load Task Assignment");
    taskrepo.load(theTaskAssignment, captureresults)
        .then(
            function () {
                console.log("Load User Group");
                taskrepo.load(UG, captureresults);
            }
        )
        .then(
            function () {
                console.log("Save New Task Assignment");
                taskrepo.save(theTaskAssignment, captureresults);
            }
        );
    return deferred.promise;

};