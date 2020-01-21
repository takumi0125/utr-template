<template lang="pug">
  div.test
    |Vue module
</template>

<style lang="scss" scoped>
.test {
  width: 100px;
  height: 100px;
  background-color: #00ffff;
}
</style>

<script>
module.exports = {
  data: ()=> {
    return {
      test: true,
      test2: false
    }
  }
}
</script>
