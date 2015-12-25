'use strict';
var sprint = require('./library/stringfunctions.js');
var Q = require('Q');
var chalk = require('chalk');
var logger = require('./logger');
var log = logger.LOG;

var taskRepository =

    class TaskRepository {

        constructor(Options) {
            this.WorkflowProcessId = Options.WorkflowProcessId;
            this.dbContext = Options.dbContext;
        }

        wonk() {
            console.log("javascript sucks big time");
        }

        obtainSQL(theObject) {
            var selectSQL = "select ";
            var updateSQL = "update " + theObject.TableName;
            var insertSQL = "insert into " + theObject.TableName + "(";
            var insertValues = "";
            var insertFields = "";
            var whereSQL = "";

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

            theObject.Keys.map(function (item) {
                if (whereSQL === "") {
                    whereSQL = " where " + item + " = " + theObject[item];
                } else {
                    whereSQL = whereSQL + " AND " + item + " = " + theObject[item];
                }

            });

            //Functionalise!

            insertSQL = insertSQL;
            updateSQL = updateSQL + whereSQL;
            selectSQL = selectSQL + whereSQL;
            return {
                update: updateSQL,
                select: selectSQL,
                insert: insertSQL
            };

        }

        populateObject(theObject, rows, rowindex) {

            //If there is more than one row this could be interesting - return the last row in the object and handle it at higher level?  Didn't really plan this one ... don't want to return an array of objects or break the interface now
            if (typeof rowindex === 'undefined') {
                rowindex = 0;
            } else {
                log.info("Return row" + rowindex);
            }

            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ " + theObject);
            console.log("Populate Object " + theObject);
            try {
                log.info(rows);
            } catch (e) {
                log.error(chalk.red("Unable to log rows"));
            }

            var parsedJSON;

            //Rows is just a string for some reason!!!
            //And it's not valid JSON either :-(
            try {
                parsedJSON = JSON.parse(rows);
            } catch (e) {
                log.error(chalk.red("Unable to parse rows"));
            }

            console.log("Parsed JSON" + parsedJSON);
            console.log(JSON.stringify(parsedJSON[0]));

            var rowsobj;
            if (parsedJSON.length > 1) {
                console.log("More than one row - returning row" + rowindex);
                rowsobj = parsedJSON[rowindex];
            } else {
                rowsobj = parsedJSON;
            }

            console.log("Object to populate from" + rowsobj);

            for (var pop in rowsobj) {
                console.log(pop + ":" + rowsobj[pop]);
            }
            //Think there is a javascript issue with using "property" - something about no guarantee of order?
            for (var property in theObject.Fields) {
                log.debug("Retrived value" + rowsobj[property]);
                log.debug("Property Name: " + property);
                log.debug("Field Value " + theObject.Fields[property]);
                log.debug("Direct  Value " + theObject[property]);
                //Write out property name and value into SQL
                theObject.Fields[property] = rowsobj[property];
                theObject[property] = rowsobj[property];
                log.debug("Post Field Value " + theObject.Fields[property]);
                log.debug("Post Direct  Value " + theObject[property]);
            }



        }


        load(theObject, callme, criteria, rowindex) {
            var deferred = Q.defer();
            if (typeof criteria === 'undefined') {
                criteria = "";
            }
            //if callme is not a function - sort it here
            if (typeof callme === 'undefined') {
                callme = function () {};
            }

            //Hard coded SQL as proof of concept
            //_dbContext
            var theType = theObject.theType();
            console.log('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=');
            console.log('load instance of ' + Object.getPrototypeOf(theObject) + ' (' + theType + ')');
            var sqlobj = this.obtainSQL(theObject);
            var sql = sqlobj.select;
            //Add criteria
            sql = sql + ' ' + criteria;
            console.log('Determined SQL for query = ' + sql);
            //Resolve promise then call callback
            var resolvePromise = function (rows, rowCount) {
                //Can't get it to talk to itself for some reason so create a new one to use the static method
                //Javascript OO sucks
                var temptr = new taskRepository({
                    WorkflowProcessId: 3,
                    dbContext: null
                });

                if (rows !== "") {
                    //if more than one row, um ... 
                    temptr.populateObject(theObject, rows, rowindex);
                } else {
                    console.log(chalk.red("!!!! No rows returned from sql ") + sql);
                }
                console.log("RETVAL" + rows);
                console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ " + theObject);
                callme(rows, rowCount);
                //Return the values from here if necessary using deferred.resolve(values); 
                deferred.resolve();

                //rows contains the JSON result
                //{TaskId : 1,DateUpdated : Fri Oct 09 2015 17:44:56 GMT+0100 (GMT Daylight Time),Status : I,RaiserUserId : 1,ApprovalProcessType: 3
            };
            this.dbContext.ConnectAndQuery(sql, resolvePromise);
            return deferred.promise;
        }

        save(theObject, callme) {
            var deferred = Q.defer();
            //Hard coded SQL as proof of concept
            console.log('+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=');
            console.log('save instance of ' + Object.getPrototypeOf(theObject));
            var sql = "";
            var keys = [];
            var sqlobj = this.obtainSQL(theObject);
            //TODO: Code "select" check then if no rows insert else update
            //For now just force insert each time
            //Also should do insert using parameters rather than like this but leave it for now
            sql = sqlobj.insert;
            console.log(sql);

            var resolvePromise = function (rows, rowCount) {



                deferred.resolve();
                //Not sure this is right thing to return
                callme(rows, rowCount);
            };
            var parameters = {}; //Empty for now
            //Works but has lousy error handling this.dbContext.ConnectAndQuery(sql, resolvePromise);
            this.dbContext.insert(sql, parameters, resolvePromise);
            console.log('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+');
            return deferred.promise;
        }
    };

module.exports = taskRepository;