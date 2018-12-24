<script>
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  mixins: [box],
  props: {
    text: {
      type: String,
      default: 'Label'
    },
    font: {
      type: String,
      default: '16px Arial'
    },
    color: {
      type: String,
      default: '#000'
    },
    textAlign: {
      type: String,
      default: 'left'
    },
    textBaseline: {
      type: String,
      default: 'top'
    }
  },
  name: 'Label',
  methods: {
    render(ctx) {
      this.setRealSize(this.width, this.height)
      ctx.save()
      ctx.fillStyle = this.color
      ctx.font = this.font
      ctx.textAlign = this.textAlign
      ctx.textBaseline = this.textBaseline
      ctx.fillText(this.text, this.x, this.y)
      ctx.restore()
    }
  }
}
</script>
