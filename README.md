# <img src="./yoyo.png" width="200" /> utils-numstr

A collection of utilities for manipulating numbers in string representation.

## install

```
npm i utils-numstr
```

## usage

```javascript
const numstr = require('utils-numstr');
```

The default character alphabet is [0-9a-z].  This can be customized by editing the array `consts.alphabet` that defines the current alphabet.  Each element of `consts.alphabet` should be a single character; the index of the element is taken to be the numerical value of the character.

The package `utils-numstr` is case insensitive by default.  If necessary, case sensitivity can be enabled by setting `consts.caseSensitive` to true.

For example, one can define a custom alphabet where upper case and lower case letters assume different numerical values:

```javascript
numstr.consts.caseSensitive = true;
numstr.consts.alphabet = Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
```

## functions

### isNumStr

Determine if a string passably represents a number in a given base.  False if the string contains invalid characters or too many `'.'` points; otherwise true.  Integers only by default.  Negative values are ok.

```javascript
// Parameters
let str = 'abcdef.fedcba';                 // {string} - The string to test.
let base = 16;                             // {number = 10} - Optional. The ostensible base of the string.
let radixPointOk = true;                   // {bool = false} - Optional. If false, only integers are allowed.

numstr.isNumStr(str, base, radixPointOk);  // {bool} - Returns true if the string is a number in the specified base, false otherwise.
```

### bufferFromHexStr

Obtain a buffer from a hex value in string representation.  Whitespace in the string is ignored as are `0x` prefixes.

Note: this function accomodates the Buffer data type.  Therefore, it will only recognize the conventional [0-9a-f] case insensitive hexadecimal alphabet.  It is unaffected by changes to `consts.alphabet` or `consts.caseSensitive`.  Hex sequences of odd length are padded with a leading zero to conform to the structure of a byte array.  If a non-hex character is encountered, any remaining bytes in the sequence will be truncated consistent with the behavior of `Buffer.from`.

```javascript
numstr.bufferFromHexStr('4f941 4295f ef924 2d8a4 9762e 72af1 4');     // returns <Buffer 04 f9 41 42 95 fe f9 24 2d 8a 49 76 2e 72 af 14>
```


### no0x

Remove the hex prefix `'0x'`, if present, from a hex string.

```javascript
numstr.no0x('abcdef');          // returns 'abcdef'
numstr.no0x('0xabcdef');        // returns 'abcdef'
```

### with0x

Add a hex prefix `'0x'`, if not already present, to a hex string.

```javascript
numstr.with0x('abcdef');        // returns '0xabcdef'
numstr.with0x('0xabcdef');      // returns '0xabcdef'
```

### roundInt

Round a base 10 integer string to a given number of significant digits.  Rounds half to even.

```javascript
numstr.roundInt('123456', 4);          // returns '123500'
numstr.roundInt('123450', 4);          // returns '123400'
numstr.roundInt('123350', 4);          // returns '123400'
numstr.roundInt('-123350', 4);         // returns '-123400'
```

### rectify

Format a number string so that it looks like a normal number.

* Leading zeros are removed from the integer part. 
* Trailing zeros are removed from the fractional part. 
* Negative signs are removed from zero values. 
* A `'.'` point is included only for nonzero fractional values. 
* If the string is all zeros, is empty, or otherwise implies a zero value, the function returns `'0'`.

```javascript
numstr.rectify('-00123.4560');      // returns '-123.456'
numstr.rectify('123.000');          // returns '123'
numstr.rectify('-.0');              // returns '0'
```

### removeLeadingZeros

Remove the leading zeros from a string.

```javascript
numstr.removeLeadingZeros('0000abc');       // returns 'abc'
numstr.removeLeadingZeros('0000');          // returns ''
```

### removeTrailingZeros

Remove the trailing zeros from a string.

```javascript
numstr.removeTrailingZeros('1230000');      // returns '123'
numstr.removeTrailingZeros('0000');         // returns ''
```

### incInt

Increment an integer string in a given base.

```javascript
numstr.incInt('00ff', 16);           // returns '100'
numstr.incInt('-100', 10);           // returns '-99'
```

### decInt

Decrement an integer string in a given base.

```javascript
numstr.decInt('0100', 16);           // returns 'ff'
numstr.decInt('-100', 10);           // returns '-101'
```

### incChar

Increment a character to the succeeding character in consts.alphabet, modulo the given base.

```javascript
numstr.incChar('1', 2);            // returns '0'
numstr.incChar('1', 10);           // returns '2'
```

### decChar

Decrement a character to the preceding character in consts.alphabet, modulo the given base.

```javascript
numstr.decChar('0', 10);           // returns '9'
numstr.decChar('a', 16);           // returns '9'
```

### charToVal

Convert a character to its numerical value according to the current alphabet.  Returns -1 if the character is not in `consts.alphabet`.

```javascript
numstr.charToVal('a');         // returns 10
numstr.charToVal('!');         // returns -1
```

### valToChar

Convert a numerical value to its corresponding character according to the current alphabet.  Returns `undefined` if the value exceeds the range of `consts.alphabet`.

```javascript
numstr.valToChar(15);          // returns 'f'
numstr.valToChar(-1);          // returns undefined
```

## license

MIT License

Copyright (c) 2018 Kenneth Sedgwick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.