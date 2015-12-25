'use strict';

var BranchCondition = function (properties) {
    if (typeof properties === 'undefined') {
        properties = {};
        properties.ConditionId = "";
        properties.ConditionTest = "";
        properties.ConditionDescription = "";
    }

    this.Fields = properties;
    this.ConditionId = properties.ConditionId;
    this.ConditionTest = properties.ConditionTest;
    this.ConditionDescription = properties.ConditionDescription;
    this.TableName = 'BranchCondition';
    this.Keys = ['ConditionId'];
    BranchCondition.prototype.toString = function () {
        return '${this.ConditionId} ';
    };

    BranchCondition.prototype.theType = function () {
        return "BranchCondition";
    };
};

module.exports = BranchCondition;