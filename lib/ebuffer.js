'use strict';

var os = require('os');

function is_le(byte_order) {
	return byte_order === 'LE';
}

function check_endian(byte_order) {
	if (typeof(byte_order) === 'string') {
		byte_order = byte_order.toUpperCase();
		if (byte_order === 'LE' || byte_order === 'BE') {
			return byte_order;
		}
	}
	throw TypeError('byte_order should be "LE, BE, le, be"');
}

var EBuffer = function(cap, byte_order) {
	cap = cap >>> 0;
	if (cap == 0) {
		cap = 1024;
	}
	if (!byte_order) {
		byte_order = os.endianness();
	} else {
		byte_order = check_endian(byte_order);
	}
	this._buf = new Buffer(cap);
	this._r = 0;
	this._w = 0;
	this._order = byte_order;
    this._version = 0;
}

EBuffer.prototype.length = function() {
	return this._w - this._r;
}

EBuffer.prototype.space = function() {
	return this._buf.length - this._w;
}

EBuffer.prototype.byteOrder = function() {
	return this._order;
}

EBuffer.prototype.setByteOrder = function(v) {
	this._order = check_endian(v);
}

EBuffer.prototype.readInt8 = function() {
	var size = 1;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = this._buf.readInt8(this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readUInt8 = function() {
	var size = 1;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = this._buf.readUInt8(this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readInt16 = function() {
	var byte_order = this._order;
	var size = 2;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readInt16'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readUInt16 = function() {
	var byte_order = this._order;
	var size = 2;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readUInt16'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readInt32 = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readInt32'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readUInt32 = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readUInt32'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readDouble = function() {
	var byte_order = this._order;
	var size = 8;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readDouble'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readFloat = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var v = Buffer.prototype['readFloat'+byte_order].call(this._buf, this._r);
	this._r+=size;
	return v;
}

EBuffer.prototype.readBuffer = function(size) {
	if (typeof(size) === 'undefined') {
		size = this.length();
	}
	if (typeof(size) !== 'number') {
		throw new TypeError('size should be number');
	}
	if (size<0) {
		size = this.length();
	}
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	var buf = new Buffer(size);
	this._buf.copy(buf, 0, this._r, this._r+size);
	this._r+=size;
	return buf;
}

EBuffer.prototype.readString = function(size, encoding) {
    var buf = this.peek(size);
    var str = buf.toString(encoding);
    this._r+=buf.length;
    return str;
}

EBuffer.prototype.consume = function(size) {
	if (typeof(size) === 'undefined') {
		size = this.length();
	}
	if (typeof(size) !== 'number') {
		throw new TypeError('size should be number');
	}
	if (size<0) {
		size = this.length()
	}
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	this._r+=size;
}

EBuffer.prototype.peek = function(size) {
	if (typeof(size) === 'undefined') {
		size = this.length();
	}
	if (typeof(size) !== 'number') {
		throw new TypeError('size should be number');
	}
	if (size<0) {
		size = this.length();
	}
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	return this._buf.slice(this._r, this._r+size);
}

EBuffer.prototype.writeInt8 = function(v) {
    var size = 1;
    this._resizeIfNeed(size);
	this._buf.writeInt8(v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeUInt8 = function(v) {
    var size = 1;
	this._resizeIfNeed(size);
	var nbytes = 0;
	this._buf.writeUInt8(v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeInt16 = function(v) {
    var size = 2;
	this._resizeIfNeed(size);
	var byte_order = this._order;
	Buffer.prototype['writeInt16'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeUInt16 = function(v) {
    var size = 2;
	this._resizeIfNeed(size);
    var byte_order = this._order;
	Buffer.prototype['writeUInt16'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeInt32 = function(v) {
    var size = 4;
    this._resizeIfNeed(size);
	var byte_order = this._order;
	var nbytes = 0;
	Buffer.prototype['writeInt32'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeUInt32 = function(v) {
    var size = 4;
	this._resizeIfNeed(size);
	var byte_order = this._order;
	Buffer.prototype['writeUInt32'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeDouble = function(v) {
    var size = 8;
	this._resizeIfNeed(size);
	var byte_order = this._order;
	Buffer.prototype['writeDouble'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeFloat = function(v) {
    var size = 4;
	this._resizeIfNeed(size);
	var byte_order = this._order;
	Buffer.prototype['writeFloat'+byte_order].call(this._buf, v, this._w);
	this._w+=size;
}

EBuffer.prototype.writeBuffer = function(buf) {
    if (!Buffer.isBuffer(buf)) {
        throw new TypeError('should be Buffer')
    }
	this._resizeIfNeed(buf.length);
	buf.copy(this._buf, this._w);
	this._w+=buf.length;
}

EBuffer.prototype.writeString = function(string, encoding) {
	var size = Buffer.byteLength(string, encoding);
	this._resizeIfNeed(size);
	this._buf.write(string, this._w, size, encoding);
	this._w+=size;
}

EBuffer.prototype._resizeIfNeed = function(append_size) {
	if (append_size > this.space()) {
		this._resize(append_size + this.length());
	}
}

EBuffer.prototype._resize = function(size) {
	// console.trace('resize')
	var len = this.length();
	if (size<=this._buf.length) {
		this._buf.copy(this._buf, 0, this._r, this._w);
	} else {
		// allocate new
        var size = Math.max(size, 3*this._buf.length/2);
		var new_buf = new Buffer(size);
		this._buf.copy(new_buf, 0, this._r, this._w);
		this._buf = new_buf;
		this._version+=1;
	}
	this._r = 0;
	this._w = len;
}

EBuffer.prototype.dump = function() {
	return Object.freeze({
		// buf: this._buf,
		r: this._r,
		w: this._w,
		bo: this._order,
		version: this._version
	})
}

module.exports = EBuffer;
