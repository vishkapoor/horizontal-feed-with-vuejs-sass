<template>
<div class="horizontal-feed" v-if="hasFeeds">

	<div class="header">
		<span>{{ header }}</span>
	</div>

	<div class="body" 
		:class="swappingClass" 
		@mouseout="resume()" 
		@mouseover="pause()">
		<div>
			<p v-for="(feed, index) in feeds" :class="activeClass(index)">
				<a :href="feed.href"> {{ feed.title }} <span>{{ feed.body }}</span></a>
			</p>
		</div>
		<div class="cover"></div>
	</div>

	<div class="buttons">
		<span 
			@click="goPrevious()"
			class="previous">
			<i class="fa fa-angle-left"></i>
		</span>
		<span 
			@click="play()"
			:class="playClass"
			class="play">
			<i class="fa fa-play"></i>
		</span>
		<span 
			@click="goNext()"
			class="next">
			<i class="fa fa-angle-right"></i>
		</span>
	</div>
</div>
</template>
<script>
export default {
	name: 'Feed',
	props: {
		duration: {
			type: Number,
			required: false,
			default: 7000,
		},
		header: {
			type: String,
			required: true
		},
		collection: {
			type: [Array, String],
			required: true
		}
	},
	data() {
		return {
			feeds: [],
			max: 0,
			hasFeeds: false,
			currentIndex: 0,
			interval: null,
			paused: false,
			swapping: false,
		}
	},
	mounted() {
		if(this.duration <= 2000) {
			throw new Error('Duration must be higher 2000');
		} 

		if(typeof this.collection === 'string') {
			this.getFeeds();
		} else {
			this.feeds = this.collection;
		}
	},
	methods: {
		initialize() {
			if(!this.feeds.length) {
				return;
			}
			 this.max = this.feeds.length - 1;
			 this.hasFeeds = true;
			 this.swap();
		},
		activeClass(index) {
			return {
				'active': index === this.currentIndex
			}
		},
		swap() {
			this.interval = window.setInterval(() => {
				if(!this.paused) {
					this.nextSlide();
				}
			}, this.duration);	
		},
		previousSlide() {
			this.progress('previous');
		},
		nextSlide() {
			this.progress('next');
		},
		progress(direction) {
			this.swapping = true;
			window.setTimeout(() => {
				this.currentIndex = this[direction]();
				this.swapping = false;
			}, 1000);
		},
		next() {
			if(this.currentIndex === this.max) {
				return 0;
			}
			return this.currentIndex + 1;
		},
		previous() {
			if(this.currentIndex === 0) {
				return this.max;
			}
			return this.currentIndex - 1;
		},
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		},
		goPrevious() {
			this.stop();
			this.previousSlide();
		},
		goNext() {
			this.stop();
			this.nextSlide();
		},
		stop() {
			window.clearInterval(this.interval);
			this.interval = null;
		},
		play() {
			if(this.interval) {
				return;
			}
			this.swap();
		},
		getFeeds() {
			if(_.isEmpty(this.collection)) {
				throw new Error('Invalid endpoint');
			}
			window.axios.get(this.collection)
				.then(response => {
					this.feeds = response.data;
					this.initialize();
				})
				.catch(e => {
					throw new Error(e);
				})
		}
	},
	computed: {
		feedsLength() {
			return this.feeds.length;
		},
		swappingClass() {
			return {
				swapping: this.swapping
			}
		},
		playClass() {
			return {
				'active': !this.interval
			}
		}
	}
};
</script>