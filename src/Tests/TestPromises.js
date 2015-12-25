//Test how promises string together
//And also how to pass values back from them
//Plus querying the database :-)

var Q = require('Q');
var database = require('../TediousDatabase.js');
var db = new database();

function one() {

    var deferred = Q.defer(); // Don't worry yet what this is
    // until after you understand the flow

    console.log("Starting one's ajax");
    db.ConnectAndQuery("select * from Task", function () {
        console.log('Finished with one. Ready to call next.');
        deferred.resolve();
    });

    // The deferred object has a "promise" member, 
    // which has a "then" function
    return deferred.promise;
}

function two() {
    var deferred = Q.defer();
    console.log("Starting two's ajax");
    db.ConnectAndQuery("select * from UserGroup", function () {
        console.log('Finished with two. Ready to call next.');
        deferred.resolve();
    });
    // The deferred object has a "promise" member,
    // which has a "then" function
    return deferred.promise;
}

function three() {
    var deferred = Q.defer();
    console.log("Starting three's ajax");
    db.ConnectAndQuery("select * from TaskAssignment", function () {
        console.log('Finished with three. Ready to call next.');
        deferred.resolve();
    });
    // The deferred object has a "promise" member,
    // which has a "then" function
    return deferred.promise;
}

function four() {
    var deferred = Q.defer();
    console.log("Starting four");
    db.ConnectAndQuery("select * from TaskAssignment", function () {
        console.log('Finished with four. Ready to call next and say "all done".');
        deferred.resolve("all done");
    });
    return deferred.promise;
}

function five(takeinvalue) {
    console.log("=====================================================================");
    console.log(takeinvalue);
    console.log("=====================================================================");
}

console.log("being");
//Original Tests
//one().then(two).then(three);

//Passing parameters tests
//four().then(five);

//This one calls a synchronous non-deferred function
function callSyncFunction() {
    var deferred = Q.defer();
    notDeferred();
    return deferred.promise;
}

//This one calls an asynchronous non-deferred function
function callsASyncFunction() {
    var deferred = Q.defer();
    db.ConnectAndQuery("select * from UserGroup", function () {
        console.log('Finished with non deffered async.');
    });
    return deferred.promise;
}

//This one uses fcall to execute an asynchronous non-deferred function
function fcallsASyncFunction() {
    var deferred = Q.defer();
    Q.fcall(db.ConnectAndQuery, "select * from UserGroup", function () {
        console.log('Finished with non deffered async.');
    });
    return deferred.promise;
}

function nfcallsASyncFunction() {
    var deferred = Q.defer();
    Q.nfcall(db.ConnectAndQuery, "select * from UserGroup", function () {
        console.log('Finished with non deffered async.');
    });
    return deferred.promise;
}

//var dbc = db.ConnectAndQuery("select * from UserGroup", function () {
//    console.log('Finished with non deffered async.');
//});
//Doesn 't help
//dbn = Q.denodeify(db.ConnectAndQuery(sql, callback));
//Also not helpful as format is wrong var dbn = Q.nbind(db.ConnectAndQuery);
//var dbn = Q.fcall(db.ConnectAndQuery);

function def1() {
    var deferred = Q.defer();
    //    db.ConnectAndQuery("select * from UserGroup", function () {
    //        console.log('Finished with non deffered async.');
    //    });
    db.deferredQuery("select top 1 * from UserGroup", "GroupId", function () {
        console.log('Finished with non deffered async.');
        deferred.resolve();
    });
    return deferred.promise;
}



function notDeferred() {
    console.log('non deferred function');
}


function isDeferred() {
    console.log('is deferred function');
}

//Test not Deffered 
//Doesn't call "three"
//callSyncFunction().then(three);
//This doesn't call three either as again the non-deferred function never resolves the promise
//callsASyncFunction().then(three);

//get a resolution - this seems to call the fcall function twice?
//fcallsASyncFunction().then(three);

//Try using node function mapper - only calls the function once but doesn't resolve and call three
//nfcallsASyncFunction().then(three);

//nodeifycallsASyncFunction().then(isDeferred);

//dbn("select * from UserGroup", notDeferred).then(isDeferred);

def1();