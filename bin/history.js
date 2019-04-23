const get = require('../lib/get')
module.exports = function(args, done) {
  let query = {
    v: 3,
    q: {
      find: {
        "in.e.a": process.env.address,
        "out.s1": "$"
      },
      sort: { "blk.i": 1 }
    }
  }
  if (args.address && /^~[A-Za-z0-1]+/.test(args.address)) {
    query.q.find["in.e.a"] = args.address.slice(1)
  }
  get(query, function(r) {
    let res = [].concat(r.c).concat(r.u)
    if (res.length > 0) {
      let result = res.map(function(item) {
        let out = item.out.filter(function(o) {
          return o
        })[0]
        let keys = Object.keys(out).filter(function(k) {
          return /^s[1-9]+/.test(k)
        })
        let line = keys.map(function(k) {
          return out[k]
        }).join(" ")
        return line;
      }).join("\n")
      done(null, result)
    } else {
      done(null, "") 
    }
  })
}
