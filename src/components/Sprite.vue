<script>
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  mixins: [box],
  props: {
    image: {
      type: HTMLImageElement,
      required: true
    },
    sx: {
      type: Number,
      default: 0
    },
    sy: {
      type: Number,
      default: 0
    },
    sWidth: {
      type: Number,
      default: null
    },
    sHeight: {
      type: Number,
      default: null
    }
  },
  name: 'Sprite',
  methods: {
    mounted() {
      if (this.image && this.box.width === 0 && this.box.height === 0) {
        this.setRealSize(this.image.width, this.image.height)
      }
    },
    render(ctx) {
      if (this.image) {
        this.setRealSize(this.width, this.height)
        ctx.drawImage(
          this.image,
          this.sx,
          this.sy,
          this.sWidth ? this.sWidth : this.image.width,
          this.sHeight ? this.sHeight : this.image.height,
          this.x,
          this.y,
          this.width,
          this.height
        )
      }
    }
  }
}
</script>
