<template lang="pug">
  div.test2
    |Vue module?
</template>

<style lang="scss" scoped>
.test2 {
  width: 100px;
  height: 100px;
  background-color: #ff0000;
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
