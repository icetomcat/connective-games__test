import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import {GameModule} from '@/store/game.js'
import _ from 'lodash'

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: 'cg-test',
  storage: sessionStorage,
  modules: ['game']
})

export default new Vuex.Store({
  modules: {
    game: GameModule
  },
  plugins: [vuexPersist.plugin]
})
