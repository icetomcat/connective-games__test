<script>
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  name: 'Animation',
  props: {
    origin: {
      type: Array,
      default: [0, 0]
    }
  },
  data() {
    return {
      time: 0,
      duration: 0,
      from: null,
      to: null,
      completed: true,
      resolve: null,
      reject: null,
      autoreset: false,
      transitionsPipe: []
    }
  },
  methods: {
    afterRender(ctx) {
      ctx.restore()
    },
    reset() {
      if (!this.completed && this.resolve) {
        this.resolve()
      }
      this.from = null
      this.to = null
      this.time = null
      this.completed = false
      this.autoreset = false
    },
    beforeRender(ctx) {
      ctx.save()
      ctx.translate(...this.origin)
      for (let transform in this.from) {
        if (this['__' + transform]) {
          this['__' + transform](this.from[transform], this.to[transform], ctx)
        }
      }
      ctx.translate(-this.origin[0], -this.origin[1])
    },
    __translate(from, to, ctx) {
      ctx.translate(this.linear(this.time, this.duration, from[0], to[0]), this.linear(this.time, this.duration, from[1], to[1]))
    },
    __alpha(from, to, ctx) {
      ctx.globalAlpha = this.linear(this.time, this.duration, from, to)
    },
    __scale(from, to, ctx) {
      ctx.scale(this.linear(this.time, this.duration, from[0], to[0]), this.linear(this.time, this.duration, from[1], to[1]))
    },
    __rotate(from, to, ctx) {
      ctx.rotate(this.linear(this.time, this.duration, from, to))
    },
    linear(time, duration, from, to) {
      return from + (to - from) * time / duration
    },
    transition(from, to, duration, autoreset) {
      if (!this.completed && this.resolve) {
        this.resolve()
      }
      this.time = 0
      this.completed = false
      this.autoreset = autoreset
      this.duration = duration
      this.from = from
      this.to = to
      return new Promise((resolve, reject) => {
        this.resolve = () => {
          this.completed = true
          if (this.autoreset) {
            this.reset()
          }
          this.$emit('completed')
          resolve()
        }
        this.reject = reject
      })
    },
    transitionPipe(transitions) {
      if (transitions.length === 0) {
        return new Promise(resolve => resolve())
      } else {
        let transition = transitions.shift()
        return this.transition(...transition).then(() => {
          return this.transitionPipe(transitions)
        })
      }
    },
    addState(name, state) {
      this.states[name] = state
    },
    update(dt) {
      if (this.time < this.duration) {
        this.time += dt
        if (this.time >= this.duration) {
          this.time = this.duration
          this.resolve()
        }
      }
    }
  }
}
</script>
