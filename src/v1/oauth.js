'use strict';

const router = require('express').Router();

const AccessToken = require('../object/accessToken');
const Response = require('../object/response');
const Error = require('../object/error');

const Auth = require('../module/auth');
// const User = require('../module/user');
const Client = require('../module/client');

router.post('/access_token', async (req, res) => {
  try {
    if (!req.session.views) {
      req.session.views = {};
    }

    const token = req.get('authorization');

    if (!token) {
      return res.status(401).send(new Response.Error(new Error.AuthenticationFailed()));
    }

    const credentials = new Buffer(token.split(' ').pop(), 'base64')
      .toString('ascii').split(':');

    const client = await Client.getClientById(credentials[0]);
    if (!client || client.secret != credentials[1]) {
      // TODO: should well handle the oauth error.
      return res.status(401).send(new Response.Error(new Error.AuthenticationFailed()));
    }

    let accessToken;
    const grant_type = req.body.grant_type || '';
    switch (grant_type) {
    case 'password':
      accessToken = await Auth.getAccessTokenByPassword(req.body.email,
        req.body.password,
        req.body.scopes);
      break;
    }

    res.status(200).send(new AccessToken(accessToken, req.body.scopes));
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

module.exports = router;
