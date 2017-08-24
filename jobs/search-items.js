const WMASGSpider = require('../wmasg-spider');

class SearchItems {
  constructor(concurrency = 5) {
    this.title = 'search items';
    this.concurrency = concurrency;
  }

  match(item, expression) {
    return item.title.toLowerCase().match(expression) || item.description.toLowerCase().match(expression);
  }

  process(job, done) {
    const spider = new WMASGSpider();
    const {keywords, price} = job.data;
    const expression = new RegExp(`(${keywords.join('|')})`, 'g');
    const items = [];

    spider.on('error', error => done(error));
    spider.on('end', () => done(null, items));
    spider.on('item', item => {
      if ((!price || item.price <= price) && this.match(item, expression)) {
        items.push(item);
      }
    });

    spider.start();
  }
}

module.exports = SearchItems;
