const moment = require('moment')
const FadeCandy = require('node-fadecandy')
const fill = require('./utils/fill')

const PIXEL_COUNT = 60
let colorArray = new Array(PIXEL_COUNT)

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

let HOUR_COLOR = RED
let MINUTES_COLOR = GREEN
let SECONDS_COLOR = BLUE
let BACKGROUND_COLOR = BLACK

// fill lights with background color
fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)

let ticks = 0
let DURATION = 1000
//let DURATION = 1000/60

setInterval(() => {
  let mTime = moment(new Date())
  //let mTime = moment(new Date(ticks))

  let hours = mTime.hours()%12*5
  let minutes = mTime.minutes()
  let seconds = mTime.seconds()
  fill.withColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)
  fill.hours(colorArray, hours, HOUR_COLOR)
  fill.minutes(colorArray, minutes, MINUTES_COLOR)
  fill.seconds(colorArray, seconds, SECONDS_COLOR)

  //console.log(mTime.format('hh:mm:ss'))
  //ticks = ticks + 1000
}, DURATION)

// FADE CANDY
let fc = new FadeCandy()


fc.on(FadeCandy.events.READY, function () {
  console.log('FadeCandy.events.READY')
  // see the config schema
  console.log(fc.Configuration.schema)
  // create default color look up table
  fc.clut.create()
  // set fadecandy led to manual mode
  //fc.config.set(fc.Configuration.schema.LED_MODE, 1)
  fc.config.set(fc.Configuration.schema.DISABLE_DITHERING, 0)
  fc.config.set(fc.Configuration.schema.DISABLE_KEYFRAME_INTERPOLATION, 0)
  // blink that led
  // let state = false
  // setInterval(() => {
  //     state = !state
  //     fc.config.set(fc.Configuration.schema.LED_STATUS, +state)
  // }, 5000)
})

fc.on(FadeCandy.events.COLOR_LUT_READY, function () {
  console.log('FaceCandy says color lut ready')

  let frame = 0
  

  // start clock
  let clock_interval = setInterval(function () {
    fc.send([].concat.apply([], colorArray))
    frame++
  }, DURATION)
})

