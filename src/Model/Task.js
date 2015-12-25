'use strict';

var task = function (properties) {
    if (typeof properties === 'undefined') {
        var properties = {};
        properties.TaskId = "";
        properties.DateUpdated = "";
        properties.Status = "";
        properties.RaiserUserId = "";
        properties.ApprovalProcessType = "";
    }
    //If you specify one property only in the constructor, you lose all the others
    this.Fields = properties;
    this.TaskId = properties.TaskId;
    this.DateUpdated = properties.DateAssigned;
    this.Status = properties.Status;
    this.RaiserUserId = properties.RaiserUserId;
    this.ApprovalProcessType = properties.ApprovalProcessType;

    this.TableName = 'Task';
    this.Keys = ['TaskId'];
    task.prototype.ToString = function () {
        return '${this.TaskId} ';
    };

    task.prototype.theType = function () {
        return "Task";
    };

    //Probably need to define getters for each of the properties, so it goes to the .properties property rather than direct
};

module.exports = task;