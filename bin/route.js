/**********************************
*
* [Syntax]
* route enable $PATH
*
* [Example]
* route enable /tx/:tx
*
* [Syntax]
* route add $ADDRESS $PATH $ENDPOINT
*
* [Example]
* route add 19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut /:tx https://bico.media/${tx}
*
**********************************/
const post = require('../lib/post')
const get = require('../lib/get')
const endpoint = "https://babel.bitdb.network/q/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/"
const apikey = "1KJPjd3p8khnWZTkjhDYnywLB2yE1w5BmU"
const axios = require('axios')
module.exports = function(args, done) {
  /**
  *
  * Two modes: (add|enable)
  * 
  * Mode 0: ls
  *
  *  args: {
  *    action: "ls",
  *    address: <~Bitcom Address>|empty
  *  }
  * 
  * Mode 1: enable
  *
  * args: {
  *  arg0: "enable",
  *  arg1: [The route path to enable for the current Bitcom user],
  * }
  *
  * Mode 2: add
  *
  * args: {
  *  arg0: "add",
  *  arg1: [The Bitcom address to attach to],
  *  arg2: [The Bitcom route to attach to. Must have been enabled by the admin],
  *  arg3: [The service endpoint to register]
  * }
  *
  */

  if (args.arg0 === 'ls') {
    let query = {
      v: 3,
      q: {
        find: {
          "out.s1": "$",
          "out.s2": "route",
          "out.s3": "enable"
        }
      }
    }
    if (args.arg1) {
      let address = args.arg1;
      if (/^~[A-Za-z0-1]+/.test(address)) {
        query.q.find["in.e.a"] = address.slice(1)
      } else {
        done({
          message: "The [address] should be prefixed with '~'"
        })
        return;
      }
    } else {
      if (process.env.address) {
        query.q.find["in.e.a"] = process.env.address
      }
    }
    get(query, function(r) {
      let res = [].concat(r.u).concat(r.c)
      if (res.length > 0) {
        let result = res.map(function(item) {
          return item.out[0].s4
        }).join("\n")
        done(null, result)
      } else {
        done({
          message: "No such route exists"
        })
      }
    })
  } else if (args.arg0 === 'enable') {
    post(["$", "route", "enable", args.arg1], function(err, tx) {
      done(err, tx)
    })
  } else if (args.arg0 === 'add') {
    if (process.env.address === args.arg1) {
      done({
        message: "it is not recommended for admins to add routes, adding routes are for service providers. If you want to act as a service provider, create a separate account (create a new folder and run 'bit init') and run 'route add' again."
      })
    } else {
      // check that the route is enabled
      let address = args.arg1
      let routePath = args.arg2
      let routeEndpoint = args.arg3
      let query = {
        "v": 3,
        "q": {
          "db": ["c"],
          "find": {
            "in.e.a": address,
            "out.s1": "$",
            "out.s2": "route",
            "out.s3": "enable",
            "out.s4": routePath
          },
          "project": {
            "out.s1": 1, "out.s2": 1, "out.s3": 1, "out.s4": 1, "out.s5": 1
          }
        }
      };
      let s = JSON.stringify(query);
      let b64 = Buffer.from(s).toString('base64');
      let url = endpoint + b64;
      let header = { headers: { key: apikey } };
      axios.get(url, header).then(function(r) {
        console.log("response = ", r.data)
        if (r.data.c && r.data.c.length > 0) {
          console.log("route exists:", address, routePath)
          post(["$", "route", "add", address, routePath, routeEndpoint], function(err, tx) {
            done(err, tx)
          })
        } else {
          done({
            message: "route doesn't exist " + address + " " + routePath
          })
        }
      })
    }
  } else if (args.arg0 === 'delete') {
    if (args.arg1 && args.arg2) {
      if (process.env.address === args.arg1) {
        done({
          message: "it is not recommended for admins to add routes, adding routes are for service providers. If you want to act as a service provider, create a separate account (create a new folder and run 'bit init') and run 'route add' again."
        })
      } else {
        post(["$", "route", "delete", args.arg1, args.arg2], function(err, tx) {
          done(err, tx)
        })
      }
    } else {
      done({
        message: "Syntax: '$ route delete [address] [path]'"
      })
    }
  }
}
