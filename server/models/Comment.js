var Comment,
    _ = require('underscore'),
    check = require('validator').check;

var comments = [
  {
    id: 1,
    commentext: "wow how cool is that",
    linkEntryId: 1,
    user: '',
    date: new Date()
  },
  {
    id: 2,
    commentext: "thats really awesome!",
    linkEntryId: 1,
    user: '',
    date: new Date()
  }
];

module.exports = {
  addComment: function (commentext, linkEntryId, user, date, callback) {

    delete user.password;
    delete user.passwordrepeat;

    var comment = {
      id: _.max(comments,function (comment) {
        return comment.id;
      }).id + 1,
      commentext: commentext,
      linkEntryId: linkEntryId,
      user: user,
      date: date
    };
    comments.push(comment);
    callback(null, comment);
  },

  findAll: function () {
    return _.map(comments, function (comment) {
      return _.clone(comment);
    });
  },

  findById: function (id) {
    return _.clone(_.find(comments, function (comment) {
      return comment.id === id
    }));
  },

  validate: function (comment) {
    check(comment.commentext, 'Comment must be not empty').notEmpty();
  },

  serializeEntry: function (comment, done) {
    done(null, comment.id);
  },

  deserializeEntry: function (id, done) {
    var comment = module.exports.findById(id);

    if (comment) {
      done(null, comment);
    }
    else {
      done(null, false);
    }
  }
};
