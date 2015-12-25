function insertIntoMongoDb() {
    console.log('inserting data into MongDB');

    mongoose.connect('mongodb://localhost:27017/someMongoDB');

    var taskSchema = new mongoose.Schema({
        TaskId: {
            type: Number
        },
        Status: {
            type: String
        },
        DateUpdated: {
            type: Date
        },
        RaiserUserId: {
            type: Number,
            default: ''
        },
        ApprovalProcessType: {
            type: Number,
            default: 0
        }
    }, {
        versionKey: false
    });

    var TaskModel = mongoose.model('Tasks', taskSchema);
    for (var i = 0; i < rows.length; i++) {
        var task = new TaskModel(rows[i]);
        Task.save(function (error) {
            if (error) {
                console.log('error saving');
            } else {
                console.log('saved successfully')
            }
        });
    }
}

function getSqlData() {
    console.log('Getting data from SQL');
    request = new Request("SELECT * from Task",
        function (err, rowCount) {
            if (err) {
                console.log(err);
            } else {
                insertIntoMongoDb();
            }
        });
    request.on('row', function (columns) {
        var row = {};
        columns.forEach(function (column) {
            row[column.metadata.colName] = column.value;
        });
        rows.push(row);
    });
    connection.execSql(request);
}