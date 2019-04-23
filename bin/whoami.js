const qrcode = require('qrcode-terminal');
const datapay = require('datapay')
module.exports = function(args, done) {
  if (process.env.address) {
    let message = `
#################################################################################
##
## Welcome to Bitcom, a Bitcoin Unix Computer
##
## Here is your Bitcoin Address
## [Look inside .bitcom/.seed file for Seed HD Keypair]
##
## Address: ${process.env.address}
## BTerm Dashboard: https://bterm.network/#address=${process.env.address}
##
#################################################################################\n\n`;
    qrcode.generate("bitcoin:"+process.env.address, function(code) {
      message += code;
      datapay.connect('https://bchsvexplorer.com').address(process.env.address, function(err, info) {
        if (err) {
          done(err, null)
        } else {
          balance = info.balance
          message += ("\n\nbalance: " + info.balance + "\n")
          message += ("\nOption 1. Charge the address with QR code, with small amount of Bitcoin SV to get started.\n")
          let payload = {
            "to": process.env.address,
            "editable": true,
            "currency": "USD",
            "type": "tip"
          }
          let str = JSON.stringify(payload);
          let b64 = Buffer.from(str).toString("base64");
          let url = "https://button.bitdb.network/#" + b64;
          message += ("Option 2. Charge with Moneybutton:\n" + url + "\n");
          done(null, message)
        }
      });
    })
  } else {
    done("You haven't generated a keypair. Look inside the .bit file, or generate a new one with 'bit init'", null)
  }
}
