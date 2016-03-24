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
    action: '/ivr/menu'
  }, node => {
    node.play('/audio/welcome.mp3')
  })
  res.send(twiml.toString())
})

app.post('/ivr/menu', (req, res) => {
 // let digit = req.body.Digits

 let twiml = new twilio.TwimlResponse()
 twiml.gather({
   numDigits: 1,
   action: '/ivr/step1'
 }, node => {
   node.say('Please tell me why you are calling. Select from the following options.')
   node.say('Press 1 if you are sick.')
   node.say('Press 2 if you would like to become a doctor.')
 })
 res.send(twiml.toString())
})

app.post('/ivr/step1', (req, res) => {
 let digit = req.body.Digits

 let respMap = {
   "1": iAmSick,
   "2": iBecomeDoctor
 }

 let twiml = new twilio.TwimlResponse()

 twiml = respMap[digit](twiml)

 res.send(twiml.toString())
})

function iAmSick (twiml) {
  twiml.gather({
    action: '/ivr/step2',
    timeout: 3
  }, node => {
    node.say('I am sorry that you are sick. That sucks.')
    node.say('On a scale of 1 to 10, please enter how sick you are?')
  })
  return twiml
}

function iBecomeDoctor (twiml) {
  
}

app.post('/ivr/step2', (req, res) => {
 let digits = parseInt(req.body.Digits)

 let twiml = new twilio.TwimlResponse()

 if (!digits) {
   twiml.say("I didn't get any digits")
   twiml.redirect('/ivr/step1')
   return res.send(twiml.toString())
 }

 if (digits <= 3) {
   twiml.say('Rest up. You will be ok you big baby')
 } else if (digits <= 7) {
   twiml.say('You may want to go see a doctor')
 } else if (digits <= 9) {
   twiml.say('Oh my. You should go to the hospital')
 } else {
   twiml.say("I am sorry. You probably aren't going to make it")
 }

 res.send(twiml.toString())
})

app.listen(3000)
