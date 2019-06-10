const Timer = function (initialSeconds) {
  this.initialSeconds = initialSeconds
  this.remainingSeconds = initialSeconds
  this._intervalObject = null
}

Timer.prototype.start = function () {
  const self = this
  this._intervalObject = setInterval(function () {
    self.remainingSeconds--
  }, 1000)
}

Timer.prototype.pause = function () {
  clearInterval(this._intervalObject)
  this._intervalObject = null
}

Timer.prototype.pausing = function () {
  return this._intervalObject === null
}

Timer.prototype.remainingTimeString = function () {
  const isPositiveNumber = this.remainingSeconds >= 0
  const sign = isPositiveNumber ? '' : '- '

  const unsignedValue = isPositiveNumber
    ? this.remainingSeconds
    : this.remainingSeconds * -1
  const minutes = Math.floor(unsignedValue / 60)
  const seconds = unsignedValue % 60
  const secPadding = seconds <= 9 ? '0' : ''

  return sign + minutes + ':' + secPadding + seconds
}

Timer.prototype.remainingPercent = function () {
  const progress = (100 * this.remainingSeconds) / this.initialSeconds
  const remaining = 100 - progress
  return Math.floor(remaining)
}

const vm = new Vue({
  el: '#app',
  data: {
    timer: new Timer(0),
    selected: false
  },
  computed: {
    time: function () {
      return this.timer.remainingTimeString()
    },
    pausing: function () {
      return this.timer.pausing()
    },
    image: function () {
      const remainingPercent = this.timer.remainingPercent()

      var imageFile
      if (remainingPercent < 25) {
        imageFile = '000'
      } else if (remainingPercent < 50) {
        imageFile = '025'
      } else if (remainingPercent < 60) {
        imageFile = '050'
      } else if (remainingPercent < 70) {
        imageFile = '060'
      } else if (remainingPercent < 80) {
        imageFile = '070'
      } else if (remainingPercent < 90) {
        imageFile = '080'
      } else if (remainingPercent < 100) {
        imageFile = '090'
      } else {
        imageFile = '100'
      }

      return 'url(./img/' + imageFile + '.jpg)'
    }
  },
  methods: {
    selecting: function (minutes) {
      const seconds = minutes * 60
      return this.timer.initialSeconds === seconds
    },
    select: function (minutes) {
      const seconds = minutes * 60

      const otherTimerSelecting = !this.selecting(minutes)

      if (otherTimerSelecting) {
        this.timer = new Timer(seconds)
      } else {
        this.timer.start()
        this.selected = true
      }
    },
    pauseOrStart: function () {
      if (this.timer.pausing()) {
        this.timer.start()
      } else {
        this.timer.pause()
      }
    },
    stop: function () {
      this.selected = false
      this.timer = new Timer(0)
    }
  }
})
