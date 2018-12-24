<script>
import Base from '@/components/Base.vue'
export default {
  extends: Base,
  props: {
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  data() {
    return {
      width: 206,
      height: 96,
      sx: 308,
      sy: 0,
      x: 0,
      y: 0,
      alpha: 1.0,
      fadeTransition: 0.5,
      fadeTransitionCurrent: 0
    }
  },
  name: 'Loading',
  methods: {
    mounted() {
      this.fadeTransitionCurrent = 0
      this.x = this.$parent.width / 2 - this.width / 2
      this.y = this.$parent.height - this.height * 2
    },
    render(ctx) {
      ctx.save()
      ctx.globalAlpha = this.alpha
      ctx.drawImage(this.provider.images['menu-atlas'], this.sx, this.sy, this.width, this.height, this.x, this.y, this.width, this.height)
      ctx.fillStyle = "white"
      ctx.font = "bold 20px URW Gothic"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(this.$parent.$t('loading.loading') + ": " + this.current + "/" + this.total, this.x + this.width / 2.0, this.y + this.height / 2.0)
      ctx.restore()
    },
    update(dt) {
      if (this.current === this.total && this.fadeTransitionCurrent < this.fadeTransition) {
        this.fadeTransitionCurrent += dt
        if (this.fadeTransitionCurrent > this.fadeTransition)
          this.fadeTransitionCurrent = this.fadeTransition
        this.y = this.$parent.height - this.height * 2 - this.fadeTransitionCurrent / this.fadeTransition * 100
        this.alpha = 1.0 - this.fadeTransitionCurrent / this.fadeTransition
        if (this.fadeTransitionCurrent == this.fadeTransition) {
          this.$emit('ready')
        }
      }
    }
  }
}
</script>
