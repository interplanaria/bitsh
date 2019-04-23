#!/usr/bin/env node
const fs = require('fs')
const mkdirp = require('mkdirp');
const term = require( 'terminal-kit' ).terminal;
const cli = require('./cli')
const key = require('./lib/key')
const bip44 = "m/44'/0'/0'/0/"
const homedir = require('os').homedir();
const bitcomPath = homedir + "/.bitcom"
const hdPath = bitcomPath + "/hd"
const wifPath = bitcomPath + "/wif"
const register = function() {
  mkdirp(bitcomPath, async function(err) {
    let keys = await key.generate()
    console.log(`\ngenerated [${bip44}${keys.index}]  ${keys.value.address}`)
    console.log("")
    cli.login("hd", keys.index)
  })
}
const users = async function() {
  console.log("")
  console.log("BITCOM LOGIN:")
  let hdItems = await key.ls("hd")
  let wifItems = await key.ls("wif")
  let items = [].concat(hdItems).concat(wifItems)
  let list = ["[ + new account ]"].concat(items.map(function(item) {
    if (typeof item.index === "undefined") {
      // wif 
      return `[wif] ${item.value}`
    } else {
      // hd
      return `[${bip44}${item.index}] ${item.value}`
    }
  }))
  term.singleColumnMenu(list, function( error , response ) {
    if (response.selectedIndex === 0) {
      register()
    } else {
      let item = items[response.selectedIndex-1];
      console.log("\nLogging in: " + item.value + "\n")
      if (typeof item.index !== "undefined") {
        cli.login("hd", item.index)
      } else {
        cli.login("wif", item.value)
      }
    }
  });
}
const init = function() {
  if (process.argv.length >= 3) {
    // importing
    let wif = process.argv[2];
    key.importer(wif).then(function(keys) {
      console.log("Imported keys = ", keys)
      cli.login("wif", keys.value.address)
    })
  } else {
    users()
  }
}
init()
