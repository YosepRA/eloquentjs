let canvas = document.querySelector('canvas');
let cx = canvas.getContext('2d');

// SHAPES

// // 1. Trapezoid
// // (x, y) → 20, 10
// function trapezoid(x, y) {
//   cx.beginPath();
//   cx.moveTo(x, y);
//   cx.lineTo(x - 20, y + 40);
//   cx.lineTo(x + 80, y + 40);
//   cx.lineTo(x + 60, y);
//   cx.closePath();
//   cx.stroke();
// }
// trapezoid(20, 10);

// // 2. Red Diamond
// function redDiamond(x, y) {
//   cx.translate(x, y);
//   cx.rotate(0.25 * Math.PI);
//   cx.fillStyle = 'red';
//   cx.fillRect(0, 0, 50, 50);
// }
// redDiamond(150, 0);

// // 3. Zigzag Line
// function zigzag(x, y, amount, xSize, ySize) {
//   let pos = 'left';
//   cx.beginPath();
//   for (let num = 0; num < amount; num++) {
//     cx.moveTo(x, y);
//     y += ySize;
//     if (pos === 'left') {
//       x += xSize;
//       pos = 'right';
//     } else if (pos === 'right') {
//       x -= xSize;
//       pos = 'left';
//     }
//     cx.lineTo(x, y);
//   }
//   cx.stroke();
// }
// zigzag(150, 20, 10, 150, 20);

// // 3. Spiral
// function spiral(centerX, centerY) {
//   let from = 0, to = 0.2;
//   let r = 3;
//   for (let num = 0; num < 100; num++) {
//     cx.arc(centerX, centerY, r, from, to);
//     from = to;
//     r += 0.5;
//     to += 0.2;
//   }
//   cx.stroke();
// }
// spiral(200, 100);

// // 4. Yellow Star
// // → center, outerRadius, innerRadius, points

// function star(centerX, centerY, outerRad, innerRad, points, color = 'black') {
//   let angle = 0;
//   let range = (1 / points) * 2 * Math.PI;
//   let midRange = (1 / (points * 2)) * 2 * Math.PI;
//   cx.moveTo(Math.cos(angle) * outerRad + centerX, Math.sin(angle) * outerRad + centerY);

//   for (let n = 0; n < points; n++) {
//     angle += range;
//     let toX = Math.cos(angle) * outerRad + centerX;
//     let toY = Math.sin(angle) * outerRad + centerY;

//     let mid = angle - midRange;
//     let midX = Math.cos(mid) * innerRad + centerX;
//     let midY = Math.sin(mid) * innerRad + centerY;

//     cx.quadraticCurveTo(midX, midY, toX, toY);
//   }
//   cx.fillStyle = color;
//   cx.fill();
// }

// star(100, 100, 50, 100, 8);

/* ====================================================================================================== */

// // PIE CHART
// // → Add label to it.

// const results = [
//   { name: 'Satisfied', count: 1043, color: 'lightblue' },
//   { name: 'Neutral', count: 563, color: 'lightgreen' },
//   { name: 'Unsatisfied', count: 510, color: 'pink' },
//   { name: 'No comment', count: 175, color: 'silver' }
// ];

// function pieChart(results, centerX, centerY, outerRad) {
//   let total = results.reduce((sum, { count }) => sum + count, 0);
//   let innerRad = outerRad / 2;
//   let currentAngle = -0.5 * Math.PI;
//   cx.font = '10px Georgia';
//   cx.textAlign = 'center';

//   for (const result of results) {
//     let sliceAngle = (result.count / total) * 2 * Math.PI;
//     cx.fillStyle = result.color;
//     cx.beginPath();
//     cx.moveTo(centerX, centerY);
//     cx.arc(centerX, centerY, outerRad, currentAngle, currentAngle + sliceAngle);
//     cx.closePath();
//     cx.fill();

//     // TEXT
//     cx.save();
//     let midAngle = currentAngle + sliceAngle / 2;
//     let midX = Math.cos(midAngle) * innerRad + centerX;
//     let midY = Math.sin(midAngle) * innerRad + centerY;
//     // If it's in the left hand side of the chart, flip the text. Because by default, it's following ~
//     // ~ the circle's angle and current orientation.
//     if (midAngle > 0.5 * Math.PI && midAngle < (3 / 4) * 2 * Math.PI) {
//       flipHorizontally(cx, midX);
//       flipVertically(cx, midY);
//     }
//     cx.translate(midX, midY);
//     cx.rotate(midAngle);
//     cx.fillStyle = 'black';
//     cx.fillText(result.name, 0, 0);
//     cx.restore();

//     currentAngle += sliceAngle;
//   }
// }

// pieChart(results, 150, 150, 120);

// function flipHorizontally(context, around) {
//   context.scale(-1, 1);
//   context.translate(-(2 * around), 0);
// }
// function flipVertically(context, around) {
//   context.scale(1, -1);
//   context.translate(0, -(2 * around));
// }

/* ====================================================================================================== */

// BOUNCING BALL

// cx.lineWidth = 5;
// cx.strokeRect(0, 0, 200, 400);
// cx.arc(100, 200, 30, 0, 7);
// cx.fillStyle = 'red';
// cx.fill();

// cx.clearRect(0, 0, 600, 500);

// function animate(frameFunc) {
//   let angle = 0;
//   let lastTime = null;
//   function frame(time) {
//     if (lastTime != null) {
//       angle += (time - lastTime) * 0.01;
//     }
//     frameFunc(angle);
//     lastTime = time;
//     requestAnimationFrame(frame);
//   }
//   requestAnimationFrame(frame);
// }

// function ball(angle) {
//   cx.clearRect(0, 0, 600, 500);
//   cx.strokeRect(0, 0, 200, 400);
//   let y = Math.sin(angle) * 170 + 200;
//   cx.beginPath();
//   cx.moveTo(100, y);
//   cx.arc(100, y, 30, 0, 7);
//   cx.fillStyle = 'red';
//   cx.fill();
// }

// animate(ball);

/* ====================================================================================================== */
