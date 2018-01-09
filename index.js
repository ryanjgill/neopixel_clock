const moment = require('moment')
const PIXEL_COUNT = 60
let filled = false
let colorArray = new Array(60)

let HOUR_COLOR = 'RED'
let MINUTES_COLOR = 'GREEN'
let SECONDS_COLOR = 'BLUE'
let BACKGROUND_COLOR = 'BLACK'

let fillWithColor = function (_array, _color, _pixel_count) {
  for(let x = 0; x < _pixel_count; x++) {
    filled
      ? _array[x] = _color
      : _array.push(_color)
  }
  filled = true
}

let fillHours = (_colorArray, _position, _color) => {
  for(let x = _position-2; x < _position+3; x++) {
    _colorArray[x] = _color
  }
}

let fillMinutes = (_colorArray, _position, _color) => {
  for(let x = _position-1; x < _position+2; x++) {
    _colorArray[x] = _color
  }
}

let fillSeconds = (_colorArray, _position, _color) => {
  _colorArray[_position] = _color
}

fillWithColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)

setInterval(() => {
  let mTime = moment(new Date())

  let hours = mTime.hours()%12*5
  let minutes = mTime.minutes()
  let seconds = mTime.seconds()

  fillWithColor(colorArray, BACKGROUND_COLOR, PIXEL_COUNT)
  fillHours(colorArray, hours, HOUR_COLOR)
  fillMinutes(colorArray, minutes, MINUTES_COLOR)
  fillSeconds(colorArray, seconds, SECONDS_COLOR)

  // update strip with colorArray
  
  console.log(colorArray)
  console.log(mTime.format('hh:mm:ss'))
}, 1000)

