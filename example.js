'use strict';

const browser = require('./lib').browser('ssdp:all');

browser.on('available', d => console.log('available', d));
browser.on('unavailable', d => console.log('unavailable', d));
