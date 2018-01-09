const moment = require('moment')
const FadeCandy = require('node-fadecandy')
const fill = require('./utils/fill')

const PIXEL_COUNT = 60
let colorArray = new Array(PIXEL_COUNT)

let RED = [255, 0, 83]
let GREEN = [78, 236, 108]
let BLUE = [0, 167, 255]
let BLACK = [0, 0, 0]

let HOUR_COLOR = RED
let MINUTES_COLOR = GREEN
let SECONDS_COLOR = BLUE
let BACKGROUND_COLOR = BLACK

// fill lights with background color
fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)

setInterval(() => {
  let mTime = moment(new Date())

  let hours = mTime.hours()%12*5
  let minutes = mTime.minutes()
  let seconds = mTime.seconds()
  fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)
  fill.hours(colorArray, hours, HOUR_COLOR)
  fill.minutes(colorArray, minutes, MINUTES_COLOR)
  fill.seconds(colorArray, seconds, SECONDS_COLOR)

  console.log(mTime.format('hh:mm:ss'))
}, 1000)

// FADE CANDY
let fc = new FadeCandy()

fc.on(FadeCandy.events.READY, function () {
  console.log('FadeCandy.events.READY')
  // see the config schema
  console.log(fc.Configuration.schema)
  // create default color look up table
  fc.clut.create()
  // set fadecandy led to manual mode
  fc.config.set(fc.Configuration.schema.LED_MODE, 1)
  // blink that led
  let state = false
  setInterval(() => {
      state = !state
      fc.config.set(fc.Configuration.schema.LED_STATUS, +state)
  }, 500)
})

fc.on(FadeCandy.events.COLOR_LUT_READY, function () {
  console.log('FaceCandy says color lut ready')

  let frame = 0
  let duration = 1000

  // start clock
  let clock_interval = setInterval(function () {
    fc.send([].concat.apply([], colorArray))
    frame++
  }, duration)
})

