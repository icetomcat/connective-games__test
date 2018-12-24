<script>
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  mixins: [box],
  props: {
    color: {
      type: String,
      default: '#000'
    }
  },
  name: 'FilledRect',
  methods: {
    render(ctx) {
      this.setRealSize(this.width, this.height)
      ctx.save()
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.restore()
    }
  }
}
</script>
