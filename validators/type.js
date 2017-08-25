const validate = require('validate.js');

class TypeValidator {
  constructor() {
    this.name = 'type';
    this.checks = {
      Object: function(value) {
        return validate.isObject(value) && !validate.isArray(value);
      },
      Array: validate.isArray,
      Integer: validate.isInteger,
      Number: validate.isNumber,
      String: validate.isString,
      Date: validate.isDate,
      Boolean: function(value) {
        return typeof value === 'boolean';
      }
    }
  }

  validate(value, options, key, attributes) {
    if(value === null || typeof value === 'undefined') {
      return null;
    }

   if(typeof options  === 'object' && options.clazz) {
      return value instanceof options.clazz ? null : ' is not of type "' + options.clazz.name + '"';
   }

   if(!this.checks[options]) {
      throw new Error("Could not find validator for type " + options);
   }

   return this.checks[options](value) ? null : ' is not of type "' + options + '"' ;
  }
}

module.exports = TypeValidator;
