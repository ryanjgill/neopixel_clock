const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ip = require('ip')
const PORT = 3000
const serverIP = `${ip.address()}:${PORT}`
const moment = require('moment')
const FadeCandy = require('node-fadecandy')
const fill = require('./utils/fill')
const five = require('johnny-five');
const Raspi = require('raspi-io');
const board = new five.Board({
  io: new Raspi()
});

// express setup
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('tiny'))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

// route for user interface
app.get('/', (req, res, next) => {
  res.render('index')
  next()
})

let RED = [255, 0, 83]
let GREEN = [78, 236, 108]
let BLUE = [0, 167, 255]
let BLACK = [0, 0, 0]
let WHITE = [255, 255, 255]
let HALF_WHITE = [125, 125, 125]
let YELLOW = [255, 235, 52]
let ORANGE = [255, 97, 0]
let PURPLE = [172, 43, 185]
let DARK_BLUE = [45, 41, 135]
let TAN = [238, 190, 138]
let OFF_WHITE = [60, 60, 30]

let HOURS_COLOR = PURPLE
let MINUTES_COLOR = GREEN
let SECONDS_COLOR = BLUE
let BACKGROUND_COLOR = BLACK
let TIMER_DURATION = 5000
let sleep = false
let alwaysOn = false

let DURATION = 1000
const PIXEL_COUNT = 60
let colorArray = new Array(PIXEL_COUNT)

// fill lights with background color
fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)

setInterval(() => {
  if (sleep && !alwaysOn) { 
    fill.withColor(colorArray, BLACK, PIXEL_COUNT)
    return
  }

  let mTime = moment(new Date()).subtract(6, 'hours')

  let minutes = mTime.minutes()
  let seconds = mTime.seconds()
  let hours = Math.floor((mTime.hours()%12+(minutes/60))*5)
  
  fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)
  fill.hours(colorArray, hours, HOURS_COLOR)
  fill.minutes(colorArray, minutes, MINUTES_COLOR)
  fill.seconds(colorArray, seconds, SECONDS_COLOR)
}, DURATION)

// FADE CANDY
let fc = new FadeCandy()

fc.on(FadeCandy.events.READY, function () {
  console.log('FadeCandy is ready...')
  fc.clut.create()
  fc.config.set(fc.Configuration.schema.DISABLE_DITHERING, 0)
  fc.config.set(fc.Configuration.schema.DISABLE_KEYFRAME_INTERPOLATION, 0)
})

fc.on(FadeCandy.events.COLOR_LUT_READY, function () {
  console.log('FaceCandy says color lut ready')
  let frame = 0
  // start clock
  let clock_interval = setInterval(function () {
    fc.send([].concat.apply([], colorArray))
    frame++
    console.log(colorArray[0])
  }, DURATION)
})

io.on('connection', socket => {
  socket.emit('color-changed', {
    background: BACKGROUND_COLOR,
    hours: HOURS_COLOR,
    minutes: MINUTES_COLOR,
    seconds: SECONDS_COLOR
  })
  socket.emit('always-on', alwaysOn)

  // user has selected new color
  socket.on('color-selected', color => {
    BACKGROUND_COLOR = color.background
    HOURS_COLOR = color.hours
    MINUTES_COLOR = color.minutes
    SECONDS_COLOR = color.seconds

    // broadcast back to any other clients 
    socket.broadcast.emit('color-changed', {
      background: BACKGROUND_COLOR,
      hours: HOURS_COLOR,
      minutes: MINUTES_COLOR,
      seconds: SECONDS_COLOR
    })
  })

  // always on bypass
  socket.on('always-on', value => {
    console.log('always-on was fired')
    alwaysOn = value

    // broadcast back to any other clients 
    socket.broadcast.emit('always-on', value)
  })
})

// Johnny-five motion sensor feature
let timerId = null

board.on("ready", function() {
  let motion = new five.Motion(2)

  motion.on("motionstart", function() {
    clearTimeout(timerId)
    sleep = false
    // No motion so lets start a timer and clear the clock when it ends
    timerId = setTimeout(() => {
      sleep = true
    }, TIMER_DURATION)
  })
})

server.listen(PORT, () => console.log(`Listening on ${serverIP}`))
