// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const PORT = 8300;
const dir = process.argv[2] || 'config';

const app = express();

app.use(bodyParser.text());
app.use(express.static('dist'));
app.get('/', (_, res) => res.redirect('/index.html'));

app.use('/_load', express.static(dir));
app.post('/_save/:file', (req, res) => {
  fs.writeFileSync(path.join(dir, req.params.file), req.body);
  res.send();
});

app.listen(PORT);

console.log(`Go to http://IP_ADDRESS:${PORT} in your browser to edit.`);
console.log('Press Ctrl-C to exit');
