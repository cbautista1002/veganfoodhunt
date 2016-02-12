'use strict';

const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

app.use(express.static(__dirname + '/app'));

app.get('/', function (req, res) {
  // res.send('Hello world\n');
  res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
