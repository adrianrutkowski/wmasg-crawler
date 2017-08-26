const config = require('config');
const kue = require('kue');

const queue = kue.createQueue({
  redis: config.get('Redis')
});

const validate = require('validate.js');

require('./jobs')(queue);
require('./validators')(validate.validators);

kue.app.listen(8080, console.log('Server running at http://127.0.0.1:8080'));
