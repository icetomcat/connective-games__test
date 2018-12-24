<template>
<div>
  <Cloud></Cloud>
  <Cloud></Cloud>
  <Cloud></Cloud>
  <Cloud></Cloud>
  <Cloud></Cloud>
  <Girl></Girl>
  <SoundToggle :x='10' :y='50' :width='50' :height='50'></SoundToggle>
  <PlayButton :x='canvasWidth / 2 - 103' :y='canvasHeight - 96 * 2' :width='206' :height='96'></PlayButton>
  <LangButton :x='70' :y='50' :width='50' :height='50'></LangButton>
  <slot></slot>
</div>
</template>

<script>
import {
  mapState
} from 'vuex'
import Base from '@/components/Base.vue'
import Girl from '@/components/Girl.vue'
import Cloud from '@/components/Cloud.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import PlayButton from '@/components/PlayButton.vue'
import LangButton from '@/components/LangButton.vue'

export default {
  extends: Base,
  name: 'Menu',
  data() {
    return {
      fadeIn: 1,
      fadeInCurrent: 0,
      fadeOut: 1,
      fadeOutCurrent: 0,
      alpha: 0.0
    }
  },
  computed: {
    ...mapState([
      'settings'
    ])
  },
  methods: {
    created() {},
    mounted() {
      this.provider.audios['menuMusic'].loop = true
      this.provider.audios['menuMusic'].currentTime = 0
      this.provider.eventBus.$emit('playAudio', this.provider.audios['menuMusic'])
      this.fadeInCurrent = 0
      this.fadeOutCurrent = 0
    },
    beforeDestroy() {
      this.provider.eventBus.$emit('stopAudio', this.provider.audios['menuMusic'])
    },
    afterRender(ctx) {
      ctx.restore()
    },
    render(ctx) {
      ctx.save()
      ctx.fillStyle = "#d73a2a"
      ctx.font = "bold 50px URW Gothic"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(this.$t("menu.game-name"), this.canvasWidth / 2.0, this.canvasHeight / 4.0)

      ctx.restore()
    },
    beforeRender(ctx) {
      ctx.save()
      ctx.globalAlpha = this.alpha
    },
    update(dt) {
      if (this.fadeInCurrent < this.fadeIn) {
        this.fadeInCurrent += dt
        if (this.fadeInCurrent > this.fadeIn)
          this.fadeInCurrent = this.fadeIn
        this.alpha = this.fadeInCurrent / this.fadeIn
      }
    }
  },
  components: {
    Girl,
    Cloud,
    SoundToggle,
    PlayButton,
    LangButton
  }
}
</script>
