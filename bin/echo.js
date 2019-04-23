/**********************************
*
* echo B to name
*
**********************************/
const post = require('../lib/post')
module.exports = function(args, done) {
  /**
  *
  * args: {
  *  text: [any string],
  *  to: (to|>),
  *  localfile: [local file name]
  * }
  *
  */
  if (args.to === '>' || args.to === 'to') {
    post(["$", "echo", args.text, args.to, args.localfile], function(err, tx) {
      done(err, tx)
    })
  } else {
    done({
      message: "\n  ## Error: the <to> token must be either '>' or 'to'"
    })
  }
}
