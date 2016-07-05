<style>
  @import url(https://fonts.googleapis.com/css?family=Lato:400,700);
  @import url(https://fonts.googleapis.com/css?family=Material+Icons);

  * {
    margin: 0;
    padding: 0;
  }

  i {
  	color: white;
  }

  html,
  body { height: 100%; }
</style>

<template>
  <router-view></router-view>
</template>

<script>
  if (localStorage.getItem("queue") === null) {
    localStorage.setItem("queue", JSON.stringify([]))
  }
</script>
