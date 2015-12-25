'use strict';

var TaskNode = function (properties) {

    if (typeof properties === 'undefined') {
        properties.TaskNodeId = "";
        properties.TaskId = "";
        properties.NodeId = "";
        properties.DateUpdated = "";
        properties.GroupId = "";
    }
    this.Fields = properties;
    this.TaskNodeId = properties.TaskNodeId;
    this.TaskId = properties.TaskId;
    this.NodeId = properties.NodeId;
    this.DateUpdated = properties.DateUpdated;
    this.GroupId = properties.GroupId;
    this.TableName = 'TaskNode';
    this.Keys = ['TaskNodeId'];

    TaskNode.prototype.toString = function () {
        return '${this.TaskNodeId} ';
    };

    TaskNode.prototype.theType = function () {
        return "TaskNode";
    };
};

module.exports = TaskNode;