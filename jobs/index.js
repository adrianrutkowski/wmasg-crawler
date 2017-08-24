const fs = require('fs');
const path = require('path');

module.exports = (queue) => {
  fs
    .readdirSync(__dirname)
    .filter(filename => path.extname(filename) === '.js')
    .filter(filename => filename !== 'index.js')
    .forEach(filename => {
      const job = new (require(`./${path.basename(filename)}`));
      queue.process(job.title, job.concurrency, job.process.bind(job))
    });
}
