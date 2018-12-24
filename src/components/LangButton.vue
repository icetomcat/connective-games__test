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
  name: 'LangButton',
  computed: {
    ...mapState('game', [
      'settings'
    ])
  },
  methods: {
    created() {
      this.setRealSize(62, 62)
      this.$on('click', () => this.provider.eventBus.$emit('toggleLang'))
    },
    render(ctx) {
      ctx.save()
      this.drawImage(this.provider.images['menu-atlas'],
        190, 258, 62, 62, 0, 0, 62, 62
      )
      ctx.fillStyle = "white"
      ctx.font = "bold 20px URW Gothic"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(this.$i18n.locale, ...Object.values(this.calculatePosition(31, 31)))
      ctx.restore()
    }
  }
}
</script>
