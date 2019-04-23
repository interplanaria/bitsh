var bsv = require('datapay').bsv;
const mkdir = require('make-dir');
const mkdirp = require('mkdirp')
const bip44 = "m/44'/0'/0'/0/"
const fs = require('fs')
const homedir = require('os').homedir();
const bitcomPath = homedir + "/.bitcom"
const hdPath = bitcomPath + "/hd"
const wifPath = bitcomPath + "/wif"
const seed = async function() {
  /**************************************
  *
  *   if .seed exists
  *     create keys and write to .seed
  *     return xpriv object
  *   else
  *     read .seed
  *     instantiate xpriv object
  *     return xpriv object
  *
  **************************************/
  const seedPath = `${bitcomPath}/.seed`;
  if (fs.existsSync(seedPath)) {
    let xprivStr = fs.readFileSync(seedPath, "utf8") 
    let xpriv = bsv.HDPrivateKey.fromString(xprivStr);
    return xpriv;
  } else {
    await mkdir(bitcomPath)
    let xpriv = bsv.HDPrivateKey.fromRandom()
    fs.writeFileSync(seedPath, xpriv.toString());
    return xpriv;
  }
}
const keygen = function(xpriv, index) {
  let xpriv2 = xpriv.deriveChild(bip44 + index);
  let xpub2 = bsv.HDPublicKey.fromHDPrivateKey(xpriv2)
  let priv2 = xpriv2.privateKey;
  let pub2 = xpriv2.publicKey;
  let address2 = xpriv2.privateKey.toAddress();
  return {
    xpriv: xpriv2.toString(),
    xpub: xpub2.toString(),
    priv: priv2.toString(),
    pub: pub2.toString(),
    address: address2.toString()
  }
}
const keyimport = function(wif) {
  try {
    let privateKey = bsv.PrivateKey.fromWIF(wif);
    let address = privateKey.toAddress();
    let pubKey = privateKey.toPublicKey();
    // write to key
    return {
      priv: privateKey.toWIF(),
      pub: pubKey.toString(),
      address: address.toString()
    }
  } catch (e) {
    console.log(e)
    process.exit();
  }
}
const address = function(folder) {
  // get the address for a folder
  return new Promise(function(resolve, reject) {
    fs.readFile(folder + "/.bit", 'utf8', function(err, contents) {
      let addrmatch = contents.match(/address=[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/)
      resolve(addrmatch[0].split("=")[1])
    })
  })
}
const importer = function(wif) {
  return new Promise(async function(resolve, reject) {
    await mkdir(wifPath)
    let keys = keyimport(wif)
    let addressPath = wifPath + "/" + keys.address;
    if (fs.existsSync(addressPath)) {
      resolve({ value:  keys })
    } else {
      mkdirp(addressPath, function(err) {
        if (err) {
          console.log(err)
          reject()
        } else {
          let stream = fs.createWriteStream(addressPath + "/.bit")
          stream.once('open', function(fd) {
            let content = Object.keys(keys).map(function(key) {
              return key + "=" + keys[key]
            }).join("\n")
            stream.write(content)
            stream.end();
            resolve({ value: keys });
          })
        }
      })
    }
  })
}
const add = function(seed) {
  return new Promise(async function(resolve, reject) {
    await mkdir(hdPath)
    fs.readdir(hdPath, async function(err, items) {
      let newIndex;
      let newItems = items.filter(function(item) {
        return !/^\..+/.test(item)
      }).map(function(item) {
        return parseInt(item)
      })
      if (newItems.length === 0) {
        newIndex = 0;
      } else {
        newItems.sort(function(a, b) {
          return b-a
        })
        newIndex = newItems[0] + 1
      }
      mkdirp(hdPath + "/" + newIndex, function(err) {
        if (err) {
          console.log(err)
          reject()
        } else {
          let stream = fs.createWriteStream(hdPath + "/" + newIndex + "/.bit")
          stream.once('open', function(fd) {
            let keys = keygen(seed, newIndex)
            let content = Object.keys(keys).map(function(key) {
              return key + "=" + keys[key]
            }).join("\n")
            stream.write(content)
            stream.end();
            resolve({
              value: keys,
              index: newIndex
            });
          })
        }
      })
    })
  })
}
const ls = function(type) {
  // return the list of addresses from all keys
  let p = (type === 'hd' ? hdPath : wifPath)
  return new Promise(async function(resolve, reject) {
    await mkdir(p);
    fs.readdir(p, async function(err, items) {
      let newItems = items.filter(function(item) {
        return !/^\..+/.test(item)
      })
      let ps = Promise.all(newItems.map(async function(item) {
        if (type === 'hd') {
          let addr = await address(p + "/" + item)
          return {
            index: item,
            value: addr
          }
        } else {
          return {
            value: item
          }
        }
      }))
      ps.then(function(addrs) {
        resolve(addrs)
      })
    })
  })
}
const generate = async function() {
  let s = await seed()
  let keys = await add(s)
  return keys
};
module.exports = {
  ls: ls,
  importer: importer,
  generate: generate
}
