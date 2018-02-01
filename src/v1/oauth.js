'use strict';

const router = require('express').Router();
const querystring= require('querystring');

const AccessToken = require('../object/accessToken');
const Response = require('../object/response');
const Error = require('../object/error');

const User = require('../module/user');
const Client = require('../module/client');
const Auth = require('../module/auth');
const Grant = require('../module/grant');

router.post('/login', async (req, res) => {
  try {
    const data = {
      query: req.query,
      qs: querystring.stringify(req.query)
    };
    const user = await User.getUserByEmail(req.body.email);

    if (user && user.password === req.body.password) {
      req.session.email = req.body.email;
      req.session.isLoggedIn = true;
    }

    res.redirect('/oauth/authorize?' + data.qs);
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

router.post('/grant', async (req, res) => {
  try {
    const grantResult = req.body.grant === 'yes';
    if (grantResult) {
      const grant = new Grant(req.session.email,
        req.query.scopes,
        req.query.redirect_uri);
      await grant.save();

      const qs = querystring.stringify({code: grant.code, state: req.query.state});

      res.redirect(302, req.query.redirect_uri + '?' + qs);
    } else {
      // TODO: handle the denied
    }
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

router.post('/access_token', async (req, res) => {
  try {
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
    case 'password': {
      accessToken = await Auth.getAccessTokenByPassword(req.body.email,
        req.body.password,
        req.body.scopes);
      break;
    }

    case 'authorization_code': {
      const grant = await Grant.getGrantByCode(req.body.code);

      if (!grant) {
        // TODO: should handle the code not found.
      }

      if (grant.redirectUri !== req.body.redirect_uri) {
        // TODO: should handle the redirect uri is not the same.
      }

      accessToken = await Auth.getAccessTokenByGrant(grant);
      // TODO: delete grant from the database.
      break;
    }
    }

    res.status(200).send(new AccessToken(accessToken, req.body.scopes));
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

module.exports = router;
