<template>
<div id="app">
  <router-view />
</div>
</template>

<style lang="less">
html, body {
  margin: 0;
}
body {
  width: 100vw;
  height: 100vh;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    width: 100%;
    background-image: url('assets/bg_pattern.png');
}
</style>
