'use strict';

var UserGroup = function (properties) {
    if (typeof properties === 'undefined') {
        properties = {};
        properties.GroupId = "";
        properties.PersonId = "";
        properties.DateUpdated = "";
        properties.Enabled = "";
        properties.StartDate = "";
        properties.EndDate = "";
    }
    this.Fields = properties;
    this.GroupId = properties.GroupId;
    this.PersonId = properties.PersonId;
    this.DateUpdated = properties.DateUpdated;
    this.Enabled = properties.Enabled;
    this.StartDate = properties.StartDate;
    this.EndDate = properties.EndDate;
    this.TableName = 'UserGroup';
    this.Keys = ['GroupId'];

    UserGroup.prototype.toString = function () {
        return '${this.GroupId} ';
    };
    UserGroup.prototype.theType = function () {
        return "UserGroup";
    };
};

module.exports = UserGroup;