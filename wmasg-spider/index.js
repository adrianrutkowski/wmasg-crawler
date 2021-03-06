const EventEmitter = require('events');

const huntsman = require('huntsman');
const extractLinks = require('huntsman/lib/link').extractor;

class WMASGSpider extends EventEmitter {
  constructor() {
    super();

    this.url = 'http://wmasg.pl/pl/consignment';
    this.spider = huntsman.spider();

    this.spider.extensions = [huntsman.extension('cheerio')];

    this.spider.on('/pl/consignment$', this.consignmentHandler.bind(this));
    this.spider.on('page=\d*', this.consignmentPageHandler.bind(this));
    this.spider.on('/pl/consignment/show/', this.consignmentItemHandler.bind(this));

    this.spider.on('HUNTSMAN_EXIT', () => this.emit('end'))
  }

  start() {
    this.spider.queue.add(this.url);
    this.spider.start();
    this.emit('start');
  }

  getNumberOfPages(result) {
    const $ = result.extension.cheerio;
    return parseInt($('#pagination > a:nth-child(11)').text().trim());
  }

  consignmentHandler(error, result) {
    if (error) {
      this.emit('error', error);
      return;
    }

    const numberOfPages = this.getNumberOfPages(result);

    for (let i = 1; i <= numberOfPages; i++) {
      this.spider.queue.add(this.url + `?page=${i}`);
    }
  }

  consignmentPageHandler(error, result) {
    if (error) {
      this.emit('error', error);
      return;
    }

    extractLinks(result.uri, result.body)
      .filter(link => this.spider.match(link) && link !== this.url)
      .forEach(link => this.spider.queue.add(link));
  }

  consignmentItemHandler(error, result) {
    if (error) {
      this.emit('error', error);
      return;
    }

    const item = {
      title: this.extractConsignmentItemTitle(result),
      price: this.extractConsignmentItemPrice(result),
      description: this.extractConsignmentItemDescription(result)
    }

    this.emit('item', item);
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
