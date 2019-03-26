export default (function () {
  const defaultOptions = {
    sectionCount: 30,
    color: "#ff0000",
    lineWidth: 4,
    offset: 5,
    speed: 0.17,
    bloom: 4,
    bloomColor: "#ffe6e6",
    bloomWidth: 12,
    levels: 7,
  }

  function random (max = 100, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function (callback) {
                  window.setTimeout(callback, 1000 / 60)
              }
  })()

  class Lightning {
    constructor(renderContainer, _options = {}) {
      this.options = {...defaultOptions, ..._options}
      if (this.options.sectionCount < 3) throw new Error ("section count must be 3 or more")
      this._renderContainer = renderContainer

      this.makeCanvas = this.makeCanvas.bind(this)
      this.mathSize = this.mathSize.bind(this)
      this.drawLightning = this.drawLightning.bind(this)
      this.mathFrame = this.mathFrame.bind(this)
      this.disbalancePoints = this.disbalancePoints.bind(this)
      this.changeDirection = this.changeDirection.bind(this)
      this.redraw = this.redraw.bind(this)

      this.canvas = {}

      this.makeCanvas()

      this.points = [...new Array(this.options.sectionCount)].fill(this.zeroPoint)
      this.distancePoints = [...new Array(this.options.sectionCount)].fill(0)
      this.drawPoints = []
      this.balansier = 0
      this.direction = 1
      this.disbalancePoints()

      this.redraw()
    }

    redraw () {
      this.mathFrame()
      this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

      this.canvas.ctx.lineWidth = this.options.bloomWidth 
      this.canvas.ctx.filter = `blur(${this.options.bloom}px)`
      this.canvas.ctx.strokeStyle = this.options.color
      this.drawLightning()

      this.canvas.ctx.lineWidth = this.options.lineWidth
      this.canvas.ctx.filter = "none"
      this.canvas.ctx.strokeStyle = this.options.bloomColor
      this.drawLightning()
      requestAnimationFrame(this.redraw)
    }

    changeDirection () {
      this.direction = this.direction === 1 ? -1 : 1
    }

    disbalancePoints () {
      const max = this.canvas.height - this.options.offset
      const z = random(1, this.options.levels)
      const partBorder = Math.floor(this.options.sectionCount / z)
      const part = (this.canvas.height - this.options.offset * 2) / 2 / partBorder
      let direction = random(1) ? 1 : -1
      let beforePoint = this.zeroPoint
      const getRandomPoint = (min) => {
        return Math.random() * (max - min) + min
      }
      this.distancePoints = this.points.map((point, i) => {
        if (!(i % partBorder)) direction = direction === 1 ? -1 : 1
        let stabilizer = Math.random()
        if (this.options.sectionCount - partBorder < i) {
          if ((beforePoint > this.zeroPoint && direction === 1)
            || (beforePoint < this.zeroPoint && direction === -1)) {
            stabilizer *= -1
          }
        }
        beforePoint = beforePoint + direction * part * stabilizer
        return beforePoint - point
      })
    }

    mathFrame () {
      this.balansier += this.direction * this.options.speed
      if (this.balansier <= 0 || this.balansier >= 1) {
        this.changeDirection()
        this.points = [...this.drawPoints]
        this.balansier = 0
        this.changeDirection()
        this.disbalancePoints()
      }
      const moovePoint = (point, i) => {
        return point + this.distancePoints[i] * this.balansier
      }
      this.drawPoints = this.points.map(moovePoint) 
    }

    makeCanvas(renderContainer) {
      this.canvas.node = document.createElement("canvas")
      this.mathSize()
      window.addEventListener("resize", this.mathSize)
      this._renderContainer.appendChild(this.canvas.node)
      this.canvas.ctx = this.canvas.node.getContext("2d")
    }

    mathSize() {
      this.canvas.width = this._renderContainer.offsetWidth
      this.canvas.height = this._renderContainer.offsetHeight
      this.canvas.node.width = this.canvas.width
      this.canvas.node.height = this.canvas.height

      this.step = this.canvas.width / (this.options.sectionCount + 1)
      this.zeroPoint = this.canvas.height / 2
    }

    drawLightning() {
      this.canvas.ctx.beginPath()
      this.canvas.ctx.moveTo(0, this.zeroPoint)
      this.drawPoints.forEach((point, pointIndex) => {
        this.canvas.ctx.lineTo(this.step * (pointIndex + 1), point)
      })
      this.canvas.ctx.lineTo(this.canvas.width, this.zeroPoint)
      this.canvas.ctx.stroke()
    }
  }

  return Lightning
})()
