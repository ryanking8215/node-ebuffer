# EBuffer
An enhanced buffer for using buffer easily.

## Installation
``` bash
    $ npm install ebuffer
```

## Usage
``` javascript
var EBuffer = require('ebuffer')

// using default size(1024) and default byte_order(os.endianness())
var buf = new EBuffer();
// size is 512, byte_order is 'BE'
var buf = new EBuffer(512, 'BE');

// using writeXXX to push data to the EBuffer
var buf = new EBuffer(10);
console.log(buf.length()); // 0
buf.writeInt8(9);
console.log(buf.length()); // 1
buf.writeInt16(123);
console.log(buf.length()); // 3
buf.writeBuffer(new Buffer(20)); // buffer grows inside
console.log(buf.length()); // 23

// using readXXX to pop data from the EBuffer
console.log(buf.readInt8()); // 9
console.log(buf.readInt16()); // 123
console.log(buf.length()); // 20

buf.consume(20);
console.log(buf.length()); // 0

// using peek to fetch the data, which won't consuming the data
buf.writeUInt8(50);
var b = buf.peek(); // using all valid data, return Buffer object
console.log(b.readUInt8()); // 50
console.log(buf.length()); // 1
```
