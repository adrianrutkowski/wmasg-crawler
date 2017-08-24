const WMASGSpider = require('../wmasg-spider');

class SearchItems {
  constructor(concurrency = 5) {
    this.title = 'search items';
    this.concurrency = concurrency;
  }

  process(job, done) {
    const spider = new WMASGSpider();

    spider.on('error', error => done(error));
    spider.on('end', () => done());
    spider.on('item', item => console.log(item));

    spider.start();
  }
}

module.exports = SearchItems;
