'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const bodyParser = require('body-parser');

const Response = require('./object/response');
const Error = require('./object/error');
const AuthUtil = require('./module/auth');

const oauth = require('./v1/oauth');
const clients = require('./v1/clients');
const users = require('./v1/users');
const view = require('./view');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1eT50th',
  resave: false,
  saveUninitialized: true
}));

function checkAccessToken(req, res, next) {
  if (!/^\/api\/v1\/oauth\/?.*/.test(req.path) && !/^\/oauth\/?.*/.test(req.path)) {
    const accessToken = req.get('authorization');

    if (!accessToken) {
      return res.status(401).send(new Response.Error(new Error.NoAccessToken()));
    }

    try {
      const result = AuthUtil.authenticate(accessToken.split(' ').pop());
      if (result) {
        req.tag = result;
      }
    } catch (err) {
      return res.status(401).send(new Response.Error(new Error.InvalidToken()));
    }
  }

  next();
}
app.use(checkAccessToken);

// static file
app.set('view engine', 'jade');
app.use('/', view);

// api
app.use('/api/v1/oauth', oauth);
app.use('/api/v1/clients', clients);
app.use('/api/v1/users', users);

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));

module.exports = server;
