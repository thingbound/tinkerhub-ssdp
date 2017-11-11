# SSDP browser

This library is a simple SSDP browser based on [node-ssdp](https://github.com/diversario/node-ssdp/)
that will track when devices become available and when they are no longer
available.

```javascript
const browser = require('tinkerhub-ssdp').browser('ssdp:all');
browser.on('available', service => console.log('Service available', service));
browser.on('unavailable', service => console.log('Service unavailable', service));

// Filter and map services
browser.filter(service => service.headers['HUE-BRIDGEID'])
  .map(service => {
    // Change the identifier being tracked
    service.id = service.headers['HUE-BRIDGEID'];
    return service;
  });

// Start discovering services
browser.start();

// Stop discovering services
browser.stop();
```
