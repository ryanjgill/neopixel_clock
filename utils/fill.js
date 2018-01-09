module.exports = {
  withColor: (_colorArray, _color, _pixel_count) => {
    for(let x = 0; x < _pixel_count; x++) {
      _colorArray[x] = _color
    }
  },
  hours: (_colorArray, _position, _color) => {
    for(let x = _position-2; x < _position+3; x++) {
      _colorArray[x] = _color
    }
  },
  minutes: (_colorArray, _position, _color) => {
    for(let x = _position-1; x < _position+2; x++) {
      _colorArray[x] = _color
    }
  },
  seconds: (_colorArray, _position, _color) => {
    _colorArray[_position] = _color
  }
}