// CREATE A TABLE

// let data = {
//   name: ['Kilimanjaro', 'Semeru'],
//   height: ['5986', '4752'],
//   place: ['Tanzania', 'Malang']
// };
// function createRow(type, tableData) {
//   let row = document.createElement('tr');
//   if (type === 'body') {
//     for (const data of tableData) {
//       let td = document.createElement('td');
//       td.textContent = data;
//       row.appendChild(td);
//     }
//   } else if (type === 'head') {
//     for (const data of tableData) {
//       let th = document.createElement('th');
//       th.textContent = data;
//       row.appendChild(th);
//     }
//   }
//   return row;
// }
// function createTable(tableData) {
//   let table = document.createElement('table');
//   let keys = Object.keys(tableData);
//   let body = [createRow('head', keys)];
//   // Build up an array containing data from respective index position.
//   for (let i = 0; i < tableData[keys[0]].length; i++) {
//     let data = [];
//     for (let j = 0; j < keys.length; j++) {
//       data.push(tableData[keys[j]][i]);
//     }
//     body.push(createRow('body', data));
//   }
//   for (const row of body) {
//     table.appendChild(row);
//   }
//   return table;
// }

// document.body.appendChild(createTable(data));

/* ======================================================================================= */

// getElementsByTagName
// function elByTagName(node, tag) {
//   let results = [];
//   tag = tag.toUpperCase();
//   function findEl(node) {
//     for (let i = 0; i < node.children.length; i++) {
//       let el = node.children[i];
//       if (el.nodeName === tag) {
//         results.push(el);
//       }
//       findEl(el);
//     }
//   }
//   findEl(node);
//   return results;
// }
// // console.log(elByTagName(document.body, 'p'));
// console.log(elByTagName(document.body, 'h1').length);
// // → 1
// console.log(elByTagName(document.body, 'span').length);
// // → 3
// let para = document.querySelector('p');
// console.log(elByTagName(para, 'span').length);
// // → 2

/* ======================================================================================= */

// ANIMATION IMPROVISATION

let img = document.querySelectorAll('img');
let one = img[0],
  two = img[1];

let angle = Math.PI / 2;

function animateOne(time, lastTime) {
  if (lastTime != null) {
    angle += (time - lastTime) * 0.001;
  }
  one.style.top = Math.sin(angle) * 200 + 'px';
  one.style.left = Math.cos(angle) * 200 + 'px';
  requestAnimationFrame(newTime => animateOne(newTime, time));
}
function animateTwo(time, lastTime) {
  two.style.top = -(Math.sin(angle) * 200) + 'px';
  two.style.left = -(Math.cos(angle) * 200) + 'px';
  requestAnimationFrame(newTime => animateTwo(newTime, time));
}

requestAnimationFrame(animateOne);
requestAnimationFrame(animateTwo);
