'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const twilio = require('twilio')
const app = express()

app.use(express.static(path.join(__dirname, '/assets')))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/ivr/welcome', (req, res) => {
  let twiml = new twilio.TwimlResponse()
  twiml.gather({
    numDigits: 1,
    action: '/ivr/step1'
  }, function () {
    this.play('/audio/welcome.mp3')
    // this.say('Hello, World! Please press 1 to continue', {
      // voice: 'alice',
      // language: 'en-GB'
    // })
  })
  res.send(twiml.toString())
})

app.post('/ivr/step1', (req, res) => {
 let digit = req.body.Digits
 let twiml = new twilio.TwimlResponse()
 twiml.say(`You pressed the number ${digit}`)
 res.send(twiml.toString())
})

app.listen(3000)
