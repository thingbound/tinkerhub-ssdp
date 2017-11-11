'use strict';

const browser = require('./').browser('ssdp:all')
	// Filter so that only Hue bridges are tracked
	.filter(s => s.headers['HUE-BRIDGEID'])
	// Change the id to the bridge id to avoid duplicates
	.map(s => {
		s.id = s.headers['HUE-BRIDGEID'].toLowerCase();
		return s;
	});

browser.on('available', service => console.log('Service available', service));
browser.on('unavailable', service => console.log('Service unavailable', service));

browser.start();
