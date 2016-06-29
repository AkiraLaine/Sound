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
		height: 55px;
		overflow-y: auto;
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
	#volume {
		-webkit-appearance: none;
	  clear: both;
		width: 50%;
		margin: 0 auto;
		margin-bottom: -6px;
		height: 2px;
		background-color: #7f8c8d;
	  outline: none; 
	  display: block;
	  margin: 10px auto;
	}
	#volume::-webkit-slider-thumb {
		-webkit-appearance: none;
	  border: none;
    height: 14px;
    width: 14px;
    border-radius: 50%;
    background: #EF4836;
    cursor: pointer;
   }
   .volume-text {
   	float: right;
    margin-top: -20px;
    color: white;
    margin-right: 31px;
   }
</style>

<template>
	<i class="material-icons search" @click="openSearch()">search</i>
	<div id="player"></div>
	<div id="progres-bar">
		<p id="duration">{{remainingDuration}}/{{totalDuration}}</p>
		<div id="progress"></div>
		<div id="bar"></div>			
	</div>
	<input id="volume" type="range" min="0" max="100" @input="changeVolume()">
	<p class="volume-text">{{volume}}%</p>
	<p id="title" class="title">{{title}}</p>
	<p id="artist" class="artist">{{artist}}</p>
</template>

<script>
	let player, interval, scroll;

	export default {
		ready() {
			let tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			let firstScriptTag = document.getElementsByTagName('script')[0]; 	
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			const title = document.getElementsByClassName('title');

			window.onYouTubeIframeAPIReady = () => {
				player = new YT.Player('player', {
			    height: '305',
			    width: '305',
			    playerVars: {iv_load_policy: 3, showinfo: 0, fs: 0, controls: 0, rel: 0},
			    events: {
			      'onReady': (event) => event.target.playVideo(),
			      'onStateChange': (event) => {
			      	if (event.data === YT.PlayerState.PAUSED) {
			      		clearInterval(interval)
			      	}
			      	if (event.data === YT.PlayerState.PLAYING) {
			      		this.animateProgressBar(player.getCurrentTime())
			      	}
			      }
			    }
			  });
			}
 		},
		data () {
			return {
				src: "http://placehold.it/305x305",
				title: "Title",
				artist: "Artist",
				totalDuration: "00:00",
				remainingDuration: "00:00",
				totalSeconds: 0,
				volume: 50,
				youtube: null
			}
		},
		methods: {
			openSearch () {
				document.getElementById("app").style.transform = "translateX(-305px)";
				window.scrollTo(0,0);
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
				return `${this.addZero(minutes)}:${this.addZero(seconds)}`;
			},
      loadVideoById (title, channel, id) {
      	clearInterval(interval)
      	clearInterval(scroll);
      	document.getElementById("bar").style.marginLeft = ""
      	this.$http.get("https://www.googleapis.com/youtube/v3/videos?id=" + id + "&key=AIzaSyCdW-Y9dlblgcMUQmvSAsdqfF9HSjKVvXE&part=contentDetails")
					.then(data => {
						console.log(data);
						if (data !== undefined) { 
							this.totalDuration = this.formatTime(this.convertYTDurationToS(data.data.items[0].contentDetails.duration));
							// this.animateProgressBar();
						}
					})	
      	this.title = title;
      	this.artist = channel;
      	player.loadVideoById(id)
      	player.setVolume(this.volume);

      	setTimeout(() => {
	      	const t = document.getElementById("title");
					const maxScrollTop = t.scrollHeight - t.clientHeight;
					t.scrollTop = 0;
					scroll = setInterval(() => {
						if (t.scrollTop < maxScrollTop)	t.scrollTop = t.scrollTop + 5;
						else t.scrollTop = 0;
					}, 1000)
				}, 100)
      },
      animateProgressBar (s) {
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
					this.remainingDuration = this.formatTime(Math.round(s++));
					let spaceToMove = Number(document.getElementById("bar").style.marginLeft.split("px")[0]) + diff;
					bar.style.marginLeft = spaceToMove + "px"; 
      	}, 1000)
      },
      changeVolume () {
      	const value = document.getElementById("volume").value;
      	this.volume =  value;
      	player.setVolume(value)
      }
		}
	}
</script>