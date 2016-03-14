'use strict';

var os = require('os');

function is_le(byte_order) {
	return byte_order === 'LE';
}

function check_endian(byte_order) {
	if (typeof byte_order === 'string') {
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
	var byte_order = check_endian(v);
	this._order = byte_order;
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
	if (is_le(byte_order)) {
		var v = this._buf.readInt16LE(this._r);
	} else {
		var v = this._buf.readInt16BE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readUInt16 = function() {
	var byte_order = this._order;
	var size = 2;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	if (is_le(byte_order)) {
		var v = this._buf.readUInt16LE(this._r);
	} else {
		var v = this._buf.readUInt16BE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readInt32 = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	if (is_le(byte_order)) {
		var v = this._buf.readInt32LE(this._r);
	} else {
		var v = this._buf.readInt32BE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readUInt32 = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	if (is_le(byte_order)) {
		var v = this._buf.readUInt32LE(this._r);
	} else {
		var v = this._buf.readUInt32BE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readDouble = function() {
	var byte_order = this._order;
	var size = 8;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	if (is_le(byte_order)) {
		var v = this._buf.readDoubleLE(this._r);
	} else {
		var v = this._buf.readDoubleBE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readFloat = function() {
	var byte_order = this._order;
	var size = 4;
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	if (is_le(byte_order)) {
		var v = this._buf.readFloatLE(this._r);
	} else {
		var v = this._buf.readFloatBE(this._r);
	}
	this._r+=size;
	return v;
}

EBuffer.prototype.readBuffer = function(size) {
	size = size >>> 0;
	if (size==0) {
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

EBuffer.prototype.consume = function(size) {
	size = size >>> 0;
	if (size==0) {
		size = this.length()
	} 
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	this._r+=len;
}

EBuffer.prototype.peek = function(size) {
	size = size >>> 0;
	if (size==0) {
		size = this.length();
	}
	if (this.length() < size) {
		throw new RangeError('No enough data');
	}
	return this._buf.slice(this._r, this._r+size);
}

EBuffer.prototype.writeInt8 = function(v) {
	this._resizeIfNeed(1);
	var nbytes = 0;
	nbytes = this._buf.writeInt8(v, this._w);
	this._w+=nbytes;
}

EBuffer.prototype.writeUInt8 = function(v) {
	this._resizeIfNeed(1);
	var nbytes = 0;
	nbytes = this._buf.writeUInt8(v, this._w);
	this._w+=nbytes;
}

EBuffer.prototype.writeInt16 = function(v) {
	this._resizeIfNeed(2);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.writeInt16LE(v, this._w);
	} else {
		nbytes = this._buf.writeInt16BE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeUInt16 = function(v) {
	this._resizeIfNeed(2);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.writeUInt16LE(v, this._w);
	} else {
		nbytes = this._buf.writeUInt16BE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeInt32 = function(v) {
	this._resizeIfNeed(4);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.writeInt32LE(v, this._w);
	} else {
		nbytes = this._buf.writeInt32BE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeUInt32 = function(v) {
	this._resizeIfNeed(4);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.writeUInt32LE(v, this._w);
	} else {
		nbytes = this._buf.writeUInt32BE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeDouble = function(v) {
	this._resizeIfNeed(8);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.WriteDoubleLE(v, this._w);
	}
	else {
		nbytes = this._buf.WriteDoubleBE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeFloat = function(v) {
	this._resizeIfNeed(4);
	var byte_order = this._order;
	var nbytes = 0;
	if (is_le(byte_order)) {
		nbytes = this._buf.writeFloatLE(v, this._w);
	}
	else {
		nbytes = this._buf.writeFloatBE(v, this._w);
	}
	this._w+=nbytes;
}

EBuffer.prototype.writeBuffer = function(v) {
	var buf = new Buffer(v);
	this._resizeIfNeed(buf.length);
	buf.copy(this._buf, this._w);
	this._w+=buf.length;
}

EBuffer.prototype.writeString = function(string, encoding) {
	var size = Buffer.byteLength(string, encoding);
	this._resizeIfNeed(size);
	var nbytes = 0;
	nbytes = this._buf.write(string, this._w, size, encoding);
	this._w+=nbytes;
}

EBuffer.prototype._resizeIfNeed = function(append_size) {
	if (append_size > this.space()) {
		this._resize(append_size + this.length());
	}
}

EBuffer.prototype._resize = function(size) {
	console.trace('resize')
	var len = this.length();
	if (size<=this._buf.length) {
		this._buf.copy(this._buf, 0, this._r, this._w);
	} else {
		// allocate new
		var new_buf = new Buffer(size);
		this._buf.copy(new_buf, 0, this._r, this._w);
		this._buf = new_buf;
	}
	this._r = 0;
	this._w = len;
}

EBuffer.prototype.dump = function() {
	return Object.freeze({
		buf: this._buf, 
		r: this._r,
		w: this._w,
		bo: this._order,
	})
}

module.exports = EBuffer;
