<style scoped>
	#search {
		transform: translateX(305px);
		/*margin-top: -290px;*/
		/*transition: visibility 0.4s ease;*/
		position: absolute;
		top: 20px;
	}
	input {
		width: 95%;
		height: 50px;
		background-color: #1f2a35;
		border: none;
		border-bottom: 1px solid #7f8c8d;
		outline: none;
		font-size: 1.1em;
		padding: 0 10px;
		color: white;
		/*position: fixed;*/
		z-index: 1;
		margin-top: -60px;
		margin-left: 20px;
	}
	ul {
		margin-top: 10px;
		color: white;
		list-style-type: none;
	}
	li {
		margin-bottom: 10px;
		cursor: pointer;
	}
	li:hover {
		background-color: #2c3e50;
		transition: background-color 0.5s ease; 
	}
	p, h5 {
		padding: 3px 10px;
	}
	p {
		width: 85%;
	}
	h5 {
		color: #EF4836;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	i {
		position: absolute;
    z-index: 2;
    cursor: pointer;
 	}
 	i#plus {
		right: 10px;
 	}
</style>

<template>
	<div id="search">
		<i class="material-icons" @click="returnHome()">keyboard_arrow_left</i>
		<input v-model="query" @keypress.enter="search(query)" placeholder="Search for music..." />
		<ul>
			<li v-for="item in results" @click="fetchSong(item.snippet.title, item.snippet.channelTitle, item.id.videoId)">
				<i id="plus" class="material-icons" @click.stop="addToQueue(item.snippet.title, item.snippet.channelTitle, item.id.videoId, $event)">add</i>
				<p>{{item.snippet.title}}</p>
				<h5>{{item.snippet.channelTitle}}</h5>
			</li>
		</ul>
	</div>
</template>

<script>
	import YouTube from 'youtube-node';
	const youtube = new YouTube(); 
	youtube.setKey("AIzaSyCdW-Y9dlblgcMUQmvSAsdqfF9HSjKVvXE");
	youtube.addParam('type', 'video');
	youtube.addParam('videoCategoryId', '10');

	export default {
		data () {
			return {
				results: [],
				query: ""
			}
		},
		methods: {
			search (query) {
				youtube.search(query, 10, (err, data) => {
					if (err) console.log(err);
					// console.log(data);	
					this.results = data.items;
				})
			},
			fetchSong (title, channel, id) {
				this.$parent.$refs.player.loadVideoById(title, channel, id);
				this.returnHome();
			},
			addToQueue (title, channel, id, e) {
				this.$parent.$refs.player.addToQueue(title, channel, id);
			},
			returnHome () {
				window.scrollTo(0,0);
				document.getElementById("app").style.transform = "translateX(0)";
				this.results = [];
				this.query = "";
			}
		}
	}
</script>