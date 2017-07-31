const huntsman = require('huntsman');
const extractLinks = require('huntsman/lib/link').extractor;

class WMASGSpider {
  constructor() {
    this.url = 'http://wmasg.pl/pl/consignment';
    this.spider = huntsman.spider();

    this.spider.extensions = [huntsman.extension('cheerio')];

    this.spider.on('/pl/consignment$', this.consignmentHandler.bind(this));
    this.spider.on('/pl/consignment/show/', this.consignmentItemHandler.bind(this));
  }

  start() {
    this.spider.queue.add(this.url);
    this.spider.start();
  }

  consignmentHandler(error, result) {
    extractLinks(result.uri, result.body)
      .filter(link => this.spider.match(link) && link !== this.url)
      .forEach(link => this.spider.queue.add(link));
  }

  consignmentItemHandler(error, result) {
    const item = {
      title: this.extractConsignmentItemTitle(result),
      price: this.extractConsignmentItemPrice(result),
      description: this.extractConsignmentItemDescription(result)
    }

    console.log(item);
  }

  extractConsignmentItemTitle(result) {
    const $ = result.extension.cheerio;

    return $('#article .header h1')
      .text()
      .trim();
  }

  extractConsignmentItemPrice(result) {
    const $ = result.extension.cheerio;
    const price = $('#article .common-table tr:nth-child(3) > td')
      .text()
      .trim();

    return parseFloat(price);
  }

  extractConsignmentItemDescription(result) {
    const $ = result.extension.cheerio;

    return $('#article .content')
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim()
      .replace(/[\n\r]+/g, '');
  }
}

module.exports = WMASGSpider;
