'use strict'

const request = require('request')

module.exports = function (zip) {
  return new Promise((resolve, reject) => {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyBWqjN0wgKn0kL97iprRdVj2yFhjA6Mp98&query=universities%20near%20${zip}`
    request({
      url,
      json: true
    }, (err, resp, body) => {
      if (err) {
        return reject(err)
      }

      resolve(body.results[0].name)
    })
  })
}

