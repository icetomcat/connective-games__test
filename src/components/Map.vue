<template>
<div>
  <!-- game field -->
  <template v-for="(row, i) in map">
    <template v-for="(symbol, j) in row" v-if="symbol > 0">
      <Sprite :image="provider.images['jewels']" :sx='660' :sy='761' :sWidth='65' :sHeight='65' :x='offsetX + j * 50' :y='offsetY + i * 50' :width='50' :height='50'></Sprite>
    </template>
  </template>

  <template v-for="(row, i) in map">
    <template v-for="(symbol, j) in row" v-if="symbol > 0">
      <Animation :ref="`animation_${i}_${j}`" :origin="[offsetX + j * 50 + 5 + 20, offsetY + i * 50 + 5 + 20]">
        <Sprite v-on:drag="drag($event, i, j)" :image="provider.images['jewels']" :sx='symbolSprites[symbol-1].x' :sy='symbolSprites[symbol-1].y' :sWidth='symbolSprites[symbol-1].width' :sHeight='symbolSprites[symbol-1].height' :x='offsetX + j * 50 + 5'
          :y='offsetY + i * 50 + 5' :width='40' :height='40'></Sprite>
        <!-- <Label :x='offsetX + j * 50 + 5' :y='offsetY + i * 50 + 5' textAlign="left" textBaseline="top" font="bold 30px Areal" :text="symbol+''" color="#000"></Label> -->
      </Animation>
    </template>
  </template>
  <!-- timer + score -->
  <Sprite :image="provider.images['game']" :sx='351' :sy='144' :sWidth='295' :sHeight='80' :x='canvasWidth - 295' :y='canvasHeight - 80' :width='295' :height='80'></Sprite>
  <Label :x="canvasWidth - 232" :y="canvasHeight - 50" textAlign="center" textBaseline="middle" font="italic 20px Areal" :text="$t('map.time-left')" color="#7b5521"></Label>
  <Label :x="canvasWidth - 232" :y="canvasHeight - 25" textAlign="center" textBaseline="middle" font="bold 26px Areal" :text="timeLabel" color="#7b5521"></Label>
  <Label :x="canvasWidth - 90" :y="canvasHeight - 50" textAlign="center" textBaseline="middle" font="italic 20px Areal" :text="$t('map.score')" color="#7b5521"></Label>
  <Label :x="canvasWidth - 90" :y="canvasHeight - 25" textAlign="center" textBaseline="middle" font="bold 26px Areal" :text="score+''" color="#7b5521"></Label>
  <!-- pause menu -->
  <Buffer :width="canvasWidth" :height="canvasHeight">
    <div v-if="isPaused || isResults">
      <FilledRect :x="0" :y="0" :width="canvasWidth" :height="canvasHeight" color="rgba(0,0,0,0.5)"></FilledRect>
      <ContinueButton v-if="isPaused" :x='canvasWidth / 2 - 103' :y='canvasHeight - 96 * 3' :width='206' :height='96'></ContinueButton>
      <Label v-if="isResults" :x="canvasWidth / 2" :y="canvasHeight / 2" textAlign="center" textBaseline="middle" font="bold 70px Areal" :text="$tc('map.result', score)" color="#fff"></Label>
      <PlayButton v-if="isResults" :x='canvasWidth / 2 - 103' :y='canvasHeight - 96 * 3' :width='206' :height='96'></PlayButton>
      <MenuButton :x='canvasWidth / 2 - 103' :y='canvasHeight - 96 * 2' :width='206' :height='96'></MenuButton>
    </div>
  </Buffer>
  <SoundToggle :x='10' :y='50' :width='50' :height='50'></SoundToggle>
  <LangButton :x='70' :y='50' :width='50' :height='50'></LangButton>
  <PauseButton v-if="!isResults" :x='130' :y='50' :width='50' :height='50'></PauseButton>
  <slot></slot>
</div>
</template>

<script>
import {
  mapState,
} from 'vuex'
import Base from '@/components/Base.vue'
import SoundToggle from '@/components/SoundToggle.vue'
import LangButton from '@/components/LangButton.vue'
import ContinueButton from '@/components/ContinueButton.vue'
import PauseButton from '@/components/PauseButton.vue'
import MenuButton from '@/components/MenuButton.vue'
import Sprite from '@/components/Sprite.vue'
import Label from '@/components/Label.vue'
import FilledRect from '@/components/FilledRect.vue'
import Buffer from '@/components/Buffer.vue'
import Animation from '@/components/Animation.vue'
import PlayButton from '@/components/PlayButton.vue'
import _ from 'lodash'
import {
  Map
} from '@/store/game.js'
let symbolSprites = [{
    x: 447,
    y: 432,
    width: 56,
    height: 56
  },
  {
    x: 447,
    y: 496,
    width: 56,
    height: 56
  },
  {
    x: 518,
    y: 5,
    width: 56,
    height: 56
  },
  {
    x: 518,
    y: 71,
    width: 56,
    height: 56
  },
  {
    x: 518,
    y: 137,
    width: 56,
    height: 56
  },
  {
    x: 518,
    y: 203,
    width: 56,
    height: 56
  },
  {
    x: 518,
    y: 268,
    width: 56,
    height: 56
  }
]

export default {
  extends: Base,
  name: 'Map',
  data() {
    return {
      buffer: null,
      symbolSprites: symbolSprites,
      waiting: false
    }
  },
  computed: {
    offsetX() {
      return (this.canvasWidth - this.map[0].length * 50) / 2
    },
    offsetY() {
      return (this.canvasHeight - this.map.length * 50) / 2
    },
    isPaused() {
      return this.status === this.provider.game.STATUS_PAUSED
    },
    isResults() {
      return this.status === this.provider.game.STATUS_RESULTS
    },
    timeLabel() {
      return Math.floor(this.time / 60) + ':' + (this.time % 60 + '').padStart(2, '0')
    },
    ...mapState('game', [
      'status',
      'settings',
      'map',
      'score',
      'time',
      'mapSettings'
    ])
  },
  methods: {
    created() {
      this.buffer = this.createBuffer()
    },
    mounted() {
      this.provider.audios['gameMusic'].loop = true
      this.provider.audios['gameMusic'].currentTime = 0
      this.provider.eventBus.$emit('playAudio', this.provider.audios['gameMusic'])
    },
    beforeDestroy() {
      this.provider.eventBus.$emit('stopAudio', this.provider.audios['gameMusic'])
    },
    afterRender(ctx) {
      ctx.restore()
    },
    render(ctx) {
      ctx.save()
    },
    animateReduce() {
      let promises = []
      let combinations = Map.findAllCombinations(this.map)
      for (let combination of combinations) {
        for (let position of combination) {
          promises.push(this.$refs[`animation_${position[0]}_${position[1]}`][0].transition({
            scale: [1.0, 1.0],
            alpha: 1.0
          }, {
            scale: [0.15, 0.15],
            alpha: 0.0
          }, 0.25))
        }
      }
      this.provider.audios['ballonpop'].currentTime = 0
      this.provider.eventBus.$emit('playAudio', this.provider.audios['ballonpop'])
      return Promise.all(promises).then(() => {
        this.$store.dispatch('game/reduceMap')
        let normalizedMap = Map.normalize(_.cloneDeep(this.map))
        promises = []
        for (let j = 0; j < this.map[0].length; j++) {
          let offset = 0
          for (let i = this.map.length - 1; i >= 0; i--) {
            if (this.map[i][j] === 0 && offset === 0) {
              offset++
            }
            if (offset > 0) {
              for (let k = i - 1; k >= 0; k--) {
                if (offset >= this.map.length - 1) {
                  break
                }
                if (this.map[k][j] === -1 && offset > 0) {
                  offset++
                }
                if (this.map[k][j] === 0) {
                  offset++
                }
                if (this.map[k][j] > 0) {
                  break
                }
              }
            }
            if (this.map[i][j] >= 0 && offset > 0) {
              let pipe = null
              if (normalizedMap[i][j] !== 0) {
                pipe = [
                  [{
                    translate: [0, -50 * offset]
                  }, {
                    translate: [0, 0]
                  }, 0.15],
                  [{
                    scale: [1.0, 1.0]
                  }, {
                    scale: [1.2, 0.8]
                  }, 0.15],
                  [{
                    scale: [1.2, 0.8]
                  }, {
                    scale: [0.8, 1.2]
                  }, 0.15],
                  [{
                    scale: [0.8, 1.2]
                  }, {
                    scale: [1.0, 1.0]
                  }, 0.15, true]
                ]
              } else {
                pipe = [
                  [{
                    scale: [0.15, 0.15],
                    alpha: 0
                  }, {
                    scale: [1.2, 1.2],
                    alpha: 1
                  }, 0.35],
                  [{
                    scale: [1.2, 1.2]
                  }, {
                    scale: [0.8, 0.8]
                  }, 0.15],
                  [{
                    scale: [0.8, 0.8]
                  }, {
                    scale: [1.0, 1.0]
                  }, 0.15, true]
                ]
              }
              promises.push(this.$refs[`animation_${i}_${j}`][0].transitionPipe(pipe))
            }
          }
        }
        this.$store.dispatch('game/normalizeMap')
        this.$store.dispatch('game/regenerateMap')
        return Promise.all(promises).then(() => {
          if (Map.findAllCombinations(this.map).length > 0) {
            return this.animateReduce()
          }
        })
      })
    },
    drag(event, i, j) {
      if (this.waiting) {
        return
      }
      let direction = [0, 0]
      if (event.dragX > 5) {
        direction = [1, 0]
      } else if (event.dragX < -5) {
        direction = [-1, 0]
      } else if (event.dragY > 5) {
        direction = [0, 1]
      } else if (event.dragY < -5) {
        direction = [0, -1]
      }
      if ((direction[0] || direction[1]) && this.$refs[`animation_${i + direction[1]}_${j + direction[0]}`]) {
        let animation1 = this.$refs[`animation_${i}_${j}`][0]
        let animation2 = this.$refs[`animation_${i + direction[1]}_${j + direction[0]}`][0]
        this.waiting = true
        animation1.transition({
          translate: [0, 0]
        }, {
          translate: [50 * direction[0], 50 * direction[1]]
        }, 0.15, true)
        animation2.transition({
          translate: [0, 0]
        }, {
          translate: [-50 * direction[0], -50 * direction[1]]
        }, 0.15, true).then(() => {
          if (Map.checkMove(this.map, j, i, j + direction[0], i + direction[1])) {
            this.$store.dispatch('game/swipeMapSymbols', [i, j, i + direction[1], j + direction[0]])
            return this.animateReduce().then(() => {
              let promises = []
              let hasMove = Map.hasMove(this.map)
              if (!hasMove) {
                for (let i = 0; i < this.map.length; i++) {
                  for (let j = 0; j < this.map[i].length; j++) {
                    if (this.map[i][j] > 0) {
                      promises.push(this.$refs[`animation_${i}_${j}`][0].transition({
                        scale: [1.0, 1.0],
                        alpha: 1.0
                      }, {
                        scale: [0.15, 0.15],
                        alpha: 0.0
                      }, 0.25))
                    }
                  }
                }
              }
              return Promise.all(promises).then(() => {
                if (!hasMove) {
                  promises = []
                  this.$store.dispatch('game/generateMap')
                  for (let i = 0; i < this.map.length; i++) {
                    for (let j = 0; j < this.map[i].length; j++) {
                      if (this.map[i][j] > 0) {
                        promises.push(this.$refs[`animation_${i}_${j}`][0].transition({
                          scale: [0.15, 0.15],
                          alpha: 0.0
                        }, {
                          scale: [1.0, 1.0],
                          alpha: 1.0
                        }, 0.25))
                      }
                    }
                  }
                }
                return Promise.all(promises)
              })
            })
          } else {
            animation1.transition({
              translate: [50 * direction[0], 50 * direction[1]]
            }, {
              translate: [0, 0]
            }, 0.15, true)
            return animation2.transition({
              translate: [-50 * direction[0], -50 * direction[1]]
            }, {
              translate: [0, 0]
            }, 0.15, true)
          }
        }).then(() => {
          this.waiting = false
        })
      }
    }
  },
  components: {
    SoundToggle,
    LangButton,
    ContinueButton,
    PauseButton,
    MenuButton,
    Sprite,
    Label,
    FilledRect,
    Buffer,
    Animation,
    PlayButton
  }
}
</script>
