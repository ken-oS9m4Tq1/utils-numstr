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

### isNumStr

Determine if a string passably represents a number in a given base.  False if the string contains invalid characters or too many `.` points; otherwise true.  Negative values are ok.  Case sensitivity is dependent on `consts.caseSensitive`.

```javascript
// Parameters
let str = 'abcdef.fedcba';                 // {string} - The string to test.
let base = 16;                             // {number = 10} - Optional. The ostensible base of the string.
let radixPointOk = true;                   // {bool = false} - Optional. If false, only integers are allowed.

numstr.isNumStr(str, base, radixPointOk);  // {bool} - Returns true if the string is a number in the specified base, false otherwise.
```

### no0x

Remove the hex prefix `0x`, if present, from a hex string.

```javascript
numstr.no0x('abcdef');             // returns 'abcdef'
numstr.no0x('0xabcdef');           // returns 'abcdef'
```

### with0x

Add a hex prefix `0x`, if not already present, to a hex string.

```javascript
numstr.with0x('abcdef');             // returns '0xabcdef'
numstr.with0x('0xabcdef');           // returns '0xabcdef'
```