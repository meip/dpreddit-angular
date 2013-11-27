var LinkEntry,
    _ = require('underscore'),
    check = require('validator').check;

var entries = [
  {
    id: 1,
    title: "An awesome link",
    linkurl: "http://www.google.com",
    user: '',
    date: new Date()
  },
  {
    id: 2,
    title: "Another awesome link",
    linkurl: "http://www.swisscom.com",
    user: '',
    date: new Date()
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
      date: date
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
