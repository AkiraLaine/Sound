<style scoped>
	.title, .artist {
		color: white;
		text-align: center;
	}
	i.search {
		position: absolute;
		top: 20px;
		right: 10px;
		cursor: pointer;
		height: 24px;
	}
	img {
		width: 305px;
		margin-bottom: 10px;
	}
	.title {
		font-size: 1.4em;
	}
	.artist {
		font-size: 0.9em;
		color: #EF4836;
		text-transform: uppercase;
	}
	#progress {
		clear: both;
		width: 100%;
		margin: 0 auto;
		margin-bottom: -6px;
		height: 2px;
		background-color: #7f8c8d;
	}
	#bar {
		width: 2px;
		height: 10px;
		background-color: #EF4836;
    margin-bottom: 10px;
    transition: margin-left 1s ease; 
	}
	#duration {
		color: white;
    font-size: 0.7em;
    margin-bottom: 5px;
    float: right;
    margin-right: 5px;
	}
</style>

<template>
	<i class="material-icons search" @click="openSearch()">search</i>
	<div id="player"></div>
	<div>
		<p id="duration">{{remainingDuration}}/{{totalDuration}}</p>
		<div id="progress"></div>
		<div id="bar"></div>			
	</div>
	<p class="title">{{title}}</p>
	<p id="artist" class="artist">{{artist}}</p>
</template>

<script>
	let player, interval;

	export default {
		ready() {
			let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      setTimeout(() => {
        this.onYouTubeIframeAPIReady();
      }, 2000)
		},
		data () {
			return {
				src: "http://placehold.it/305x305",
				title: "Title",
				artist: "Artist",
				totalDuration: "00:00",
				remainingDuration: "00:00",
				totalSeconds: 0
			}
		},
		methods: {
			openSearch () {
				document.getElementById("app").style.transform = "translateX(-305px)";
				window.scrollTo(0,0);
			},
			onYouTubeIframeAPIReady () {
        player = new YT.Player('player', {
          height: '305',
          width: '305',
          playerVars: {iv_load_policy: 3, showinfo: 0, fs: 0, controls: 0, rel: 0},
          events: {
            'onReady': (event) => event.target.playVideo(),
            'onStateChange': (event) => {}
          }
        });
      },
      addZero (num) {
      	if (num < 10) num = `0${num}`;
      	return num;
      },
      convertYTDurationToS(duration) {
			  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

			  // let hours = (parseInt(match[1]) || 0);
			  let minutes = (parseInt(match[2]) || 0);
			  let seconds = (parseInt(match[3]) || 0);

			  this.totalSeconds = minutes * 60 + seconds;
			  return this.totalSeconds;
			},
			formatTime (totalSeconds) {
				console.log(totalSeconds)
				let minutes = 0;
				let seconds = 0;
				if (totalSeconds > 60) {
					minutes = Math.floor(totalSeconds / 60);
					seconds = totalSeconds - (Math.floor(totalSeconds / 60) * 60);
				} else if (totalSeconds === 60) {
					minutes = 1;
					seconds = 0;
				} else {
					minutes = 0;
					seconds = totalSeconds;
				}
				console.log(minutes, seconds)
				return `${this.addZero(minutes)}:${this.addZero(seconds)}`;
			},
      loadVideoById (title, channel, id) {
      	clearInterval(interval)
      	document.getElementById("bar").style.marginLeft = ""
      	this.$http.get("https://www.googleapis.com/youtube/v3/videos?id=" + id + "&key=AIzaSyCdW-Y9dlblgcMUQmvSAsdqfF9HSjKVvXE&part=contentDetails")
					.then(data => {
						console.log(data);
						if (data !== undefined) { 
							this.totalDuration = this.formatTime(this.convertYTDurationToS(data.data.items[0].contentDetails.duration));
							this.animateProgressBar();
						}
					})	
      	this.title = title;
      	this.artist = channel;
      	player.loadVideoById(id)
      },
      animateProgressBar () {
      	let s = 0;
      	let substract = false
      	const bar = document.getElementById("bar");
      	const totalProgressWidth = 304	;
      	let diff = Number(totalProgressWidth / this.totalSeconds) 
      	interval = setInterval(() => {
      		if(Number(bar.style.marginLeft.split("px")[0]) >= totalProgressWidth) {
						clearInterval(interval);
						bar.style.marginLeft = ""
						return false;
					}
					this.remainingDuration = this.formatTime(s++)
					let spaceToMove = Number(document.getElementById("bar").style.marginLeft.split("px")[0]) + diff;
					bar.style.marginLeft = spaceToMove + "px"; 
      	}, 1000)
      }
		}
	}
</script>