<template>
<div class="horizontal-feed" v-if="hasFeeds">

	<div class="header">
		<span>{{ header }}</span>
	</div>

	<div class="body">
		<div>
			<p>
				<a href="#">Titile <span>Content</span></a>
			</p>
		</div>
		<div class="cover"></div>
	</div>

	<div class="buttons">
		<span class="previous">
			<i class="fa fa-angle-left"></i>
		</span>
		<span class="play">
			<i class="fa fa-play"></i>
		</span>
		<span class="next">
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
		},
		swap() {

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
	}
};
</script>