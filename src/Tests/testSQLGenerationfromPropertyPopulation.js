//Test iterating the properties of an object and building the SQL from the object definition

'use strict';
var database = require('./TediousDatabase.js');
var taskAssignment = require('./TaskAssignment.js');
var tr = require('./TaskRepository.js');
var db = new database();



var _TaskId = 1;
var _DateAssigned = '15/1/2015';
var _GroupId = '3';
var _AccessType = 1;
var _NodeId = 1;
var theTaskAssignment = new taskAssignment({
    TaskId: _TaskId,
    DateAssigned: _DateAssigned,
    GroupId: _GroupId,
    AccessType: _AccessType,
    NodeId: _NodeId
});

var theObject = theTaskAssignment;

var selectSQL = "select ";
var updateSQL = "update " + theObject.TableName;
var insertSQL = "insert into " + theObject.TableName + "(";
var insertValues = "";
var insertFields = "";

for (var property in theObject.Fields) {
    //Write out property name and value into SQL
    if (selectSQL == "select ") {
        updateSQL = updateSQL + " SET ";

    } else {
        selectSQL = selectSQL + ",";
        updateSQL = updateSQL + ",";
        insertValues = insertValues + ",";
        insertFields = insertFields + ",";
    }
    selectSQL = selectSQL + property;
    updateSQL = updateSQL + property + "= '" + theObject.Fields[property] + "'";
    insertValues = insertValues + "'" + theObject.Fields[property] + "'";
    insertFields = insertFields + property;
}

selectSQL = selectSQL + " from " + theObject.TableName;
insertSQL = insertSQL + insertFields + ") VALUES (" + insertValues + ")";
var whereSQL = "";

theObject.Keys.map(function (item) {
    console.log(item);
    console.log(theObject[item]);
    if (whereSQL === "") {
        whereSQL = " where " + item + " = " + theObject[item];
    } else {
        whereSQL = whereSQL + " AND " + item + " = " + theObject[item];
    }

});

//Functionalise!

insertSQL = insertSQL + whereSQL;
updateSQL = updateSQL + whereSQL;
selectSQL = selectSQL + whereSQL;


console.log(whereSQL);

console.log(selectSQL);
console.log(updateSQL);
console.log(insertSQL);

var TR = new tr({
    WorkflowProcessId: 1,
    dbContext: db
});

var sql = "";
TR.populateSQL(theObject, sql);