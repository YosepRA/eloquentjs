const express = require('express'),
  app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/17/game', (req, res) => {
  res.render('platformGame.html');
});

app.listen(3000, () => {
  console.log('Server has started!');
});
