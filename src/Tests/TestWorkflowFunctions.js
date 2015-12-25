//Creates a workflow

var wff = require('../WorkflowFunctions.js');
var w = require('../Workflow.js');
var Q = require('Q');

var deferred1 = Q.defer();
//Promises
//promise.then(onFulfilled, onRejected)
//onFulfilled is called when the promise is fulfilled and passes the promise's value as first argument
//onRejected passes reason as first argument
//Called as functions - no "this"
//"then" returns a promise
//errors cause the promise to be rejected with the error as the reason
/*
wff.getStartNode(3).then(function (value) {
    console.log(value);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
});
*/

wff.getStartNode1(3).then(function (value) {
    console.log(value);
    console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
}).then(wff.Initialise(1, 3).then(function (value) {
    console.log(value);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
}));


return deferred1.promise;
/*

    var captureresults = function (rows, rowCount) {
        log.debug("Result Capture:" + rowCount);
        log.debug(rows);
        log.debug(chalk.green("====================================="));
        deferred1.resolve();
    };


        .then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load User Group");
                taskrepo.load(UG, captureresults);
                return deferred1.promise;
            }
        ).then(
            function () {
                deferred1 = Q.defer();
                log.debug("Load Approval Process ");
                taskrepo.load(AP, captureresults);
                return deferred1.promise;
            }


*/