<script>
import Base from '@/components/Base.vue'
export default {
  extends: Base,
  computed: {
    ctx() {
      return this.buffer
    },
  },
  data() {
    return {
      buffer: null
    }
  },
  props: {
    width: Number,
    height: Number
  },
  name: 'Buffer',
  methods: {
    created() {
      this.buffer = this.createBuffer(this.width, this.height)
    },
    beforeRender() {
      this.buffer.clearRect(0, 0, this.width, this.height)
    },
    render(ctx) {
      this.provider.context.drawImage(this.buffer.canvas, 0, 0)
    }
  }
}
</script>
