const kue = require('kue');

const queue = kue.createQueue();

require('./jobs')(queue);

kue.app.listen(8080, console.log('Server running at http://127.0.0.1:8080'));
