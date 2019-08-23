/* ======================================================================================================== */

// window.addEventListener('click', () => {
//   console.log('Who?');
// });

/* ======================================================================================================== */

// EVENT OBJECT - 245

// let btn = document.querySelector('button');
// btn.addEventListener('mousedown', event => {
//   if (event.button === 0) console.log('Left Button');
//   else if (event.button === 1) console.log('Middle Button');
//   else if (event.button === 2) console.log('Right Button');
// });

/* ======================================================================================================== */

// EVENT PROPAGATION - 245

// let para = document.querySelector('p');
// let btn = document.querySelector('button');

// para.addEventListener('mousedown', () => console.log('Paragraph Handler'));
// btn.addEventListener('mousedown', e => {
//   console.log('Mouse Handler');
//   if (e.button === 2) e.stopPropagation();
// });

/* ======================================================================================================== */

// DEFAULT ACTION - 247

// let a = document.querySelector('a');
// a.addEventListener('click', e => {
//   console.log('nope');
//   e.preventDefault();
// });

/* ======================================================================================================== */

// KEY EVENTS - 248

// window.addEventListener('keydown', e => {
//   if (e.key === 'v') console.log('v');
// });
// window.addEventListener('keyup', e => {
//   if (e.key === 'v') console.log('v');
// });
// window.addEventListener('keydown', e => {
//   if (e.key === ' ' && e.ctrlKey) {
//     console.log('continuing');
//   }
// });

/* ======================================================================================================== */

// POINTER EVENTS - 249

// window.addEventListener('click', e => {
//   let dot = document.createElement('div');
//   dot.className = 'dot';
//   dot.style.top = e.clientY - 4 + 'px';
//   dot.style.left = e.clientX - 4 + 'px';
//   document.body.appendChild(dot);
// });
// let client = document.querySelectorAll('#client span');
// let screen = document.querySelectorAll('#screen span');
// let page = document.querySelectorAll('#page span');

// window.addEventListener('mousemove', e => {
//   client[0].textContent = e.clientX;
//   client[1].textContent = e.clientY;
//   screen[0].textContent = e.screenX;
//   screen[1].textContent = e.screenY;
//   page[0].textContent = e.pageX;
//   page[1].textContent = e.pageY;
// });

// MOUSE MOTION - 250

// let lastX;
// let bar = document.querySelector('div');
// bar.addEventListener('mousedown', e => {
//   if (e.button === 0) {
//     lastX = e.clientX;
//     window.addEventListener('mousemove', moved);
//     e.preventDefault(); // To prevent selection behavior.
//   }
// });
// function moved(e) {
//   if (e.buttons === 0) {
//     window.removeEventListener('mousemove', moved);
//   } else {
//     let dist = e.clientX - lastX;
//     let newWidth = Math.max(10, bar.offsetWidth + dist);
//     bar.style.width = newWidth + 'px';
//     lastX = e.clientX;
//   }
// }

// TOUCH EVENT

// function update(e) {
//   for (let dot; (dot = document.querySelector('dot')); ) {
//     dot.remove();
//   }
//   for (let i = 0; i < e.touches.length; i++) {
//     // Since touchscreen can receive multiple finger input, the coordinates will be inside its ~
//     // ~ "touches" object. It contains array-like object of points, each of which holds their own ~
//     // ~ coordinates.
//     let { pageX, pageY } = e.touches[i];
//     let dot = document.createElement('dot');
//     dot.style.left = pageX - 50 + 'px';
//     dot.style.top = pageY - 50 + 'px';
//     document.body.appendChild(dot);
//   }
// }
// window.addEventListener('touchstart', update);
// window.addEventListener('touchmove', update);
// window.addEventListener('touchend', update);

// SCROLL EVENT - 253

// document.body.appendChild(document.createTextNode('TheSaurusBoCaurus '.repeat(1000)));
// let bar = document.getElementById('progress');
// window.addEventListener('scroll', () => {
//   // element.scrollHeight →
//   // window.innerHeight → The height of window excluding the height of browser's control panel at the top.
//   // window.pageYOffset → The position of current scroll / the position of the top window prior to document's ~
//   // ~ size.
//   let max = document.body.scrollHeight - innerHeight;
//   bar.style.width = `${(pageYOffset / max) * 100}%`;
// });

// FOCUS EVENT - 254

// let help = document.getElementById('help');
// let fields = document.querySelectorAll('input');
// for (const field of Array.from(fields)) {
//   field.addEventListener('focus', e => {
//     let text = event.target.getAttribute('data-help');
//     help.textContent = text;
//   });
//   field.addEventListener('blur', () => {
//     help.textContent = '';
//   });
// }

// DEBOUNCING - 257
// → Reducing the process load by assigning a timeout to a trivial UI.

// let textarea = document.querySelector('textarea');
// let preview = document.getElementById('preview');
// let timeout;
// textarea.addEventListener('input', () => {
//   clearTimeout(timeout);
//   timeout = setTimeout(() => {
//     preview.textContent = textarea.value;
//   }, 500);
// });

// SCHEDULING
// → Running the handler of a rapid event type at a constant interval to avoid cluttering.

// let scheduled = null;
// window.addEventListener('mousemove', e => {
//   if (!scheduled) {
//     setTimeout(() => {
//       document.body.textContent = `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
//       scheduled = null;
//     }, 500);
//     scheduled = e;
//   }
// });

/* ======================================================================================================== */

// EXERCISE

// BALLOON
// 🎈🎈🎈 💥💥💥
// let bal = document.getElementById('balloon');
// function expand(e) {
//   let current = Number(bal.style.fontSize.match(/\d+/)[0]);
//   console.log(current);
//   if (current < 500) {
//     if (e.key === 'ArrowUp') bal.style.fontSize = `${current + 10}%`;
//     else if (e.key === 'ArrowDown') bal.style.fontSize = `${current - 10}%`;
//   } else {
//     bal.textContent = '💥';
//     window.removeEventListener('keydown', expand);
//   }
// }
// window.addEventListener('keydown', expand);

// MOUSE TRAIL

// window.addEventListener('mousemove', e => {
//   let dot = document.createElement('div');
//   dot.className = 'dot';
//   dot.style.left = e.clientX + 'px';
//   dot.style.top = e.clientY + 'px';
//   document.body.appendChild(dot);
// });

// let dots = document.getElementById('dots');
// window.addEventListener('mousemove', e => {
//   dots.style.top = e.clientY - 4 + 'px';
//   dots.style.left = e.clientX - 4 + 'px';
// });

// Mouse Trail - Book
// let dots = [];
// for (let i = 0; i < 12; i++) {
//   let node = document.createElement('div');
//   node.className = 'trail';
//   document.body.appendChild(node);
//   dots.push(node);
// }
// let currentDot = 0;

// window.addEventListener('mousemove', event => {
//   let dot = dots[currentDot];
//   dot.style.left = event.pageX - 3 + 'px';
//   dot.style.top = event.pageY - 3 + 'px';
//   // Below is a new method to do a state update.
//   // In a remainder operation, if the left side operand is less than the right one, then the result will ~
//   // ~ remain as it is.
//   // Example:
//   // 0 % 12 = 0
//   // 4 % 12 = 4
//   // 12 % 12 = 0 → And here, the iteration will be reset.
//   currentDot = (currentDot + 1) % dots.length;
// });

// TABBED PANELS

// let tab = document.querySelector('.tab');
// let contents = tab.querySelectorAll('.content');
// let last = contents[0];

// tab.addEventListener('click', e => {
//   if (e.target.tagName === 'BUTTON') {
//     last.style.display = 'none';
//     let ref = tab.querySelector(e.target.getAttribute('data-ref'));
//     ref.style.display = 'block';
//     last = ref;
//   }
// });

// Tab Panel - Book

// function asTabs(node) {
//   let tabs = Array.from(node.children).map(node => {
//     let btn = document.createElement('button');
//     btn.textContent = node.getAttribute('data-tabname');
//     let tab = { node, btn };
//     btn.addEventListener('click', () => selectTab(tab));
//     return tab;
//   });

//   let tabList = document.createElement('div');
//   for (const { btn } of tabs) tabList.appendChild(btn);
//   node.insertBefore(tabList, node.firstChild);

//   function selectTab(selectedTab) {
//     for (const tab of tabs) {
//       let selected = tab == selectedTab;
//       tab.node.style.display = selected ? '' : 'none';
//       tab.btn.style.color = selected ? 'red' : '';
//     }
//   }
//   selectTab(tabs[0]);
// }

// asTabs(document.querySelector('tab-panel'));
