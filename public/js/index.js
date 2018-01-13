new Vue({
	el: '#main',
	template: `
	<div class="main">
    <h2>NeoPixel Clock</h2>
    <div class="controls">
      <div class="control">
        <label>Hours</label>
        <input type="color" @change="colorSelected" refs="hours" v-model="hours"/>
      </div>
      <div class="control">
        <label>Minutes</label>
        <input type="color" @change="colorSelected" refs="minutes" v-model="minutes"/>
      </div>
      <div class="control">
        <label>Seconds</label>
        <input type="color" @change="colorSelected" refs="seconds" v-model="seconds"/>
      </div>
    </div>
	</div>
	`,
	data: {
    hours: '',
    minutes: '',
    seconds: ''
	},
	computed: {
    colors() {
      return {
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
  },
  methods: {
    colorChange(data) {
      this.hours = this.rgbToHex(data.hours)
      this.minutes = this.rgbToHex(data.minutes)
      this.seconds = this.rgbToHex(data.seconds)
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
    rgbToHex([r, g, b]) {
      return "#" + this.toHex(r) + this.toHex(g) + this.toHex(b)
    },
    toHex(c) {
      let hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex
    }
  }
});
