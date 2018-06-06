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

The functions in this module can operate on string numbers of unlimited size and will maintain precision to an infinite number of significant digits.

The default character alphabet is [0-9a-z].  This can be customized by editing the array `consts.alphabet` that defines the current alphabet.  Each element of `consts.alphabet` should be a single character; the index of the element is taken to be the numerical value of the character.  In general, for functions that accept a base as an argument the maximum base is the current alphabet length.

The module is case insensitive by default.  If necessary, case sensitivity can be enabled by setting `consts.caseSensitive` to true.

For example, one can define a custom alphabet where upper case and lower case letters assume different numerical values:

```javascript
numstr.consts.caseSensitive = true;
numstr.consts.alphabet = Array.from('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
```

Some functions are intended to operate only on certain bases.  Namely, `bufferFromHexStr`, `no0x`, and `with0x` operate on hexadecimal numbers; `toSci` and `roundInt` operate on decimal numbers.

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

### toSci

Convert to scientific notation a base 10 integer in string representation.  If a minimum exponent is specified, integers with a smaller exponent will be returned in fixed point notation.  By default, the function is precise to an infinite number of significant digits.

```javascript
// Parameters
let str = '123450000';                  // {string} - The base 10 integer to convert.
let minExp = 3;                         // {number = 0} - Optional. Number will be returned in fixed point notation unless its exponent is at least minExp.
let precision = 4;                      // {number = +Infinity} - Optional. The number of significant digits to include in the converted number.

numstr.toSci(str, minExp, precision);   // {string} - The integer in scientific notation.

// Examples
numstr.toSci('123450000');              // returns '1.2345e+8'
numstr.toSci('123450000', 3, 4);        // returns '1.234e+8'
numstr.toSci('123');                    // returns '1.23e+2'
numstr.toSci('123', 3);                 // returns '123'
```

### roundInt

Round a base 10 integer string to a given number of significant digits.  Rounds half to even.

```javascript
numstr.roundInt('123456', 4);          // returns '123500'
numstr.roundInt('123450', 4);          // returns '123400'
numstr.roundInt('123350', 4);          // returns '123400'
numstr.roundInt('-123350', 4);         // returns '-123400'
```

### convert

Convert a positive integer string to another base.

```javascript
// Parameters
let numberString = '4f9414295fef9242d8a49762e72af14';    // {string} - A positive integer in any base.
let fromBase = 16;                                       // {number} - The current base of the integer string.
let toBase = 36;                                         // {number} - The base to which the string will be converted.

numstr.convert(numberString, fromBase, toBase);          // {string} - The integer expressed in the requested base.
```

Note: this function can be installed independently via the <a href="https://github.com/ken-oyWs2vlG/altered-base#readme">altered-base</a> package.  See the <a href="https://github.com/ken-oyWs2vlG/altered-base#readme">altered-base readme</a> for additional documentation.

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
numstr.charToVal('A');         // returns 10
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