const Request = require('request-promise')
const URI = 'http://colormind.io/api/'

let options = {
  uri: URI,
  body: {
    "model": 'default' // or 'ui'
  },
  json: true
};

module.exports = () => {
  return Request(options)
    .then(data => data.result.slice(0, 3))
    .catch(error => console.log(error))
}

