var LinkEntry,
    _ = require('underscore'),
    check = require('validator').check,
    vote = require('../util/vote');

var entries = [
  {
    id: 1,
    title: "An awesome link",
    linkurl: "http://www.google.com",
    user: '',
    date: new Date(),
    comments: [],
    votes: [],
    votevalue: 0
  },
  {
    id: 2,
    title: "Another awesome link",
    linkurl: "http://www.swisscom.com",
    user: '',
    date: new Date(),
    comments: [],
    votes: [],
    votevalue: 0
  }
];

module.exports = {
  addLinkEntry: function (title, linkurl, user, date, callback) {

    delete user.password;
    delete user.passwordrepeat;

    var entry = {
      id: _.max(entries,function (entry) {
        return entry.id;
      }).id + 1,
      title: title,
      linkurl: linkurl,
      user: user,
      date: date,
      comments: [],
      votes: [],
      votevalue: 0
    };
    entries.push(entry);
    callback(null, entry);
  },

  findAll: function () {
    return _.map(entries, function (entry) {
      return _.clone(entry);
    });
  },

  findById: function (id) {
    return _.clone(_.find(entries, function (entry) {
      return entry.id === id
    }));
  },

  addComment: function(id, comment) {
    var entry = _.find(entries, function (entry) {
      return entry.id === id
    });
    return entry.comments.push(comment);
  },

  vote: function (id, value, user, callback) {
    var linkentry = _.find(entries, function (linkentry) {
      return linkentry.id === id
    });
    vote.vote(linkentry, value, user, callback);
  },

  validate: function (entry) {
    check(entry.linkentrytitle, 'Title must be 1-100 characters long').len(1, 100);
    check(entry.linkentryurl, 'URL must be 1-255 characters long').len(1, 255);
    check(entry.linkentryurl, 'URL not valid').isUrl();
  },

  serializeEntry: function (entry, done) {
    done(null, entry.id);
  },

  deserializeEntry: function (id, done) {
    var entry = module.exports.findById(id);

    if (entry) {
      done(null, entry);
    }
    else {
      done(null, false);
    }
  }
};
