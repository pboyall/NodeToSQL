'use strict';

//Conditions used to drive a split in the workflow (mostly yes or no)

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