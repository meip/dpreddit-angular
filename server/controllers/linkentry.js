var _ = require('underscore'),
    LinkEntry = require('../models/LinkEntry.js');

module.exports = {
  index: function (req, res) {
    var linkentries =  _.sortBy(LinkEntry.findAll(), function(entry) {
      return entry.votevalue
    }).reverse();
    res.json(linkentries);
  },

  findbyid: function(req, res) {
    var linkentry = LinkEntry.findById(parseInt(req.params.linkentryid));
    linkentry.comments =  _.sortBy(linkentry.comments , function(comment) {
      return comment.votevalue
    }).reverse();
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
  },

  vote: function(req, res, next) {
    LinkEntry.vote(parseInt(req.params.linkentryid), parseInt(req.params.value), req.user, function (err, linkentry) {
      if (err) return res.send(500);

      res.json(200, { "votesuccess": true });
    });
  }
};
