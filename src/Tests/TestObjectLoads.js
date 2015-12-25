//Verify all the objects in the domain can be loaded from the database using the repository

'use strict';
var chalk = require('chalk');
var logger = require('../logger.js');
//Database Handler (can plug in SqlliteDatabase.js instead)
var database = require('../TediousDatabase.js');
//Provides promises to handle sync/async issues
var Q = require('Q');
var deferred1 = Q.defer();
//Initial Attempt at making a repository work
var taskRepository = require('../TaskRepository.js');
//The classes that map to the database tables (one on one mapping)
//Can do this with an index.js and just require the folder (so easy to add new classes) but for now code explicitly so it's more obvious
var taskAssignment = require('../Model/TaskAssignment.js');
var task = require('../Model/Task.js');
var ApprovalProcessTypes = require('../Model/ApprovalProcessTypes.js');
var BranchCondition = require('../Model/BranchCondition.js');
var branchnode = require('../Model/BranchNode.js');
var GroupRoleRelation = require('../Model/GroupRoleRelation.js');
var TaskNode = require('../Model/TaskNode.js');
var TAH = require('../Model/TaskAssignmentHistory.js');
var UserGroup = require('../Model/UserGroup.js');
//Sanity Kill Method for entire Node Module
//process.on('uncaughtException', function (err) {
//    log.debug('Uncaught Exception ' + err + ' , quitting');
//    process.exit(1);
//});

var log = logger.LOG;
log.trace("Trace Log Started");
log.debug("Debug log started");

//Create the database object to inject into everything
var db = new database();

//Run Checks to ensure database is up
var myf = function myfunc(rows, rowCount) {
    log.debug("Database connection verified");
    log.debug("############################################################");
    log.debug("############################################################");
    log.debug("############################################################");
    runRestOfServer();
};
log.debug("****************************************************************");
log.debug("System Verification Tasks");

db.ConnectAndQuery("select * from Task", myf);

//Dummy Values
var _TaskId = 1;
var _DateAssigned = '2015-01-15';
var _GroupId = '3';
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
var _ApprovalProcessId = 3;
var _ApprovalProcessType = 3;
var _ConditionId = 1;
var _ConditionTest = 1;
var _ConditionDescription = 1;
var _OutputNodeId = 1;
var _GroupRelationId = 3;
var _MasterGroupId = 1;
var _RelativeGroupId = 1;
var _Enabled = 1;
var _RelationTypeId = 1;
var _StartDate = '2015-03-20';
var _EndDate = '2015-04-30';
var _GroupRoleWeight = 1;
var _Type = 1;
var _Outcome = 1;
var _TaskAssignmentHistoryId = 4;
var _ApproverId = 1;
var _PersonId = 1;


var runRestOfServer = function () {

    var theTaskAssignment = new taskAssignment();
    theTaskAssignment.TaskId = _TaskId;
    theTaskAssignment.GroupId = _GroupId;
    var theTask = new task();
    theTask.TaskId = _TaskId;
    var AP = new ApprovalProcessTypes();
    AP.ApprovalProcessId = _ApprovalProcessId;
    var BC = new BranchCondition();
    BC.ConditionId = _ConditionId;
    var BN = new branchnode();
    BN.GuardId = _GuardId;
    var GR = new GroupRoleRelation();
    GR.GroupRelationId = _GroupRelationId;
    debugger;
    var theTaskAssignmentHistory = new TAH();
    theTaskAssignmentHistory.TaskAssignmentHistoryId = _TaskAssignmentHistoryId;

    var UG = new UserGroup();
    UG.GroupId = _GroupId;
    UG.PersonId = _PersonId;
    UG.DateUpdated = _DateUpdated;

    var captureresults = function (rows, rowCount) {
        log.debug("Result Capture:" + rowCount);
        log.debug(rows);
        log.debug(chalk.green("====================================="));
        deferred1.resolve();
    };


    var taskrepo = new taskRepository({
        WorkflowProcessId: 3,
        dbContext: db
    });

    var message = function () {
        var def = Q.defer();
        log.debug("Load Task Assignment");
        def.resolve();
        return def.promise;
    };


    function UserGroupProcess() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load User Group");
        taskrepo.load(UG, captureresults);
        return deferred.promise;
    }

    function ApprovalProcess() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Approval Process ");
        taskrepo.load(AP, captureresults);
        return deferred.promise;
    }

    function TaskProcess() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Task");
        taskrepo.load(theTask, captureresults);
        return deferred.promise;
    }

    function Branch() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Branch Condition");
        taskrepo.load(BC, captureresults);
        return deferred.promise;
    }

    function bNode() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Branch Node");
        taskrepo.load(BN, captureresults);
        return deferred.promise;
    }

    function GroupR() {
        var deferred = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Group Role");
        taskrepo.load(GR, captureresults);
        return deferred.promise;
    }

    function TA() {
        var deferred1 = Q.defer();
        log.debug(chalk.blue("+++++++++++++++++++++"));
        log.debug("Load Task Assignment History");
        taskrepo.load(theTaskAssignmentHistory, captureresults);
        return deferred1.promise;
    }
    /*
    message()
        .then(taskrepo.load(theTaskAssignment, captureresults))
        .then(taskrepo.load(AP, captureresults))
                .then(taskrepo.load(UG, captureresults))
                .then(taskrepo.load(theTask, captureresults))
                .then(taskrepo.load(BC, captureresults))
                .then(taskrepo.load(BN, captureresults))
                .then(taskrepo.load(GR, captureresults))
                .then(TA)
                .then(taskrepo.load(theTaskAssignmentHistory, captureresults))

    ;
                */
    /*
        UserGroupProcess().then(function () {
            process.exit()
        });
      */
    message().then(
        taskrepo.load(theTaskAssignment, captureresults)
        .then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load User Group");
                taskrepo.load(UG, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Approval Process ");
                taskrepo.load(AP, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Task");
                taskrepo.load(theTask, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Branch Condition");
                taskrepo.load(BC, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Branch Node");
                taskrepo.load(BN, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Group Role");
                taskrepo.load(GR, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Task Assignment History");
                taskrepo.load(theTaskAssignmentHistory, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                //Iterate all the objects?

                var objArray = [];
                objArray.push(theTaskAssignment);
                objArray.push(theTask);
                objArray.push(AP);
                objArray.push(BC);
                objArray.push(BN);
                objArray.push(GR);
                objArray.push(theTaskAssignmentHistory);
                objArray.push(UG);
                for (var index in objArray) {
                    var theObject = objArray[index];
                    //TODO - Write some asserts so we can automatically compare these results out


                    log.debug(theObject);
                    //for (var property in theObject.Fields) {
                    //  log.debug("property");
                    //log.debug(property + "= " + theObject.Fields[property]);
                    //}

                }
                return deferred1.promise;
            }
        )
    );







};