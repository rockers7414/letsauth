'use strict';

const router = require('express').Router();
const querystring = require('querystring');
const Client = require('./module/client');

router.get('/oauth/authorize', async (req, res) => {
  const client = await Client.getClientById(req.query.client_id);

  if (!client) {
    // TODO: handle the client is not found
  }

  if (client.redirect_uri !== req.query.redirect_uri) {
    // TODO: handle the redirect uri is not the same
  }

  const isLoggedIn = req.session.isLoggedIn || false;
  const data = {
    query: req.query,
    qs: querystring.stringify(req.query)
  };

  if (isLoggedIn) {
    res.render('authorize', data);
  } else {
    res.render('login', data);
  }
});

module.exports = router;
