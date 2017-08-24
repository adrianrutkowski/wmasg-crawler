class Test {
  constructor(concurrency = 5) {
    this.title = 'test';
    this.concurrency = concurrency;
  }

  process(job, done) {
    console.log('Test job log');
    done();
  }
}

module.exports = Test;
