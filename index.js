

let consts = {
  alphabet: [ 
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z' 
  ],
  minus: 45,
  point: 46
}

/* Check that a string represents a number in a given base.
** False if the string contains invalid characters or too many radix points. True otherwise.
** Case sensitivity is depedent on consts.caseSensitive. Negative values ok.
**
** @param {string} str - The string to be tested.
** @param {number=} base - The base to use when testing.
** @param {bool=} radixPointOk - True to allow fractional numbers, false to allow only integers.
** @return {bool} True if the string represents a number in the specified base, false otherwise.
*/
function isNumStr(str, base = 10, radixPointOk = false) {
  if (typeof str != 'string' || !Number.isInteger(base)) throw new Error("in isNumStr, data type mismatch");
  if (base < 2 || base > consts.alphabet.length) throw new Error('in isNumStr, base out of range');

  // If the first character is a negative sign, ignore it when testing.
  let start = 0;
  if (str.charCodeAt(0) == consts.minus) start = 1;

  // Check each character of the string.
  let nPoints = 0;
  for (let i = start; i < str.length; i++) {
    // Detect any invalid characters.
    let code = str.charCodeAt(i);
    if (!isOkCharCode(code, base, radixPointOk)) return false;
    
    // If radix points are allowed, make sure there is only one.
    if (code == consts.point) {
      nPoints++;
      if (nPoints > 1) return false;
    }
  }

  // If you get this far, the string is ok.
  return true;
}

/* Check if a character code represents a valid character in the specified base.
** Case insensitive unless consts.caseSensitive is true.
**
*/
function isOkCharCode(code, base, radixPointOk) {
  // Check against each character in consts.alphabet up to the specified base.
  for (let i = 0; i < base; i++) {
    let okCode = consts.alphabet[i].charCodeAt(0);
    if (code == okCode || (!consts.caseSensitive && code == changeCase(okCode))) return true;
  }

  // Conditional exception for the radix point.
  if (radixPointOk && code == consts.point) return true;

  // If you get this far, the code is not ok.
  return false;
}

/* Change the code of an upper case letter to the code of its lower case equivalent, and vice versa.
** If the code does not refer to a letter it is returned unaltered.
**
*/
function changeCase(code) {
  if (97 <= code && code <= 122) return code - 32;
  else if (65 <= code && code <= 90) return code + 32;
  else return code;
}

/* Obtain a buffer from a hex value in string representation.
** Whitespace is removed prior to conversion.
**
** @param {string} hexStr - A hex value in string representation.
** @return {buffer} The hex value as a byte array.
*/
function bufferFromHexStr(hexStr) {
  // Remove whitespace.
  hexStr = hexStr.replace(/\s+/g, '');

  // Remove 0x.
  hexStr = no0x(hexStr);

  // Hex values with an odd number of characters need to be padded; otherwise the last character will be truncated.
  if (hexStr.length % 2) hexStr = '0' + hexStr;

  // Convert to a buffer.
  return Buffer.from(hexStr, 'hex');
}

/* Remove the hex prefix, if present, from a hex string.
**
** @param {string} hexStr - The hex string.
** @return {string} The hex string without a 0x prefix.
*/
function no0x(hexStr) {
  if (hexStr.slice(0, 2) === '0x') hexStr = hexStr.slice(2);
  return hexStr;
}

/* Add a hex prefix, if not already present, to a hex string.
**
** @param {string} hexStr - The hex string.
** @return {string} The hex string with 0x prefix.
*/
function with0x(hexStr) {
  if (hexStr.slice(0, 2) !== '0x') hexStr = '0x' + hexStr;
  return hexStr;
}

/* Format a number string so that it looks like a normal number.
**
*/
function rectify(str) {
  let minus = String.fromCharCode(consts.minus);
  let point = String.fromCharCode(consts.point);

  // Remove the negative sign if necessary.
  let abs = (str[0] === minus) ? str.slice(1) : str;

  // Split into fractional and integer parts.
  let split = abs.split(point);
  let integerPart = split[0] || '';
  let fractionalPart = split[1] || '';

  // Trim zeros.
  integerPart = removeLeadingZeros(integerPart);
  fractionalPart = removeTrailingZeros(fractionalPart);

  // Put it back together.
  let rectified;
  rectified = integerPart ? integerPart : consts.alphabet[0];
  rectified += fractionalPart ? point + fractionalPart : '';

  // Replace the negative sign if necessary.
  if (str[0] === minus && rectified != consts.alphabet[0]) rectified = minus + rectified;

  return rectified;
}

/* Remove the leading zeros from a string.
**
*/
function removeLeadingZeros(str) {
  if (typeof str != 'string') throw new Error('in removeLeadingZeros, data type mismatch');

  let iNonZero = -1;
  for (let i = 0; i < str.length; i++) {
    if (charToVal(str[i]) != 0) {
      iNonZero = i; // index of the first nonzero digit
      break;
    }
  }
  if (iNonZero > 0) str = str.slice(iNonZero);
  if (iNonZero < 0) return ''; // if 'str' is entirely zeros or is the empty string
    
  return str;
}

/* Remove the trailing zeros from a string.
**
*/
function removeTrailingZeros(str) {
  if (typeof str != 'string') throw new Error('in removeTrailingZeros, data type mismatch');

  let iNonZero = -1;
  for (let i = str.length - 1; i >= 0; i--) {
    if (charToVal(str[i]) != 0) {
      iNonZero = i; // index of the first nonzero digit from the right.
      break;
    }
  }
  str = str.slice(0, iNonZero + 1); // if 'str' is entirely zeros or is the empty string, gives ''.

  return str;
}

/* Increment an integer string in a given base.
**
*/
function incInt(str, base = 10) {
  if (!isNumStr(str, base)) throw new Error('in incInt, str is not an integer in the given base');
  let minus = String.fromCharCode(consts.minus);

  let rec = rectify(str);

  // If the rectified value is negative, call decrement on the absolute value.
  if (rec[0] == minus) {
    let dec = decInt(rec.slice(1), base);
    return (dec == consts.alphabet[0]) ? dec : minus + dec; // avoid '-0'
  }

  // Find the first character from the right that is not maximal.
  // This is the character to increment.
  let maximalChar = consts.alphabet[base - 1];
  let incIndex = -1;
  for (let i = rec.length - 1; i >= 0; i--) {
    if (rec[i] != maximalChar) {
      incIndex = i;
      break;
    }
  }

  // If all characters are maximal, extend the int string by prepending a '0'.
  // The prepended character becomes the character to increment.
  if (incIndex < 0) {
    rec = consts.alphabet[0] + rec;
    incIndex = 0;
  }

  // Increment the appropriate character.
  let incrementedChar = incChar(rec[incIndex], base);
  let inc = rec.slice(0, incIndex) + incrementedChar;

  // Reset all lesser character places to zero.
  inc = inc.padEnd(rec.length, consts.alphabet[0]);

  return inc;
}

/* Decrement an integer string in a given base.
**
*/
function decInt(str, base = 10) {
  if (!isNumStr(str, base)) throw new Error('in decInt, str is not an integer in the given base');
  let minus = String.fromCharCode(consts.minus);

  let rec = rectify(str);

  // If the rectified value is negative, call increment on the absolute value.
  if (rec[0] == minus) {
    let inc = incInt(rec.slice(1), base);
    return (minus + inc);
  }

  // Find the first character from the right that is not zero.
  // This is the character to decrement.
  let decIndex = -1;
  for (let i = rec.length - 1; i >= 0; i--) {
    if (rec[i] != consts.alphabet[0]) {
      decIndex = i;
      break;
    }
  }

  // If all characters are found to be zero, the decremented value is -1.
  if (decIndex < 0) return minus + consts.alphabet[1];

  // Decrement the appropriate character.
  let decrementedChar = decChar(rec[decIndex], base);
  let dec = rec.slice(0, decIndex) + decrementedChar;

  // Reset all lesser character places to the maximal character for the given base.
  let maximalChar = consts.alphabet[base - 1];
  dec = dec.padEnd(rec.length, maximalChar);

  // Rectify in case the decremented character left a leading zero.
  dec = rectify(dec);

  return dec;
}

/* Increment a character to the succeeding character in consts.alphabet, modulo the given base.
**
*/
function incChar(char, base = 10) {
  let val = charToVal(char);
  if (val < 0) throw new Error('in incChar, invalid character');
  val = (val + 1) % base;
  return consts.alphabet[val];
}

/* Decrement a character to the preceding character in consts.alphabet, modulo the given base.
**
*/
function decChar(char, base = 10) {
  let val = charToVal(char);
  if (val < 0) throw new Error('in decChar, invalid character');
  val = (val + base - 1) % base;
  return consts.alphabet[val];
}

/* Return the value of a character according to the current alphabet or -1 if the character is invalid.
**
*/
function charToVal(char) {
  if (typeof char != 'string' || char.length != 1) throw new Error('in charToVal, invalid argument');

  if (consts.caseSensitive) return consts.alphabet.indexOf(char);

  let code = char.charCodeAt(0);
  let val = -1;
  for (let i = 0; i < consts.alphabet.length; i++) {
    let okCode = consts.alphabet[i].charCodeAt(0);
    if (code == okCode || code == changeCase(okCode)) {
      val = i;
      break;
    }
  }
  return val;
}

/* Return the character that represents a given value according to the current alphabet or undefined if no such character exists.
**
*/
function valToChar(val) {
  return consts.alphabet[val];
}

/* Convert to scientific notation a base 10 integer in string representation.
**
** @param {string} str - The integer to be converted.
** @param {number} minExp - If the exponent is smaller than this value, the integer will be returned in fixed-point notation.
** @param {number} precision - Maximum significant digits included in the converted value.
** @return {string} The converted integer. Undefined if error.
*/
function toSci(str, minExp = 0, precision = +Infinity) {
  if (!isNumStr(str, 10)) throw new Error('in toSci, string must be an integer in base 10.');
  if (precision <= 0) throw new Error('in toSci, precision must be greater than zero.');
  const minus = String.fromCharCode(consts.minus);
  const point = String.fromCharCode(consts.point);

  str = roundInt(str, precision);

  // If the number is negative, ignore the negative sign for now.
  let start = (str[0] == minus) ? 1 : 0;

  // Determine the exponent.
  let exp = str.length - start - 1;

  // If the exponent is less than minExp, return the value in fixed point notation.
  if (exp < minExp) return str;
  
  // Get the integer and fractional parts of the coefficient.
  let integerPart = str[start];
  let fractionalPart = removeTrailingZeros(str.slice(start + 1));

  // Express the value in scientific notation.
  let sci = integerPart;
  if (fractionalPart) sci += point + fractionalPart;
  sci += 'e+' + exp.toString();

  // If the value was negative, replace the negative sign.
  if (str[0] == minus) sci = minus + sci;

  return sci;
}

/* Round a base 10 integer string to a given number of significant digits.
**
** @param {string} str - The integer to be rounded.
** @param {number} precision - The desired number of significant digits.
** @return {string} The rounded integer.
*/
function roundInt(str, precision = +Infinity) {
  if (!isNumStr(str, 10)) throw new Error('in roundInt, string must be an integer in base 10.');
  if (precision <= 0) throw new Error('in roundInt, precision must be greater than 0.');
  const minus = String.fromCharCode(consts.minus);
  
  str = rectify(str);

  // If the number is negative, ignore the negative sign for now.
  let start = (str[0] == minus) ? 1 : 0;

  // If the length of the number is less than or equal to precision, return the number.
  if (str.length - start <= precision) return str;

  // Get the significant part, the digit following, and the remaining digits.
  let sigPart = str.slice(start, precision + start);
  let nextDigit = charToVal(str[precision + start]);
  let remainder = str.slice(precision + start + 1);

  // Decide whether to increment the significant part; round half to even.
  let increment = false;
  if (nextDigit > 5) increment = true;
  else if (nextDigit == 5) {
    if (!isEntirely(remainder, consts.alphabet[0])) increment = true;  // inc if remainder is nonzero
    else {
      let lSigDigit = charToVal(sigPart[precision - 1]); // otherwise inc if it will give you an even number.
      if (lSigDigit % 2) increment = true;
    }
  }
  if (increment) sigPart = incInt(sigPart);

  // The rounded value is the significant part padded with zeros.
  let roundedLength = sigPart.length + 1 + remainder.length;
  let rounded = sigPart.padEnd(roundedLength, consts.alphabet[0]);

  // If the value was negative, replace the negative sign.
  rounded = (str[0] == minus) ? minus + rounded : rounded;

  return rounded;
}

/* Check if a string is entirely composed of the given character. True if empty string.
** Seems to execute faster than constructing a regexp.
**
*/
function isEntirely(str, char) {
  let charCode = char.charCodeAt();
  for (let i = 0; i < str.length; i++) {
    let strCode = str[i].charCodeAt();
    if (strCode != charCode && (consts.caseSensitive || strCode != changeCase(charCode))) return false;
  }
  return true;
}


module.exports = {
  consts:                   consts,
  isNumStr:                 isNumStr,
  bufferFromHexStr:         bufferFromHexStr,
  no0x:                     no0x,
  with0x:                   with0x,
  toSci:                    toSci,
  roundInt:                 roundInt,
  rectify:                  rectify,
  removeLeadingZeros:       removeLeadingZeros,
  removeTrailingZeros:      removeTrailingZeros,
  incInt:                   incInt,
  decInt:                   decInt,
  incChar:                  incChar,
  decChar:                  decChar,
  charToVal:                charToVal,
  valToChar:                valToChar
}


