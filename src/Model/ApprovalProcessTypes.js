'use strict';


var ApprovalProcessTypes = function (properties) {
    if (typeof properties === 'undefined') {
        var properties = {};
        properties.ApprovalProcessId = "";
        properties.StartNodeId = "";
        properties.ApprovalType = "";
        properties.CompanyId = "";
        properties.FunctionId = "";
        properties.ProductId = "";
        properties.RegionId = "";
    }

    this.Fields = properties;
    this.ApprovalProcessId = properties.ApprovalProcessId;
    this.StartNodeId = properties.StartNodeId;
    this.ApprovalType = properties.ApprovalType;
    this.CompanyId = properties.CompanyId;
    this.FunctionId = properties.FunctionId;
    this.ProductId = properties.ProductId;
    this.RegionId = properties.RegionId;

    this.TableName = 'ApprovalProcessTypes';
    this.Keys = ['ApprovalProcessId'];

    ApprovalProcessTypes.prototype.toString = function () {
        return '${this.ApprovalProcessId} ';
    };

    ApprovalProcessTypes.prototype.theType = function () {
        return "ApprovalProcessTypes";
    };
};

module.exports = ApprovalProcessTypes;