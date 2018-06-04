

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




module.exports.isNumStr = isNumStr;
module.exports.consts = consts;