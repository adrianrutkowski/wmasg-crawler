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
    }
  });

  return huntsman;
}

test.beforeEach(t => {
  t.context.huntsman = createHuntsmanProxy();
  t.context.WMASGSpider = proxyquire('./', { huntsman: t.context.huntsman });
})

test('create and store huntsman spider instance', t => {
  const spider = new t.context.WMASGSpider();

  t.truthy(spider.spider);
  t.true(t.context.huntsman.spider.calledOnce);
});

test('setup spider extensions', t => {
  const spider = new t.context.WMASGSpider();

  t.true(t.context.huntsman.extension.calledWith('recurse'));
  t.true(t.context.huntsman.extension.calledWith('cheerio'));
  t.deepEqual(spider.spider.extensions, ['recurse', 'cheerio']);
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
