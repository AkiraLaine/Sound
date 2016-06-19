<style>
	#video {
		width: auto;
		display: none;
	}
</style>

<template>
	<div id="video"></div>
</template>

<script>
	let video;

	export default {
		ready() {
			let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      setTimeout(() => {
        this.onYouTubeIframeAPIReady();
      }, 1000)
		},
		methods: {
  		onYouTubeIframeAPIReady () {
        video = new YT.Player('video', {
          height: '390',
          width: '640',
          events: {
            'onReady': (event) => event.target.playVideo(),
            'onStateChange': (event) => {}
          }
        });
      },
      loadVideoById (id) {
      	player.loadVideoById(id)
      }
  	}
	}
</script>