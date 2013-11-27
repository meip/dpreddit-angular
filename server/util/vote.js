var _ = require('underscore');

module.exports = {
  vote: function (obj, value, user, callback) {
    if (obj && value === 1 || value === -1) {
      obj.votes = _.filter(obj.votes, function(vote) {
        return vote.userid !== user.id
      });
      obj.votes.push({
        userid: user.id,
        value: value
      });
      obj.votevalue = _.reduce(obj.votes, function (a, b) { return a + b.value; }, 0);
      callback(null, obj);
    }
  }
}
