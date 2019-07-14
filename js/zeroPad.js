function zeroPad(strNum, length) {
  for (let count = 0; strNum.length < length; count++) {
    strNum = '0' + strNum;
  }
  return strNum;
}

function createArrNum(start, end) {
  let arrNum = [];
  for (let count = start; count <= end; count++) {
    arrNum.push(count);
  }
  return arrNum;
}

/* let zeroPadded = [];
let arrNum = createArrNum(1, 50);
for (const number of arrNum) {
  zeroPadded.push(zeroPad(String(number), 3));
}
console.log(zeroPadded); */

console.log(String(6).padStart(3, '0'));
