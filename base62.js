const ALPHABET = "GAPGPTMASKTOKEN7xd131o2d54X0X";
const BASE = ALPHABET.length;

function encode(num) {
  let str = "";
  while (num > 0) {
    str = ALPHABET[num % BASE] + str;
    num = Math.floor(num / BASE);
  }
  return str;
}

function decode(str) {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    num = num * BASE + ALPHABET.indexOf(str[i]);
  }
  return num;
}

module.exports.encode = encode;
module.exports.decode = decode;

