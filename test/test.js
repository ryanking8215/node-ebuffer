var assert = require('chai').assert

var EBuffer = require('../lib/ebuffer.js')

describe('EBuffer', function() {
	describe('#number()', function() {
		it('should be ok', function() {
			var buf = new EBuffer();
			assert.equal(buf.length(), 0);
			// {
			// 	'Int8': -5,
			// 	'UInt16': 123,
			// 	'UInt32': 3239123,
			// 	'Int32': -4947,
			// 	'Float': -2856.12,
			// }.
			buf.writeInt8(-5);
			buf.writeUInt16(5798);
			assert.equal(buf.readInt8(), -5);
			assert.equal(buf.readUInt16(), 5798);
		});
	});
});