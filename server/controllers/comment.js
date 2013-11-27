var _ = require('underscore'),
    Comment = require('../models/Comment.js'),
    LinkEntry = require('../models/LinkEntry.js');

module.exports = {
  index: function (req, res) {
    var comments = Comments.findAll();
    res.json(comments);
  },

  add: function (req, res, next) {
    try {
      Comment.validate(req.body);
    }
    catch (err) {
      return res.send(400, err.message);
    }

    var linkentryId = parseInt(req.body.linkEntryId);
    Comment.addComment(req.body.commentext, linkentryId, req.user, new Date(), function (err, comment) {
      if (err) return res.send(500);

      LinkEntry.addComment(linkentryId, comment);
      res.json(200, { "newcommentsuccess": true });
    });
  },

  vote: function(req, res, next) {
    Comment.vote(parseInt(req.params.commentid), parseInt(req.params.value), req.user, function (err, comment) {
      if (err) return res.send(500);

      res.json(200, { "votesuccess": true });
    });
  }
};
