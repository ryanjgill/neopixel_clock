const THEMES = {
  astros:  {
    colors: ['#002D62', '#EB6E1F', '#666666'],
    image: 'images/astros_icon.png'
  },
  rockets: {
    colors: ['#CE1141', '#FDB927', '#666666'],
    image: 'images/rockets_icon.png'
  },
  texans:  {
    colors: ['#091F2C', '#A6192E', '#666666'],
    image: 'images/texans_icon.png'
  },
  mardi_gras: {
    colors: ['#AC2BB9', '#4EEC6C', '#00A7FF'],
    image: 'images/mardi_gras_mask_icon.png'
  }
}

new Vue({
	el: '#main',
	template: `
	<div class="main">
    <h2>NeoPixel Clock</h2>
    <div class="controls">
      <div class="control">
        <label>Hours</label>
        <input type="color" @change="colorSelected" v-model="hours"/>
      </div>
      <div class="control">
        <label>Minutes</label>
        <input type="color" @change="colorSelected" v-model="minutes"/>
      </div>
      <div class="control">
        <label>Seconds</label>
        <input type="color" @change="colorSelected" v-model="seconds"/>
      </div>
      <div class="control">
        <label>Background</label>
        <input type="color" @change="colorSelected" v-model="background"/>
      </div>
    </div>
    <hr>
    <div class="themes">
      <div v-for="theme in themes">
        <img :src="theme.image" @click="themeSelected(theme)"/>
      </div>
      <div>
        <img src="images/colorWheel.png" @click="pickRandomColors" title="Pick Random Colors"/>
      </div>
      <div>
        <img v-if="alwaysOn" src="images/no_motion.png" class="motion" @click="toggleMotion" title="Toggle Motion"/>
        <img v-else src="images/motion.png" class="motion" @click="toggleMotion" title="Toggle Motion"/>
      </div>
    </div>
	</div>
	`,
	data: {
    alwaysOn: true,
    background: '#000000',
    hours: '',
    minutes: '',
    seconds: '',
    themes: THEMES
	},
	computed: {
    backgroundRgb() {
      return this.hexToRgb(this.background)
    },
    colors() {
      return {
        background: [this.backgroundRgb.r, this.backgroundRgb.g, this.backgroundRgb.b],
        hours: [this.hoursRgb.r, this.hoursRgb.g, this.hoursRgb.b],
        minutes: [this.minutesRgb.r, this.minutesRgb.g, this.minutesRgb.b],
        seconds: [this.secondsRgb.r, this.secondsRgb.g, this.secondsRgb.b]
      }
    },
    hoursRgb() {
      return this.hexToRgb(this.hours)
    },
    minutesRgb() {
      return this.hexToRgb(this.minutes)
    },
    secondsRgb() {
      return this.hexToRgb(this.seconds)
    }
	},
	created() {
    this.socket = io();
    this.socket.on('color-changed', this.colorChange)
    this.socket.on('always-on', this.alwaysOnChange)
  },
  methods: {
    alwaysOnChange(value) {
      this.alwaysOn = value
    },
    colorChange(data) {
      this.hours = this.rgbToHex(data.hours)
      this.minutes = this.rgbToHex(data.minutes)
      this.seconds = this.rgbToHex(data.seconds)
      this.background = this.rgbToHex(data.background)
    },
    colorSelected() {
      this.socket.emit('color-selected', this.colors)
    },
    hexToRgb(hex) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null
    },
    pickRandomColors() {
      this.socket.emit('pick-random-colors')
    },  
    rgbToHex([r, g, b]) {
      return "#" + this.toHex(r) + this.toHex(g) + this.toHex(b)
    },
    themeSelected(theme) {
      this.hours = theme.colors[0]
      this.minutes = theme.colors[1]
      this.seconds = theme.colors[2]
      this.background = '#000000'
      this.colorSelected()
    },
    toggleMotion() {
      this.alwaysOn = !this.alwaysOn
      this.socket.emit('always-on', this.alwaysOn)
    },
    toHex(c) {
      let hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex
    }
  }
});
