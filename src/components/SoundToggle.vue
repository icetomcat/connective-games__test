<script>
import {
  mapState,
} from 'vuex'
import Base from '@/components/Base.vue'
import box from '@/mixins/box.js'
export default {
  extends: Base,
  mixins: [box],
  name: 'SoundToggle',
  computed: {
    ...mapState('game', [
      'settings'
    ])
  },
  methods: {
    created() {
      this.setRealSize(62, 62)
      this.$on('click', () => this.provider.eventBus.$emit('toggleSound'))
    },
    render(ctx) {
      ctx.save()
      this.drawImage(this.provider.images['menu-atlas'],
        190, 258, 62, 62, 0, 0, 62, 62
      )
      let iconSprite = [355, 433, 32, 32]
      if (!this.settings.soundMuted) {
        iconSprite = [396, 433, 32, 32]
      }
      this.drawImage(this.provider.images['game'],
        ...iconSprite, 16, 16, 32, 32
      )
      ctx.restore()
    }
  }
}
</script>
