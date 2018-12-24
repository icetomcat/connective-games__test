<template>
<div>
  <canvas :width="width" :height="height" class="canvas" ref="canvas" v-on:touchstart="touchstart" v-on:mousemove="onMouseMove" v-on:mousedown="onMouseDown" v-on:mouseup="onMouseUp" v-on:click="onClick"></canvas>
  <Sprite :image="bgImage" :x="0" :y="0" :width="width" :height="height"></Sprite>
  <div v-if="loading">
    <Loading :total="totalProgress" :current="progress" v-on:ready="ready"></Loading>
  </div>
  <div v-if="!loading">
    <div v-if="!isInGame">
      <Menu></Menu>
    </div>
    <div v-if="isInGame">
      <Map></Map>
    </div>
  </div>
</div>
</template>

<script>
import images from '@/images.json'
import audios from '@/audios.json'
import {
  Game
} from '@/store/game.js'
import {
  mapState
} from 'vuex'
import Vue from 'vue'
import Menu from '@/components/Menu.vue'
import Map from '@/components/Map.vue'
import Loading from '@/components/Loading.vue'
import Sprite from '@/components/Sprite.vue'
import _ from 'lodash'

export default {
  name: 'game',
  data() {
    return {
      dt: 0,
      time: 0,
      timer: null,
      loading: true,
      progress: 0,
      totalProgress: 0,
      langs: ['ru', 'en'],
      width: 480,
      height: 800,
      provider: {
        game: Game,
        images: [],
        audios: [],
        context: null,
        eventBus: new Vue()
      }
    }
  },
  computed: {
    isInGame() {
      return this.status === this.provider.game.STATUS_PLAY || this.status === this.provider.game.STATUS_PAUSED || this.status === this.provider.game.STATUS_RESULTS
    },
    bgImage() {
      return this.isInGame ? this.provider.images['game-bg'] : this.provider.images['menu-bg']
    },
    ...mapState('game', [
      'status',
      'settings',
    ])
  },
  created() {
    var context = require.context('@/assets/', true, /^\.\//)
    this.$i18n.locale = this.settings.locale
    if (this.status !== Game.STATUS_INITIAL && this.status !== Game.STATUS_RESULTS) {
      this.pause()
    }
    for (let i in images) {
      this.totalProgress++
      let image = new Image()
      image.onload = () => this.progress++
      image.src = context(images[i])
      this.provider.images[i] = image
    }
    for (let i in audios) {
      this.totalProgress++
      let audio = new Audio(context(audios[i]))
      // audio.muted = this.settings.soundMuted
      audio.volume = this.settings.soundMuted ? 0 : this.settings.soundVolume
      this.provider.audios[i] = audio
      this.progress++
    }

    this.provider.eventBus.$on('update', this.update)
    this.provider.eventBus.$on('render', this.render)
    this.provider.eventBus.$on('playAudio', this.playAudio)
    this.provider.eventBus.$on('stopAudio', this.stopAudio)
    this.provider.eventBus.$on('toggleSound', this.toggleSound)
    this.provider.eventBus.$on('toggleLang', this.toggleLang)
    this.provider.eventBus.$on('newGame', this.newGame)
    this.provider.eventBus.$on('pause', this.pause)
    this.provider.eventBus.$on('continue', this.continue)
    this.provider.eventBus.$on('menu', this.menu)

    setInterval(() => {
      let now = Date.now() / 1000.0
      this.dt = now - this.time
      this.time = now
      this.provider.eventBus.$emit('update', this.dt)
    }, 33)
    setInterval(() => this.provider.eventBus.$emit('render'), 33)
  },
  beforeDestroy() {
    this.provider.eventBus.$off('update', this.update)
    this.provider.eventBus.$off('render', this.render)
    clearInterval(this.timer)
  },
  provide() {
    return {
      provider: this.provider
    }
  },
  mounted() {
    this.provider.context = this.$refs['canvas'].getContext('2d')
    this.provider.context.imageSmoothingEnabled = true;
    this.$refs['canvas'].addEventListener("touchstart", this.touchstart, false);
    this.$refs['canvas'].addEventListener("touchend", this.touchend, false);
    this.$refs['canvas'].addEventListener("touchcancel", this.touchcancel, false);
    this.$refs['canvas'].addEventListener("touchmove", this.touchmove, false);
  },
  methods: {
    render() {
      this.provider.context.clearRect(0, 0, this.width, this.height)
      for (let i in this.$children) {
        this.$children[i].__render(this.provider.context)
      }
    },
    update() {

    },
    inc() {
      this.$store.commit('incScore', 1)
    },
    ready() {
      this.loading = false
      this.provider.eventBus.$emit('ready')
    },
    reset() {
      this.$store.dispatch('game/newGame')
    },
    newGame() {
      this.$store.dispatch('game/newGame')
    },
    pause() {
      this.$store.dispatch('game/pause')
    },
    continue () {
      this.$store.dispatch('game/continue')
    },
    menu() {
      this.$store.dispatch('game/menu')
    },
    playAudio(audio) {
      audio.play()
    },
    stopAudio(audio) {
      audio.pause()
    },
    toggleSound() {
      this.$store.dispatch('game/toggleSound')
      for (let audio of Object.values(this.provider.audios)) {
        audio.muted = this.settings.soundMuted
        audio.volume = this.settings.soundVolume
      }
    },
    toggleLang() {
      let index = _.indexOf(this.langs, this.settings.locale)
      if (index >= 0) {
        let locale = this.langs[(index + 1) % this.langs.length]
        this.$i18n.locale = locale
        this.$store.commit('game/setLocale', locale)
      } else {
        console.error('toggleLang error');
      }
    },
    eventPropagation(event) {
      for (let i = this.$children.length - 1; i >= 0; i--) {
        this.$children[i].__event(event)
      }
    },
    onMouseDown(event) {
      this.eventPropagation(event)
    },
    onMouseUp(event) {
      this.eventPropagation(event)
    },
    onMouseMove(event) {
      this.eventPropagation(event)
    },
    onClick(event) {
      this.eventPropagation(event)
    },
    touchstart(event) {
      this.eventPropagation(event)
    },
    touchend(event) {
      this.eventPropagation(event)
    },
    touchmove(event) {
      this.eventPropagation(event)
    },
    touchcancel(event) {
      this.eventPropagation(event)
    }
  },
  components: {
    Menu,
    Map,
    Loading,
    Sprite
  }
}
</script>

<style lang="less" scoped>
.canvas {
    margin: 0 auto;
    max-width: 100vw;
    max-height: calc(100vw/0.6);
    width: 60vh;
    height: 100vh;
    display: block;
    box-shadow: 0 0 calc(1.5vh) rgba(0,0,0,0.75);
}
</style>
