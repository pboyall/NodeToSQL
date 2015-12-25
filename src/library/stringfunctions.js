'use strict';

var cString = class Cstring {

    constructor(Options) {}

    format(str, obj) {
        return str.replace(/\{\s*([^}\s]+)\s*\}/g, function (m, p1, offset, string) {
            return obj[p1];
        });
    }

    //Stick with {} for field names

    formatfieldname(str, obj) {
        return str.replace(/\{\s*([^}\s]+)\s*\}/g, function (m, p1, offset, string) {
            return obj[p1];
        });
    }

    //Use [] to delineate field values
    formatfieldvalue(str, obj) {
        return str.replace(/\[\s*([^}\s]+)\s*\]/g, function (m, p1, offset, string) {
            return obj[p1];
        });
    }

    fetchFromObject(obj, prop) {

        if (typeof obj === 'undefined') {
            return false;
        }

        var _index = prop.indexOf('.');
        if (_index > -1) {
            return this.fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }

        return obj[prop];
    }


};

module.exports = cString;