var assert = require('chai').assert
var os = require('os')

var EBuffer = require('../lib/ebuffer.js')

describe('EBuffer', function() {
	describe('#number()', function() {
		it('simple', function() {
			var buf = new EBuffer();
			assert.equal(buf.length(), 0);
			buf.writeInt8(-5);
			buf.writeUInt16(5798);
			assert.equal(buf.length(),3);
			assert.equal(buf.readInt8(), -5);
			assert.equal(buf.readUInt16(), 5798);
			assert.equal(buf.length(), 0);
		});
		it('no enough data', function() {
			var buf = new EBuffer();
			buf.writeInt8(-5);
			buf.writeUInt16(5798);
			assert.equal(buf.readInt8(), -5);
			assert.throws(function() {
				buf.readUInt32();
			}, RangeError);
		});
		it('setup byte_order', function() {
			var buf = new EBuffer(64, 'BE');
			buf.writeUInt16(0x5798);
			var b = buf.peek();
			assert.equal(b.readUInt16LE(), 0x9857);
			assert.equal(buf.readUInt16(), 0x5798);
			assert.equal(buf.length(), 0);
		});
		it('combine', function() {
			var buf = new EBuffer();
			var data = {
				'Int8': -5,
				'Float': 2856.12,
				'UInt16': 123,
				'Int32': -4947,
				'UInt32': 3239123,
				'Double': -19471347.10812342012,
			};
			for (var i in data) {
				EBuffer.prototype['write'+i].call(buf, data[i]);
			}
			for (var i in data) {
				var v = EBuffer.prototype['read'+i].call(buf);
				if (i === 'Float') {
					assert(Math.abs(v-data[i]<1e-3), 'float failed');
				} else {
					assert.equal(v, data[i]);
				}
			}
			assert.equal(buf.length(), 0);
		});
	});
	describe('#buffer()', function() {
		it('simple', function() {
			var buf = new EBuffer();
			buf.setByteOrder('LE');
			buf.writeBuffer(new Buffer([0x11, 0x22, 0x33, 0x44]));
			assert.equal(buf.length(), 4);
			assert.equal(buf.readUInt32(), 0x44332211);
			assert.equal(buf.length(), 0);
		})
	});
	describe('#string()', function() {
		it('default encoding', function() {
			var buf = new EBuffer();
			var str = 'hello world;你好世界'
			buf.writeString(str);
			var ret = buf.readString(-1);
			assert.equal(str, ret);
			assert.equal(buf.length(), 0);
		});
	});
	describe('#consume()', function() {
		it('with size', function() {
			var buf = new EBuffer();
			var data = {
				'Int8': -5,
				'Int32': -109471374,
				'UInt16': 123,
			};
			for (var i in data) {
				EBuffer.prototype['write'+i].call(buf, data[i]);
			}
			buf.consume(5);
			assert.equal(buf.readUInt16(), 123);
			assert.equal(buf.length(), 0);
		});
		it('<0 means all', function() {
			var buf = new EBuffer();
			var data = {
				'Int8': -5,
				'Int32': -109471374,
				'UInt16': 123,
			};
			for (var i in data) {
				EBuffer.prototype['write'+i].call(buf, data[i]);
			}
			buf.writeString('haowjefaodifaf');
			buf.consume(-1);
			assert.equal(buf.length(), 0);
		});
	});
	describe('#resize()', function() {
		it('no allocate', function() {
			var buf = new EBuffer(8);
			buf.writeInt32(5000);
			buf.writeInt16(6060);
			buf.readInt32();
			buf.writeBuffer(new Buffer(6));
			assert.equal(buf.length(), 8);
			assert.equal(buf.readInt16(), 6060);
			assert.equal(buf.dump().version, 0);
		});
		it('allocate new', function() {
			var buf = new EBuffer(20);
			buf.writeInt32(5000);
			buf.writeInt16(6060);
			buf.writeInt32(-6060);
			buf.readInt32();
			buf.writeBuffer(new Buffer(128));
			assert.equal(buf.length(), 128+2+4);
			assert.equal(buf.readInt16(), 6060);
			assert.equal(buf.readInt32(), -6060);
			assert.equal(buf.dump().version, 1);
		})
	});
	describe('#example()', function() {
		it('test', function() {
			var buf = new EBuffer(10);
			assert.equal(buf.length(), 0); // 0
			buf.writeInt8(9);
			assert.equal(buf.length(), 1); // 1
			buf.writeInt16(123);
			assert.equal(buf.length(), 3); // 3
			buf.writeBuffer(new Buffer(20)); // buffer grows inside
			assert.equal(buf.length(), 23); // 23

			// using readXXX to pop data from the EBuffer
			assert.equal(buf.readInt8(), 9); // 9
			assert.equal(buf.readInt16(), 123); // 123
			assert.equal(buf.length(), 20); // 20

			buf.consume(20);
			assert.equal(buf.length(), 0); // 0

			// using peek to fetch the data, which won't consuming the data
			buf.writeUInt8(50);
			assert.equal(buf.length(), 1); // 1
			var b = buf.peek(-1); // <0 means all valid data, return Buffer object
			assert.equal(b.readUInt8(), 50); // 50
			assert.equal(buf.length(), 1); // 1
		});
	});
});
