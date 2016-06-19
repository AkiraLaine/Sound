<style scoped>
	i.search {
		position: absolute;
		top: 5px;
		right: 10px;
		cursor: pointer
	}
</style>

<template>
	<div id="player">
		<i class="material-icons search" @click="openSearch()">search</i>
		<img src="http://placehold.it/305x305" />
	</div>
</template>

<script>
	import spotify from 'spotify';

	export default {
		methods: {
			openSearch () {
				document.getElementById("app").style.transform = "translateX(-305px)"
			},
			getMetadata (query) {
				spotify.search({type: "track", query: query}, (err, data) => {
					if (err) console.log(err);
					console.log(data);
				})
			}
		}
	}
</script>