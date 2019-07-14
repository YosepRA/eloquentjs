const express = require('express'),
  app = express();

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/:fileName', (req, res) => {
  console.log(req.params.fileName);
  res.render(req.params.fileName);
});

app.listen(3000, () => {
  console.log('Server has started!');
});
