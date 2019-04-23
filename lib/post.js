const datapay = require('datapay')
module.exports = function(pushdata, cb) {
  if (process.env.address && process.env.address) {
    let payload = {
      data: pushdata,
      pay: { key: process.env.priv }
    }
    console.log("publishing...")
    datapay.send(payload, function(err, tx) {
      cb(err, `success: ${tx} \n[ bterm: https://bterm.network/#address=${process.env.address} ]`)
    })
  } else {
    console.log("no key")
    process.exit()
  }
}
