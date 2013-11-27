var _ = require('underscore'),
    LinkEntry = require('../models/LinkEntry.js');

module.exports = {
  index: function (req, res) {
    var linkentries = LinkEntry.findAll();
    res.json(linkentries);
  },

  findbyid: function(req, res) {
    var linkentry = LinkEntry.findById(parseInt(req.params.linkentryid));
    res.json(linkentry);
  },

  add: function (req, res, next) {
    try {
      LinkEntry.validate(req.body);
    }
    catch (err) {
      return res.send(400, err.message);
    }

    LinkEntry.addLinkEntry(req.body.linkentrytitle, req.body.linkentryurl, req.user, new Date(), function (err) {
      if (err) return res.send(500);

      res.json(200, { "newlinksuccess": true });
    });
  }
};
