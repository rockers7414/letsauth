'use strict';

const router = require('express').Router();

router.get('/oauth/authorize', (req, res) => {
  const data = {
    response_type: req.query.response_type,
    client_id: req.query.client_id,
    redirect_uri: req.query.redirect_uri,
    state: req.query.state,
    scope: req.query.email
  };


  const isLoggedIn = req.session.isLoggedIn || false;

  if (isLoggedIn) {
    res.render('authorize', data);
  } else {
    res.render('login', data);
  }
});

module.exports = router;
