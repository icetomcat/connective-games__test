export default {
  props: ['x', 'y', 'width', 'height'],
  data() {
    return {
      box: {
        mouseover: false,
        mousedown: false,
        mousedownX: 0,
        mousedownY: 0,
        width: 0,
        height: 0,
        mouseX: 0,
        mouseY: 0
      }
    }
  },
  created() {
    this.$on('__mousemove', this.__mousemove)
    this.$on('__click', this.__click)
    this.$on('__mousedown', this.__mousedown)
    this.$on('__mouseup', this.__mouseup)
    this.$on('__touchstart', this.__touchstart)
    this.$on('__touchend', this.__touchend)
    this.$on('__touchmove', this.__touchmove)
  },
  methods: {
    setRealSize(width, height) {
      this.box.width = width
      this.box.height = height
    },
    calculateBox(x, y, width, height) {
      let scaleX = this.width / this.box.width
      let scaleY = this.height / this.box.height
      return {
        x: this.x + x * scaleX,
        y: this.y + y * scaleY,
        width: width * scaleX,
        height: height * scaleY
      }
    },
    calculatePosition(x, y) {
      let scaleX = this.width / this.box.width
      let scaleY = this.height / this.box.height
      return {
        x: this.x + x * scaleX,
        y: this.y + y * scaleY
      }
    },
    drawImage(image, sx, sy, swidth, sheight, x, y, width, height) {
      this.ctx.drawImage(image, sx, sy, swidth, sheight, ...Object.values(this.calculateBox(x, y, width, height)))
    },
    __touchstart(event) {
      let touch = event.changedTouches[0]
      let scale = this.provider.context.canvas.width / this.provider.context.canvas.clientWidth
      let canvasPosition = this.__canvasPosition()
      let x = (touch.clientX - canvasPosition[0]) * scale
      let y = (touch.clientY - canvasPosition[1]) * scale
      if (this.__intersection(x, y)) {
        this.box.mousedown = true
        this.box.mousedownX = x
        this.box.mousedownY = y
      }
    },
    __touchend(event) {
      this.box.mousedown = false
    },
    __touchmove(event) {
      let touch = event.changedTouches[0]
      let scale = this.provider.context.canvas.width / this.provider.context.canvas.clientWidth
      let canvasPosition = this.__canvasPosition()
      let x = (touch.clientX - canvasPosition[0]) * scale
      let y = (touch.clientY - canvasPosition[1]) * scale
      if (this.box.mousedown) {
        this.$emit('drag', {
          nativeEvent: event,
          sender: this,
          dragX: x - this.box.mousedownX,
          dragY: y - this.box.mousedownY
        })
      }
      if (this.__intersection(x, y)) {
        this.box.mouseX = x
        this.box.mouseY = y
        this.$emit('mousemove', {
          nativeEvent: event,
          sender: this,
          clientX: x - this.x,
          clientY: y - this.y,
          x: x,
          y: y
        })
        event.stop = true
      }
    },
    __mousemove(event) {
      let scale = this.provider.context.canvas.width / this.provider.context.canvas.clientWidth
      let x = event.offsetX * scale
      let y = event.offsetY * scale
      if (this.box.mousedown) {
        this.$emit('drag', {
          nativeEvent: event,
          sender: this,
          dragX: x - this.box.mousedownX,
          dragY: y - this.box.mousedownY
        })
      }
      if (this.__intersection(x, y)) {
        if (!this.box.mouseover) {
          this.$emit('mouseover', {
            nativeEvent: event
          })
        }
        this.box.mouseover = true
        this.box.mouseX = x
        this.box.mouseY = y
        this.$emit('mousemove', {
          nativeEvent: event,
          sender: this,
          clientX: x - this.x,
          clientY: y - this.y,
          x: x,
          y: y
        })
        event.stop = true
      } else {
        if (this.box.mouseover) {
          this.$emit('mouseout', {
            nativeEvent: event,
            sender: this
          })
        }
        this.box.mouseover = false
      }
    },
    __click(event) {
      if (this.box.mouseover) {
        this.$emit('click', {
          nativeEvent: event,
          sender: this,
          clientX: this.box.mouseX - this.x,
          clientY: this.box.mouseY - this.y,
          x: this.box.mouseX,
          y: this.box.mouseY
        })
        event.stop = true
      }
    },
    __mousedown(event) {
      if (this.box.mouseover) {
        this.box.mousedown = true
        this.box.mousedownX = this.box.mouseX
        this.box.mousedownY = this.box.mouseY
      }
    },
    __mouseup(event) {
      this.box.mousedown = false
    },
    __intersection(x, y) {
      return (x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height)
    },
    __distance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }
  }
}
