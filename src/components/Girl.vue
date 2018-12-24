<script>
import Base from '@/components/Base.vue'
export default {
  extends: Base,
  name: 'Girl',
  data() {
    return {
      spin: 0,
      buffer: null
    }
  },
  methods: {
    created() {
      this.buffer = this.createBuffer()
    },
    render(ctx) {
      this.buffer.clearRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height)
      this.buffer.drawImage(this.provider.images['menu-atlas'], 0, 88, 152, 160, 300, 430, 152, 160)
      if (Math.sin(this.spin * .3) < 0.99) {
        this.buffer.drawImage(this.provider.images['menu-atlas'], 343, 141, 63, 19, 334, 478, 63, 19)
      }
      this.buffer.drawImage(this.provider.images['menu-atlas'], 362, 227, 68, 142, 267, 395 + Math.sin(this.spin * .5) * 20, 68, 142 - Math.sin(this.spin * .5) * 20)
      this.buffer.drawImage(this.provider.images['menu-atlas'], 153, 131, 121, 116, 200, 330 + Math.sin(this.spin * .5) * 10, 121, 116)

      ctx.drawImage(this.buffer.canvas, 0, 0)
    },
    update(dt) {
      this.spin += dt * Math.PI
    }
  }
}
</script>
