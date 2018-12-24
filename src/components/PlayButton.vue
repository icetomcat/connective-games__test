<script>
import {
  mapActions,
  mapState,
} from 'vuex'
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  mixins: [box],
  name: 'PlayButton',
  computed: {
    ...mapState('game', [
      'settings'
    ])
  },
  methods: {
    created() {
      this.setRealSize(206, 96)
      this.$on('click', () => this.provider.eventBus.$emit('newGame'))
    },
    render(ctx) {
      ctx.save()
      this.drawImage(this.provider.images['menu-atlas'],
        308, 0, 206, 96, 0, 0, 206, 96
      )
      ctx.fillStyle = "white"
      ctx.font = "bold 36px URW Gothic"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(this.$t('menu.play'), this.x + this.width / 2.0, this.y + this.height / 2.0)
      ctx.restore()
    }
  }
}
</script>
