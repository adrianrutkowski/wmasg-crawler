const config = require('config');
const validate = require('validate.js');

const WMASGSpider = require('../wmasg-spider');

const searchItemsConfig = config.get('Job.SearchItems');

class SearchItems {
  constructor(concurrency = searchItemsConfig.concurrency) {
    this.title = 'search items';
    this.concurrency = concurrency;
    this.dataConstraints = { keywords: { presence: true, type: 'Array' }, price: { type: 'Number' }};
  }

  match(item, expression) {
    return item.title.toLowerCase().match(expression) || item.description.toLowerCase().match(expression);
  }

  process(job, done) {
    const errors = validate(job.data, this.dataConstraints);
    if (!errors) {
      this.getItemsByKeywords(job.data)
        .then(items => done(null, items))
        .catch(error => {
          done('Job failed for unknown reason. Please contact service administrator.');
          throw error;
        });
    } else {
      done(errors[Object.keys(errors)[0]][0]);
    }
  }

  getItemsByKeywords({ keywords, price }) {
    return new Promise((resolve, reject) => {
      const spider = new WMASGSpider();
      const expression = new RegExp(`(${keywords.join('|')})`, 'g');
      const items = [];

      spider.on('error', error => reject(error));
      spider.on('end', () => resolve(items));
      spider.on('item', item => {
        if ((!price || item.price <= price) && this.match(item, expression)) {
          items.push(item);
        }
      });

      spider.start();
    });
  }
}

module.exports = SearchItems;
