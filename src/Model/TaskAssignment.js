'use strict';

var taskAssignment = function (properties) {
    if (typeof properties === 'undefined') {
        properties = {};
        properties.TaskId = "";
        properties.DateAssigned = "";
        properties.GroupId = "";
        properties.AccessType = "";
        properties.NodeId = "";
    }
    this.Fields = properties;
    this.TaskId = properties.TaskId;
    this.DateAssigned = properties.DateAssigned;
    this.GroupId = properties.GroupId;
    this.AccessType = properties.AccessType;
    this.NodeId = properties.NodeId;

    this.TableName = 'TaskAssignment';
    this.Keys = ['TaskId', 'GroupId'];

    taskAssignment.prototype.toString = function () {
        return '${this.TaskId} ${this.DataAssigned}';
    };

    taskAssignment.prototype.theType = function () {
        return "TaskAssignment";
    };
};

module.exports = taskAssignment;