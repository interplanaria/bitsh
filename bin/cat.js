/**********************************
*
* cat bit://[..]/[...] to filename
*
**********************************/
const post = require('../lib/post')
const get = require('../lib/get')
module.exports = function(args, done) {
  /**
  *
  * args: {
  *  bitfile: [bit:// addressed file URI],
  *  to: (to|>),
  *  localfile: [local file name]
  * }
  *
  */
  if (args.to && (args.to === '>' || args.to === 'to') && args.localfile) {
    post(["$", "cat", args.bitfile, args.to, args.localfile], function(err, tx) {
      done(err, tx)
    })
  } else {
    done({
      message: "the <to> token must be either '>' or 'to'"
    })
  }
}
