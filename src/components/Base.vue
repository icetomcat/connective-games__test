<script>
export default {
  inject: ['provider'],
  name: 'Base',
  data() {
    return {
      context: null
    }
  },
  computed: {
    ctx() {
      return this.context ? this.context : this.provider.context
    },
    canvasWidth() {
      return this.ctx.canvas.width
    },
    canvasHeight() {
      return this.ctx.canvas.height
    }
  },
  created() {
    this.provider.eventBus.$on('update', this.__update)
    this.created()
  },
  mounted() {
    this.mounted()
  },
  beforeDestroy() {
    this.provider.eventBus.$off('update', this.__update)
    this.beforeDestroy()
  },
  destroyed() {
    this.destroyed()
  },
  render(h) {
    return h('template', this.$slots.default)
  },
  methods: {
    __event(event) {
      for (let i = this.$children.length - 1; i >= 0; i--) {
        this.$children[i].__event(event)
        if (event.stop) {
          return
        }
      }
      this.$emit('__' + event.type, event)
    },
    createBuffer(width, height) {
      let buffer = document.createElement('canvas')
      if (typeof width === "undefined") {
        width = this.ctx.canvas.width
      }
      if (typeof height === "undefined") {
        height = this.ctx.canvas.height
      }
      buffer.width = width
      buffer.height = height
      return buffer.getContext("2d")
    },
    beforeRender() {},
    afterRender() {},
    created() {},
    beforeDestroy() {},
    destroyed() {},
    mounted() {},
    render() {},
    update() {},
    __canvasPosition() {
      let xPos = 0;
      let yPos = 0;
      let el = this.ctx.canvas
      while (el) {
        if (el.tagName == "BODY") {
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop || document.documentElement.scrollTop;

          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
      }
      return [xPos, yPos]
    },
    __render(ctx) {
      this.context = ctx
      this.beforeRender(this.ctx)
      if (this.ctx) {
        for (let child of this.$children) {
          child.__render(this.ctx)
        }
        this.render(this.ctx)
      }
      this.afterRender(this.ctx)
    },
    __update(dt) {
      // this.$emit('beforeUpdate')
      this.update(dt)
      // this.$emit('afterUpdate')
    }
  }
}
</script>
