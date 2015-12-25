'use strict';

var taskAssignmentHistory = function (properties) {

    if (typeof properties === 'undefined') {
        properties = {};
        properties.TaskId = "";
        properties.GroupId = "";
        properties.NodeId = "";
        properties.DateUpdated = "";
        properties.Outcome = "";
        properties.TaskAssignmentHistoryId = "";
        properties.ApproverId = "";
        properties.ConditionTest = "";
    }
    debugger;
    this.Fields = properties;
    this.TaskId = properties.TaskId;
    this.GroupId = properties.GroupId;
    this.NodeId = properties.NodeId;
    this.DateUpdated = properties.DateUpdated;
    this.Outcome = properties.Outcome;
    this.TaskAssignmentHistoryId = properties.TaskAssignmentHistoryId;
    this.ApproverId = properties.ApproverId;
    this.ConditionTest = properties.ConditionTest;

    this.TableName = 'TaskAssignmentHistory';
    this.Keys = ['TaskAssignmentHistoryId'];

    taskAssignmentHistory.prototype.toString = function () {
        return '${this.TaskAssignmentHistoryId} ';
    };

    taskAssignmentHistory.prototype.theType = function () {
        return "TaskAssignmentHistory"; //Object.getPrototypeOf(this);
    };
};

module.exports = taskAssignmentHistory;