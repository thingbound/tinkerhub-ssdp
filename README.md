# SSDP browser

This library is a simple SSDP browser based on [node-ssdp](https://github.com/diversario/node-ssdp/)
that will track when devices become available and when they are no longer
available.

```
const browser = require('tinkerhub-ssdp').browser('ssdp:all');
browser.on('available', function(device) {
	console.log(device);
});

browser.on('unavailable', function(device) {
	console.log('device');
});
```
