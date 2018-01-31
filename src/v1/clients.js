'use strict';

const router = require('express').Router();

const Response = require('../object/response');
const Error = require('../object/error');

const Client = require('../module/client');
const Util = require('../lib/util');

router.get('/', async (req, res) => {
  try {
    if (!req.tag.scopes.includes('read:clients')) {
      return res.status(403).send(new Response.Error(new Error.PermissionDenied()));
    }

    const index = req.query.index ? parseInt(req.query.index) : 0;
    const offset = req.query.offset ? parseInt(req.query.offset) : 10;
    const clients = await Client.getClients(index, offset);

    res.status(200).send(new Response.Collection(clients));
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

router.put('/', async (req, res) => {
  try {
    if (!req.tag.scopes.includes('create:clients')) {
      return res.status(403).send(new Response.Error(new Error.PermissionDenied()));
    }

    let client = await Client.getClientByName(req.body.name);

    if (!client) {
      client = new Client(req.body.name, Util.randomHexString(32), req.body.redirectUrl);
    }

    await client.save();
    res.status(200).send(new Response.Data(client));
  } catch (err) {
    res.status(500).send(new Response.Error(new Error.UnknownError()));
  }
});

module.exports = router;
