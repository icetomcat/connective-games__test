<template>
  <div>
    <p v-on:click="changeLocale">{{ $t('message') }}</p>
    <div class="locale-changer">
      <select v-model="$i18n.locale">
        <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ $t(lang) }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  name: 'HelloI18n',
  data () {
    return { langs: ['ru', 'en'] }
  },
  methods: {
    changeLocale() {
      Vue.$i18n.locale = 'ru';
    }
  }
}
</script>
