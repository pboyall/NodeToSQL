'use strict';

var sprint = require('./library/stringfunctions.js');

/*
Have included GroupId in TaskNode and TaskAssignment to allow for workflows where a given step is assigned to multiple groups 
Consider merging TaskAssignment and TaskNode 
*/

//Database Handler (can plug in SqlliteDatabase.js instead)
var database = require('./TediousDatabase.js');
var logger = require('morgan');
var Q = require('Q');
var wff = require('./WorkflowFunctions');

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

var db = new database();
var newString = new sprint();
var results;

module.exports.InitialiseWorkflow = function (UserId, ApprovalProcessId) {
    var deferred = Q.defer();
    var startNode = "";
    var sSQL = "";
    //var wf = new wff();
    //Should really use Task Repository for everything - need speed not future proofing right now
    var taskrepo = new taskRepository({
        WorkflowProcessId: ApprovalProcessId,
        dbContext: db
    });

    //Should be using the objects for everything and not direct SQL but bypassing where I don't have time

    var AP = new ApprovalProcessTypes()
    AP.ApprovalProcessId = ApprovalProcessId;

    var captureresults = function (rows, rowCount) {
        console.log("Result Capture: " + rowCount + " row returned");
        console.log(rows);
        //console.log("Start Node ID = ");
        //console.log(rows.StartNodeId);
        console.log("=====================================");
        deferred.resolve(rows);
    };

    taskrepo.load(AP, captureresults)
        .then(
            function () {
                //Replace later with todays date
                var theTask = new task({
                    DateUpdated: '1/1/2000',
                    Status: 'I',
                    RaiserUserId: UserId,
                    ApprovalProcessType: ApprovalProcessId
                });
                console.log("Save New Task ");
                taskrepo.save(theTask, captureresults);
            }
        );

    startNode = wff.getStartNode(ApprovalProcessId);
    //    db.ConnectAndQuery(sSQL, useresult);

    var useresult = function (rows, rowCount) {
        console.log("Result Capture:" + rowCount);
        console.log(rows);
        results = rows;
        startNode = results; //Not sure that's right
        //Now can write the initial entry
        sSQL = wff.Initialise(UserId, ApprovalProcessId);
        //SHould really be using Task Repository not direct SQL!
        //taskrepo.save(Task, captureresults);


        //db.ConnectAndQuery(sSQL, useresult);

        console.log("=====================================");
        deferred.resolve();
    };
    return deferred.promise;
};



//ActionValue can be 

function ProcessAction(userId, TaskId, ActionValue) {

}









//Hard Coded Tests for now - this provides a Hook for later if necessary
//Note that ConditionTest is a function delegate
//so we can make the function generic
//We can pass in the test retrieved from the database

function ExecuteConditionTest(ConditionTest) {

}



//Support functions

function getRelatedGroup(ApprovalProcess, GroupId, RelationType) {

}

function backTraceRelatedGroup(ApprovalProcessId, TaskId, RelationTypeId, PersonId) {

}

function PopulateTaskAssignments(TaskId, GroupId, AccessType, NodeId) {

}

function getBranchNodes(NodeId) {
    return {
        OutputNodeId, ConditionTest, ConditionDescription, RelationTypeId, Type, AccessType
    };
}

function moveNextNode(NodeId, TaskId, GroupId, ConditionTest, AprovalProcessId) {

}


function checkUnaninmous(GroupId, TaskId, NodeId) {

}

function checkUniGroups(Gid, TaskId, ConditionTest) {

}

function checkUniNodes(TaskId, NodeId, ConditionTest) {

}

function checkVoting(GroupId, TaskId, NodeId) {

}

function checkVoting(Gid, TaskId, ConditionTest) {

}

function checkVoting(TaskId, NodeId, ConditionTest) {

}