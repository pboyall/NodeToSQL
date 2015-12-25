//How to itereate the insert parameters for a procedure

var TYPES = require('tedious').TYPES;

var insertParameter = {};

insertParameter.name = {
    value: 'Jane',
    type: TYPES.Float
};
insertParameter.age = {
    value: '26',
    type: TYPES.Float
};
insertParameter.state = {
    value: 'NC',
    type: TYPES.VarChar
};

for (var property in insertParameter) {
    var obj = insertParameter[property];
    console.log(property);
    console.log(obj.value);
    console.log(obj.type.name);
    console.log(TYPES.VarChar);
    console.log(TYPES[obj.type.name]);
}