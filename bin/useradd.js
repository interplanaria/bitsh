const post = require('../lib/post')
module.exports = function(args, done) {
  post(["$", "useradd", process.env.address], function(err, tx) {
    done(err, tx)
  })
}
