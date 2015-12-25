//How to iterate over an array using the map method

var kays = [
    {
        TaskId: 1
    },
    {
        TaskAssignmentId: 2
    },
    {
        PersonId: 3
    }
];

var keys = [
    {
        key: "TaskId",
        value: 1
    },
    {
        key: "TaskAssignmentId",
        value: 2
    },
    {
        key: "PersonId",
        value: "Bob"
    }
];


var valuesonly = keys.map(function (obj, index) {
    var rObj = {};
    rObj[obj.key] = obj.value;
    return rObj;

});

valuesonly = keys.map(function (obj, index) {
    var rObj = {};
    rObj[index] = obj.value;
    return rObj;

});

valuesonly = keys.map(function (obj, index) {
    return obj.value;
});


console.log(valuesonly);