const fs = require('fs');
const path = require('path');

const validate = require('validate.js');

module.exports = (validators) => {
  fs
    .readdirSync(__dirname)
    .filter(filename => path.extname(filename) === '.js')
    .filter(filename => filename !== 'index.js')
    .forEach(filename => {
      const validator = new (require(`./${path.basename(filename)}`));
      validators[validator.name] = validator.validate.bind(validator);
    });
}
