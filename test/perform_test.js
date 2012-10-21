var perform = require('../lib/perform.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['deferred'] = {
  setUp: function(done) {
    this.dfd = perform.er();
    // setup here
    done();
  },
  'api basics': function(test) {
    test.expect(7);
    // tests here
    test.equal( typeof this.dfd.resolve, 'function', '.resolve should be a function');
    test.equal( typeof this.dfd.reject, 'function', '.reject should be a function');
    test.equal( typeof this.dfd.notify, 'function', '.notify should be a function');
    test.equal( typeof this.dfd.done, 'function', '.done should be a function');
    test.equal( typeof this.dfd.fail, 'function', '.fail should be a function');
    test.equal( typeof this.dfd.progress, 'function', '.progress should be a function');
    test.equal( typeof this.dfd.promise, 'function', '.promise should be a function' );
    test.done();
  }

};
