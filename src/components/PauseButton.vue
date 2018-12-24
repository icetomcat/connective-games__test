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
  name: 'PauseButton',
  computed: {
    ...mapState('game', [
      'settings',
      'status'
    ])
  },
  methods: {
    created() {
      this.setRealSize(62, 62)
      this.$on('click', event => {
        event.nativeEvent.stop = true
        this.provider.eventBus.$emit(this.provider.game.STATUS_PAUSED === this.status ? 'continue' : 'pause')
      })
    },
    render(ctx) {
      ctx.save()
      this.drawImage(this.provider.images['menu-atlas'],
        190, 258, 62, 62, 0, 0, 62, 62
      )
      let iconSprite = [438, 433, 32, 32]
      if (this.provider.game.STATUS_PAUSED === this.status) {
        iconSprite = [558, 431, 32, 32]
      }
      this.drawImage(this.provider.images['game'],
        ...iconSprite, 16, 16, 32, 32
      )
      ctx.restore()
    }
  }
}
</script>
