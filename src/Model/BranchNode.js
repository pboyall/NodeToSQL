'use strict';

var branchnode = function (properties) {
    if (typeof properties === 'undefined') {
        properties = {};
        properties.GuardId = "";
        properties.NodeId = "";
        properties.OutputNodeId = "";
        properties.ConditionId = "";
        properties.RelationTypeId = "";
        properties.Type = "";
        properties.AccessType = "";
    }
    this.Fields = properties;
    this.GuardId = properties.GuardId;
    this.NodeId = properties.NodeId;
    this.OutputNodeId = properties.OutputNodeId;
    this.ConditionId = properties.ConditionId;
    this.RelationTypeId = properties.RelationTypeId;
    this.Type = properties.Type;
    this.AccessType = properties.AccessType;
    this.TableName = 'BranchNode';
    this.Keys = ['GuardId'];

    branchnode.prototype.toString = function () {
        return '${this.GuardId} ';
    };

    branchnode.prototype.theType = function () {
        return "BranchNode";
    };
};

module.exports = branchnode;