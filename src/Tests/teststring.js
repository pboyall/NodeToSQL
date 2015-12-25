//Test the string format library

var sprint = require('../library/stringfunctions.js');

var newString = new sprint();

var arr = ['0000', '1111', '2222']

console.log(newString.format("{0}, 2 {1}, 3{2}", arr));