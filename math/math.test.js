const ava = require('ava');
const math = require('./math');

ava.test('adds two numbers', t => {
  t.plan(1);
  t.truthy(math.add(5, 10), 15);
});
