//Directly running Update SQL against the database using promises to capture errors

var TYPES = require('tedious').TYPES;
var Request = require('tedious').Request;
var Qq = require('q');
var updateD = function () {};

exports.main = function (req, res) {

    var Q = require('q');

    //Establish parameters needed by Tedious to run the update query.

    var passParameter = {};

    passParameter.name = 'Jane';

    passParameter.age = '26';

    passParameter.state = 'NC';

    var querySelect = "UPDATE [dbo].[Relatives] set age = @age, state=@state WHERE name = @name";

    var configConnection = {
        "userName": "USER",
        "password": "PASSWORD",
        "server": "SERVERNAME",
        "options": {
            "database": "DATABASENAME"
        }
    };

    //Establising a promise object to work with results of the call

    Q

        .allSettled(

[

updateData(configConnection, querySelect, passParameter)

]

    )

    .then(

        function (promises) {

            var promiseQueryData = promises[0];

            try {

                //Measure results coming back from the updateData function.

                if (promiseQueryData.state == 'fulfilled') {

                    var queryMessage = promiseQueryData.value;

                    console.log(queryMessage);

                }

            } catch (ex) {

                console.log(ex);

            }

        });

    　

    function updateData(config, queryInfo, insertParameters) {

        var Q = require('q');

        var deferred = Q.defer(); //Tell calling function that this has promise logic here as well.

        var connection = new Connection(config);

        connection.on('end', function () {

            console.log("SQL-NODE END");

        });

        connection.on('error', function (err) {

            console.log("SQL-NODE ERROR - " + err);

        });

        connection.on('debug', function (msgText) {

            console.log("SQL-NODE DEBUG - " + msgText);

        });

        connection.on('infoMessage', function (info) {

            console.log('SQL-NODE info: ' + info.message);

        });

        　

        connection.on('errorMessage', function (error) {

            console.log('SQL-NODE info: ' + error.message);

        });

        connection.on('connect', function (err) {

            if (err) {

                console.log("SQL-NODE: connection error: " + err);

                deferred.resolve("No Connection");

            } else {

                console.log("SQL-NODE: connected");

                connectStat = "connect";

                var request = new Request(queryInfo, function (err, rowCount) {

                    if (err) {

                        console.log("Request error executeStatement -- " + err);

                        connection.close();

                    } else {

                        //When rowcount is greater than 0 then rowCount represents the number of records updated.

                        console.log('Request OK your done rowCount: ' + rowCount);

                        connection.close();

                        deferred.resolve("Query Complete");

                    }

                });

                //Add parameters to the query.

                request.addParameter('name', TYPES.VarChar, insertParameters.name);

                request.addParameter('age', TYPES.Float, parseFloat(insertParameters.age));

                request.addParameter('state', TYPES.VarChar, insertParameters.state);

                connection.execSql(request);

            }

        });

        return deferred.promise; //Close off that this function has promise logic.

    }

};