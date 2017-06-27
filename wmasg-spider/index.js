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
}

module.exports = WMASGSpider;
