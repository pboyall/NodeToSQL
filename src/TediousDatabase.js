//Might want to make this implement the singleton pattern, although not totally sure it will hurt to have multiple instances floating around
var TYPES = require('tedious').TYPES;
var ConnectionPool = require('tedious-connection-pool');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var Qq = require('q');
var bDebug = true;
var poolConfig = {
    min: 2,
    max: 4,
    log: false
};

var config = {
    userName: 'radmin',
    password: 'password',
    port: '1433',
    server: 'PW-000011',
    options: {
        encrypt: false,
        database: 'ReviewProject',
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true,
        useColumnNames: false
    }
};

var pooling = true; //Set to false to not use connection pooling

var connection;
var database = function () {};

//No checks on SQL - just a Proof of Concept this
//The idea of this function is to let us swap in connection pooling later
database.prototype.getConnection = function getConnection() {
    connection = new Connection(config);
    return connection;
};

database.prototype.deferredQuery = function deferredQuery(sql, property, callback) {
    var deferred = Qq.defer();
    var resolvePromise = function (rows, rowCount) {
        console.log("Deferred Property " + property);
        callback(rows, rowCount, property);
        //Return the values from here if necessary using deferred.resolve(values); 
        deferred.resolve(rows);
    };
    this.ConnectAndQuery(sql, resolvePromise);
    return deferred.promise;
};

database.prototype.ConnectAndQuery = function ConnectAndQuery(sql, callback) {
    console.log('Connect and Query SQL: ' + sql);
    if (!pooling) {
        //Do a check here to see if connection already open
        connection = this.getConnection();
        connection.on('connect', function (err) {
            // If no error, then good to go...
            console.log("Conected - execute" + sql);
            executeStatement(sql, callback);
        });

        connection.on('error', function (err) {
            console.log("Error Connecting: " + err);
        });

        connection.on('debug', function (text) {
            console.log("Debug Connecting: " + text);
        });
    } else {
        console.log("Pooled Version running" + sql + "  " + typeof callback);
        executePooledStatement(sql, callback);
    }

};

database.prototype.insert = function Insert(sql, parameters, callback) {
    console.log('Connect and Insert SQL: ' + sql);
    executeInsert(sql, parameters, callback);
};

//Internal Functions

//Pooled querying - theoretically 

function executePooledStatement(sql, callback) {
    console.log('execute pool');
    var retval = '';
    var rowcounter = 0;
    var pool = new ConnectionPool(poolConfig, config);
    pool.acquire(function (err, connection) {
        if (err) {
            console.log(sql + err);
            console.error(err);
        } else {
            console.log("New request " + sql);
            var request = new Request(sql, function (err, rowCount, rows) {
                //Errors are not propogating from inserts
                if (err) {
                    console.log("Request failed: " + sql + err);
                } else {
                    console.log(rowCount + ' rows');
                    connection.release();
                }
            });
            request.on('row', function (columns) {
                rowcounter++;
                var colval;
                console.log('Row' + rowcounter);
                //Include array "[" here if more than one row
                colval = "";
                //TODO MAKE THE RETVAL valid JSON (speech marks)
                //if (bDebug) {
                columns.forEach(function (column) {
                    //console.log('Col ' + column.metadata.colName + ' : ' + column.value);
                    if (colval.length > 2) {
                        colval = colval + ", ";
                    }
                    colval = colval + '"' + column.metadata.colName + '" : "' + column.value + '"';
                });
                if (retval.length > 0) {
                    retval = retval + ",";
                }
                retval = retval + "{" + colval + " }";
                //}
            });

            request.on('doneInProc', function (rowCount, more, rows) {
                console.log('DIP++++++++++++++++++++++++++++++++++++++++++++++++++++DIP');
                console.log('In Proc Database done');
                console.log('Proc Retval' + retval);
                console.log('Proc RowCount ' + rowCount);
                console.log('Proc More' + more);

                console.log('Proc Close connection');
                connection.release();
                if (rowCount > 1) {
                    retval = "[" + retval + "]";
                }
                callback(retval, rowCount);
                console.log('End of In Proc Done');
                console.log('DIP-------------------------------------------------------DIP');

            });

            connection.execSql(request);
        }
    });

    pool.on('error', function (err) {
        console.error(err);
    });

}

//Non Pooled version - might be more reliable but the calling class has to use promises so only one at a time

function executeStatement(sql, callback) {
    console.log('execute statement');
    var retval = '';
    //Check state of connection
    //if connect.s
    var request = new Request(sql, function (err, rowCount, rows) {
        if (err) {
            console.log("Request failed: " + err);
        } else {
            var rowarray = [];
            console.log(rowCount + ' rows');
            //connection.close();
            connection.release();
            //callback(rows);
            //return rows;
        }
    });
    var rowcounter = 0;
    request.on('row', function (columns) {
        rowcounter++;
        console.log('Row' + rowcounter);

        var colval = "";
        //if (bDebug) {
        columns.forEach(function (column) {
            //console.log('Col ' + column.metadata.colName + ' : ' + column.value);
            if (colval.length > 0) {
                colval = colval + ",";
            }
            colval = colval + column.metadata.colName + ' : ' + column.value;
        });
        if (retval.length > 0) {
            retval = retval + ",";
        }
        retval = retval + "{" + colval + " }";
        //}
    });
    /*
        request.on('done', function (rowCount, more, rows) {
            console.log('Database done');
            console.log('Total rows' + rowCount);
            console.log(Object.getPrototypeOf(rows));
            //callback(rows);

        });
    */
    request.on('doneInProc', function (rowCount, more, rows) {
        console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++');
        console.log('In Proc Database done');
        //console.log('InProc Total rows' + rowCount);
        //console.log(Object.getPrototypeOf(rows));
        //console.log(rows);
        console.log(retval);
        //callback(rows, rowCount);
        //Not sure if this should be wrapped in its own function to allow for connection pooling.
        console.log('Close connection');
        connection.close();

        callback(retval, rowCount);
        console.log('-------------------------------------------------------');
    });
    /*
        request.on('doneProc', function (rowCount, more, rows) {
            console.log('Proc Database done');
            console.log('Proc Total rows' + rowCount);
            console.log(Object.getPrototypeOf(rows));
            callback(rows);

        });
    */
    connection.execSql(request);
}



//Insert using parameters and does a promise thing too!

function executeInsert(sql, parameters, callback) {
    console.log('execute insert');
    var retval = '';
    var rowcounter = 0;
    var pool = new ConnectionPool(poolConfig, config);
    var querySelect = sql;

    Qq.allSettled([updateData(querySelect, parameters, pool)])
        .then(
            function (promises) {
                console.log("promises");
                var promiseQueryData = promises[0];
                try {
                    //Measure results coming back from the updateData function.
                    if (promiseQueryData.state == 'fulfilled') {
                        console.log("promises fulfilled");
                        var queryMessage = promiseQueryData.value;
                        console.log(queryMessage);
                        callback(queryMessage);
                    } else {
                        console.log("promises state not fulfilled");
                    }
                } catch (ex) {
                    console.log(ex);
                    callback(ex + queryMessage);
                }
            });

    function updateData(queryInfo, insertParameters, pool) {
        console.log("Begin Update Data");
        var connectStat;
        var deferred = Qq.defer(); //Tell calling function that this has promise logic here as well.
        pool.acquire(function (err, connection) {
            console.log("acquired connection");
            if (err) {
                console.log(err);
                deferred.resolve("Connection Error" + err);
            } else {
                console.log("no error connecting");
                console.log("SQL-NODE: connected");
                connectStat = "connect";
                var request = new Request(queryInfo, function (err, rowCount, rows) {
                    console.log("fulfilling request callback");
                    if (err) {
                        console.log("Request error executeStatement -- " + err);
                        deferred.resolve("Request Error" + err);
                        connection.release();
                    } else {
                        //When rowcount is greater than 0 then rowCount represents the number of records updated.
                        console.log("Request Complete");
                        console.log('Request OK you are done rowCount: ' + rowCount);
                        connection.release();
                        deferred.resolve(rowCount);
                    }
                });
                for (var property in insertParameters) {
                    var obj = insertParameters[property];
                    console.log(property + obj.value + obj.type.name);
                    request.addParameter(property, TYPES[obj.type.name], obj.value);
                }
                console.log("exec SQL");
                connection.execSql(request);
            }
        });
        console.log("Completed Update Data");
        return deferred.promise; //Close off that this function has promise logic.
    }
    pool.on('error', function (err) {
        console.error(err);
    });
}

module.exports = database;