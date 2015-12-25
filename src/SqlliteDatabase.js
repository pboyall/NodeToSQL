    var fs = require("fs");
    var file = "reviewdb.db";
    var exists = fs.existsSync(file);
    var sqlite3 = require("sqlite3").verbose();
    var sql = "select * from Task";

    //Doesn't work globally

    var database = function () {};

    //Replace with connection pooling later

    database.prototype.getConnection = function () {
        var db = new sqlite3.Database(file);
        return db;
    }

    database.prototype.ConnectAndQuery = function (sql, callback) {
        var db = new sqlite3.Database(file);
        console.log("Query SQL : " + sql);
        console.log(file);
        db.serialize(function () {
            db.each(sql, function (err, row) {
                console.log(row.TaskId + ": " + row.Status + " : " + row.RaiserUserId);
            });
        });
        db.close();
    }

    module.exports = database;

    //Full example    
    /*    
        var testfunc = function () {};

        testfunc.prototype.log = function () {
            console.log("test"); //sql
        };


        //sql, callback
        testfunc.prototype.log1 = function (sql, callback) {
            console.log(sql); //sql
        };

        module.exports = testfunc;
    */

    function myfunc() {

    }


    //module.exports.ConnectAndQuery = func2;

    //    var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
    //        stmt.run("Thing #" + rnd);
    //    stmt.finalize();
    //        db.each("SELECT * FROM Task", function (err, row) {
    //            console.log(row.TaskId + ": " + row.Status + " : " + row.RaiserUserId);

    var complete = function (err, numrows) {
        stmt.finalize();
        db.close();
        console.log("Complete");

    };

    //Works globally
    /*
        foo = function () {
            console.log("Boo");
        }
    */

    //Works in isolation
    /*    exports.huh = function () {
            console.log("Huh");
        }
    */
    /* works okay
        var buz = function () {};

        buz.prototype.bux = function () {
            console.log("bux");
        }

        module.exports = new buz();
    */