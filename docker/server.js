// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const PORT = 8300;
const app = express();
const args = require('minimist')(process.argv.slice(2), {
  default: {
    hostPort: PORT,
    dir: 'config',
  },
});


app.use(bodyParser.text());
app.use(express.static('dist'));
app.get('/', (_, res) => res.redirect('/index.html'));

app.get('/_ping', (req, res) => { res.send(); });
app.use('/_load', express.static(args.dir));
app.post('/_save/:file', (req, res) => {
  fs.writeFileSync(path.join(args.dir, req.params.file), req.body);
  res.send();
});

app.listen(PORT);

console.log(`View the editor on port ${args.hostPort}`);
console.log('Press Ctrl-C to stop the editor');
