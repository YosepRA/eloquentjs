let button = document.querySelector('button');
button.addEventListener('click', () => {
  let bodyBG = document.body.style.backgroundColor;
  document.body.style.backgroundColor = bodyBG ? '' : 'aqua';
});
