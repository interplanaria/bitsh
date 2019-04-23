#!/usr/bin/env node
var v = require('vorpal')()
const path = require('path')
const fs = require('fs')
const get = require('./lib/get')
const homedir = require('os').homedir();
const bitcomPath = homedir + "/.bitcom"
const programs = {}

// Router Definition
const router = function(args, callback) {
  let cmd = this.commandObject._name;
  let self = this;
  programs[cmd](args, function(err, result) {
    if (err) {
      self.log("\n  ## Error: " + err.message);
      v.exec("help " + cmd)
    } else {
      self.log(result)
    }
    callback();
  })
}

// Route Commands to Programs
const init = function(type, user_index) {
  require('dotenv').config({path: bitcomPath + "/" + type + "/" + user_index + "/.bit"})
  v.command('useradd', 'creates a new account').action(router)
  v.command('whoami', 'displays the current user').action(router)
  v.command('route <arg0> [arg1] [arg2] [arg3]', 'route related actions').action(router)
  v.command('cat <bitfile> <to> <localfile>', 'Writes <bitfile> content to <localfile>').action(router)
  v.command('echo <text> <to> <localfile>', 'Writes <text> to <localfile>').action(router)
  v.command('ls [address]', 'list files').action(router)
  v.command('history [address]', 'display history').action(router)

  // Load Programs
  fs.readdir(__dirname + "/bin", async function(err, items) {
    for (let i=0; i<items.length; i++) {
      let name = items[i].split('.')[0];
      programs[name] = require(__dirname + "/bin/" + items[i])
    }
    programs.whoami(null, function(err, message) {
      console.log(message)

      // Liftoff
      get({
        v: 3,
        q: {
          find: {
            "in.e.a": process.env.address,
            "out.s1": "$",
            "out.s2": "echo",
            "out.s4": {
              "$in": [">", "to"]
            },
            "out.s5": "name"
          }
        }
      }, function(r) {
        let items = [].concat(r.u).concat(r.c)
        if (items.length > 0) {
          let origin = items[0].out[0].s3;
          v.delimiter(origin + "@bitcom$").show();
        } else {
          let origin = process.env.address
          let shortened = origin.slice(0,7) + "..."
          v.delimiter(shortened + '@bitcom$').show();
        }
      })
    })
  });
}
module.exports = {
  login: init
}
