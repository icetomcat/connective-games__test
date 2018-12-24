import Vue from 'vue'
import _ from 'lodash'

export const Game = {
  STATUS_INITIAL: 0,
  STATUS_PAUSED: 1,
  STATUS_PLAY: 2,
  STATUS_RESULTS: 3
}

let initialState = {
  settings: {
    soundMuted: false,
    soundVolume: 1.0,
    locale: process.env.VUE_APP_I18N_LOCALE || 'ru'
  },
  score: 0,
  time: 0,
  status: Game.STATUS_INITIAL,
  mapSettings: {},
  map: [
    []
  ]
}

let defaultMapSettings = {
  time: 120,
  map: {
    template: [
      [-1, 0, -1, 0, -1, 0, -1],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, -1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [-1, 0, -1, 0, -1, 0, -1]
    ],
    symbols: 3
  }
}

export const Map = {
  reduce(map) {
    let scores = 0
    let combinations = this.findAllCombinations(map)
    for (let combination of combinations) {
      for (let position of combination) {
        map[position[0]][position[1]] = 0
        scores++
      }
    }
    return scores
  },
  normalize(map) {
    for (let j = 0; j < map[0].length; j++) {
      for (let i = 0; i < map.length; i++) {
        if (map[i][j] === 0) {
          let k = i
          while (k > 0) {
            let m = k - 1
            while (m >= 0 && map[m][j] === -1) {
              m--
            }
            if (m < 0) {
              break
            }
            map[k][j] = map[m][j]
            map[m][j] = 0
            k = m
          }
        }
      }
    }
    return map
  },
  regenerate(map, symbols) {
    if (!symbols) {
      return
    }
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === 0) {
          map[i][j] = _.random(1, symbols)
        }
      }
    }
  },
  findAllCombinations(map) {
    let combinations = []
    let line = []
    for (let i = 0; i < map.length; i++) {
      line = []
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] <= 0) {
          if (line.length > 2) {
            combinations.push(line)
          }
          line = []
          continue
        }
        line.push([i, j, map[i][j]])
        if (line[0][2] !== map[i][j]) {
          line.pop()
          if (line.length > 2) {
            combinations.push(line)
          }
          line = [
            [i, j, map[i][j]]
          ]
        }
      }
      if (line.length > 2) {
        combinations.push(line)
      }
    }
    for (let j = 0; j < map[0].length; j++) {
      line = []
      for (let i = 0; i < map.length; i++) {
        if (map[i][j] <= 0) {
          if (line.length > 2) {
            combinations.push(line)
          }
          line = []
          continue
        }
        line.push([i, j, map[i][j]])
        if (line[0][2] !== map[i][j]) {
          line.pop()
          if (line.length > 2) {
            combinations.push(line)
          }
          line = [
            [i, j, map[i][j]]
          ]
        }
      }
      if (line.length > 2) {
        combinations.push(line)
      }
    }
    return combinations
  },
  checkMove(map, x1, y1, x2, y2) {
    if ((y2 < 0 || map.length <= y2) || (x2 < 0 || map[y2].length <= x2) || map[y2][x2] <= 0 || map[y1][x1] <= 0) {
      return false
    }
    let tmp = map[y1][x1]
    map[y1][x1] = map[y2][x2]
    map[y2][x2] = tmp
    let result = !this.checkSymbol(map, x1, y1) || !this.checkSymbol(map, x2, y2)
    map[y2][x2] = map[y1][x1]
    map[y1][x1] = tmp
    return result
  },
  hasMove(map) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (this.checkMove(map, j, i, j + 1, i) || this.checkMove(map, j, i, j, i + 1) || this.checkMove(map, j, i, j - 1, i) || this.checkMove(map, j, i, j, i - 1)) {
          return true
        }
      }
    }
    return false
  },
  checkSymbol(map, x, y) {
    let checked = 0
    let symbol = map[y][x]
    if (x - 2 >= 0) {
      for (let k = x - 2; k < x; k++) {
        if (map[y][k] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }
    if (x + 2 < map[y].length) {
      for (let k = x + 1; k < x + 3; k++) {
        if (map[y][k] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }
    if (y - 2 >= 0) {
      for (let k = y - 2; k < y; k++) {
        if (map[k][x] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }
    if (y + 2 < map.length) {
      for (let k = y + 1; k < y + 3; k++) {
        if (map[k][x] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }
    if (y + 1 < map.length && y - 1 >= 0) {
      for (let k = y - 1; k < y + 2; k++) {
        if (map[k][x] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }
    if (x + 1 < map[y].length && x - 1 >= 0) {
      for (let k = x - 1; k < x + 2; k++) {
        if (map[y][k] !== symbol) {
          checked++
          break
        }
      }
    } else {
      checked++
    }

    return checked < 6 ? false : true
  },

  generate(template, symbols) {
    let map = _.cloneDeep(template)
    do {
      for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
          if (map[i][j] >= 0) {
            map[i][j] = _.random(1, symbols)
            while (!this.checkSymbol(map, j, i)) {
              map[i][j] = map[i][j] % symbols + 1
            }
          }
        }
      }
    } while (!this.hasMove(map))
    return map;
  }
}

let gameTimer = null

export const GameModule = {
  namespaced: true,
  state: Vue.util.extend({}, initialState),
  mutations: {
    reset(state) {
      Object.assign(state, Vue.util.extend({}, initialState))
    },
    incScore(state, score) {
      state.score += score
      if (state.score > 200) {
        state.mapSettings.map.symbols = 7
      } else if (state.score > 150) {
        state.mapSettings.map.symbols = 6
      } else if (state.score > 100) {
        state.mapSettings.map.symbols = 5
      } else if (state.score > 50) {
        state.mapSettings.map.symbols = 4
      }
    },
    setScore(state, score) {
      state.score = score
    },
    decTime(state) {
      state.time--
    },
    setTime(state, time) {
      state.time = time
    },
    setMap(state, map) {
      state.map = map
    },
    setStatus(state, status) {
      state.status = status
    },
    toggleSound(state) {
      state.settings.soundMuted = !state.settings.soundMuted
    },
    setSoundVolume(state, volume) {
      state.settings.soundVolume = volume
    },
    setLocale(state, locale) {
      state.settings.locale = locale
    },
    setMapSettings(state, mapSettings) {
      state.mapSettings = mapSettings
    }
  },
  actions: {
    newGame(context, settings) {
      settings = Vue.util.extend(_.cloneDeep(defaultMapSettings), settings)
      // context.commit('reset')
      context.commit('setTime', settings.time)
      context.commit('setScore', 0)
      context.commit('setMapSettings', settings)
      context.commit('setMap', Map.generate(settings.map.template, settings.map.symbols))
      context.dispatch('continue')
    },
    toggleSound(context) {
      context.commit('toggleSound')
    },
    setSoundVolume(context, volume) {
      context.commit('setSoundVolume', volume)
    },
    continue (context) {
      if (context.state.time <= 0) {
        return
      }
      if (!gameTimer) {
        gameTimer = setInterval(() => {
          if (context.state.time <= 0) {
            context.dispatch('results')
          } else {
            context.commit('decTime')
          }
        }, 1000)
      }
      context.commit('setStatus', Game.STATUS_PLAY)
    },
    pause(context) {
      if (gameTimer) {
        clearInterval(gameTimer)
        gameTimer = null
      }
      context.commit('setStatus', Game.STATUS_PAUSED)
    },
    menu(context) {
      if (gameTimer) {
        clearInterval(gameTimer)
        gameTimer = null
      }
      context.commit('setStatus', Game.STATUS_INITIAL)
    },
    results(context) {
      if (gameTimer) {
        clearInterval(gameTimer)
        gameTimer = null
      }
      context.commit('setStatus', Game.STATUS_RESULTS)
    },
    reduceMap(context) {
      let score = Map.reduce(context.state.map)
      context.commit('setMap', context.state.map)
      context.commit('incScore', score)
      return score
    },
    normalizeMap(context) {
      Map.normalize(context.state.map)
      context.commit('setMap', context.state.map)
    },
    regenerateMap(context) {
      Map.regenerate(context.state.map, context.state.mapSettings.map.symbols)
      context.commit('setMap', context.state.map)
    },
    generateMap(context) {
      context.commit('setMap', Map.generate(context.state.mapSettings.map.template, context.state.mapSettings.map.symbols))
    },
    swipeMapSymbols(context, positions) {
      if (!context.state.map[positions[2]][positions[3]]) {
        return
      }
      if (context.state.map[positions[2]][positions[3]] <= 0) {
        return
      }
      if (Map.checkMove(context.state.map, positions[1], positions[0], positions[3], positions[2])) {
        let tmp = context.state.map[positions[0]][positions[1]]
        context.state.map[positions[0]][positions[1]] = context.state.map[positions[2]][positions[3]]
        context.state.map[positions[2]][positions[3]] = tmp
        context.commit('setMap', _.cloneDeep(context.state.map))
      }
    }
  }
}
