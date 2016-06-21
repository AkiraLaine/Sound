<style>
	* {
		margin: 0;
		padding: 0; 
	}

	body {
		font-family: "Lato";
    background-color: #1f2a35;
    overflow-x: hidden;
  }

  #app {
    transition: transform 0.4s ease;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>

<template>
  <div id="app">
    <player v-ref:player></player>
    <search></search>
  </div>
</template>

<script>
	import Search from './MainView/Search';
  import Player from './MainView/Player'

  export default {
  	components: {
  		Search,
      Player
  	}
 	}
</script>
