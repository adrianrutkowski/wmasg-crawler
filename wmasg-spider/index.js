const huntsman = require('huntsman');

class WMASGSpider {
  constructor() {
    this.url = 'http://wmasg.pl/pl/consignment';
    this.spider = huntsman.spider();

    this.spider.extensions = [
      huntsman.extension('recurse'),
      huntsman.extension('cheerio')
    ];
  }

  start() {
    this.spider.queue.add(this.url);
    this.spider.start();
  }
}

module.exports = WMASGSpider;
