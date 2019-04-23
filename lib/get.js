const axios = require('axios')
const endpoint = "https://babel.bitdb.network/q/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/"
const apikey = "1KJPjd3p8khnWZTkjhDYnywLB2yE1w5BmU"
module.exports = function(query, done) {
  let s = JSON.stringify(query);
  let b64 = Buffer.from(s).toString('base64');
  let url = endpoint + b64;
  let header = { headers: { key: apikey } };
  axios.get(url, header).then(function(r) {
    done(r.data) 
  })
}
