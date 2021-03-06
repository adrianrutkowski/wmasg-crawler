const proxyquire = require('proxyquire');
const sinon = require('sinon');
const test = require('ava').test;

const createHuntsmanProxy = () => {
  const huntsman = {};

  huntsman.extension = sinon.stub().returnsArg(0);

  huntsman.spider = sinon.stub().returns({
    start: sinon.stub(),
    queue: {
      add: sinon.stub()
    },
    on: sinon.stub(),
    match: sinon.stub(),
  });

  return huntsman;
}

test.beforeEach(t => {
  t.context.huntsman = createHuntsmanProxy();
  t.context.extractLinks = {
    extractor: sinon.stub()
  }
  t.context.WMASGSpider = proxyquire('./', {
    huntsman: t.context.huntsman,
    'huntsman/lib/link': t.context.extractLinks
  });
})

test('create and store huntsman spider instance', t => {
  const spider = new t.context.WMASGSpider();

  t.truthy(spider.spider);
  t.true(t.context.huntsman.spider.calledOnce);
});

test('setup spider extensions', t => {
  const spider = new t.context.WMASGSpider();

  t.true(t.context.huntsman.extension.calledWith('cheerio'));
  t.deepEqual(spider.spider.extensions, ['cheerio']);
});

test('keep site url', t => {
  const spider = new t.context.WMASGSpider();
  t.true(spider.url === 'http://wmasg.pl/pl/consignment');
});

test('start spider', t => {
  const spider = new t.context.WMASGSpider();

  spider.start();

  t.true(spider.spider.queue.add.calledOnce);
  t.true(spider.spider.queue.add.calledWith(spider.url));
  t.true(spider.spider.start.calledOnce);
});

test('handle consignment page', t => {
  const spider = new t.context.WMASGSpider();
  const result = { uri: 'http://foo.bar', body: 'Plain html body' };

  t.context.extractLinks.extractor.returns([spider.url, 'http://other.url']);
  spider.spider.match.returns(true);

  spider.consignmentPageHandler(null, result);

  t.true(spider.spider.queue.add.calledOnce);
  t.true(spider.spider.queue.add.calledWith('http://other.url'));
});

test('extract consignment item title', t => {
  const titles = [
    { provided: '   Title  ', expected: 'Title' },
    { provided: 'Other title  ', expected: 'Other title' }
  ];
  const spider = new t.context.WMASGSpider();

  for (let title of titles) {
    const cheerio = sinon.stub()
      .withArgs('#article .header h1')
      .returns({ text: sinon.stub().returns(title.provided) });
    const result = { extension: { cheerio } };

    t.deepEqual(spider.extractConsignmentItemTitle(result), title.expected);
  }
});

test('extract consignment item price', t => {
  const prices = [
    { provided: '     50.00 PLN', expected: 50 },
    { provided: '42.42 PLN  ', expected: 42.42 }
  ];
  const spider = new t.context.WMASGSpider();

  for (let price of prices) {
    const cheerio = sinon.stub()
      .withArgs('#article .common-table tr:nth-child(3) > td')
      .returns({ text: sinon.stub().returns(price.provided) });
    const result = { extension: { cheerio } };

    t.deepEqual(spider.extractConsignmentItemPrice(result), price.expected);
  }
});
