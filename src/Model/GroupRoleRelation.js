'use strict';

var GroupRoleRelation = function GroupRoleRelation(properties) {
    if (typeof properties === 'undefined') {
        properties = {};
        properties.GroupRelationId = "";
        properties.MasterGroupId = "";
        properties.RelativeGroupId = "";
        properties.DateUpdated = "";
        properties.Enabled = "";
        properties.RelationTypeId = "";
        properties.StartDate = "";
        properties.EndDate = "";
        properties.ApprovalProcessId = "";
        properties.GroupRoleWeight = "";
    }
    this.Fields = properties;
    this.GroupRelationId = properties.GroupRelationId;
    this.MasterGroupId = properties.MasterGroupId;
    this.RelativeGroupId = properties.RelativeGroupId;
    this.DateUpdated = properties.DateUpdated;
    this.Enabled = properties.Enabled;
    this.RelationTypeId = properties.RelationTypeId;
    this.StartDate = properties.StartDate;
    this.EndDate = properties.EndDate;
    this.ApprovalProcessId = properties.ApprovalProcessId;
    this.GroupRoleWeight = properties.GroupRoleWeight;
    this.TableName = 'GroupRoleRelation';
    this.Keys = ['GroupRelationId'];
    GroupRoleRelation.prototype.toString = function () {
        return '${this.GroupRelationId} ';
    };

    GroupRoleRelation.prototype.theType = function () {
        return "GroupRoleRelation";
    };
};

module.exports = GroupRoleRelation;