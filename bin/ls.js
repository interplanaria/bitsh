const get = require('../lib/get')
module.exports = function(args, done) {
  let query = {
    v: 3,
    q: {
      find: {
        "in.e.a": process.env.address,
        "out.s1": "$",
        "out.s2": {
          "$in": ["echo", "cat"]
        }
      }
    }
  }
  if (args.address && /^~[A-Za-z0-1]+/.test(args.address)) {
    query.q.find["in.e.a"] = args.address.slice(1)
  }
  get(query, function(r) {
    let res = [].concat(r.u).concat(r.c)
    if (res.length > 0) {
      let files = new Set();
      res.forEach(function(item) {
        let out = item.out.filter(function(o) {
          return o
        })[0]
        if (out.s5) {
          files.add(out.s5)
        }
      })
      let lines = Array.from(files).join("\n")
      let more = "\n< view on bterm: https://bterm.network/#address=" + process.env.address + " >";
      done(null, lines+more)
    } else {
      done(null, "") 
    }
  })
}
