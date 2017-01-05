'use strict';

const Client = require('node-ssdp').Client;
const EventEmitter = require('events').EventEmitter;

class SSDP {
	constructor(searchType, cacheTime) {
		this.searchType = searchType;
		this.cacheTime = (cacheTime || 1800) * 1000;

		this._client = new Client();
		this._client.on('response', this._handleResponse.bind(this));
		this._client.on('advertise-alive', this._handleAlive.bind(this));
		this._client.on('advertise-bye', this._handleBye.bind(this));

		this._devices = {};

		this._events = new EventEmitter();

		this.start();
	}

	on(event, cb) {
		this._events.on(event, cb);
	}

	off(event, cb) {
		this._events.off(event, cb);
	}

	start() {
		if(this._searchHandle) return;

		this._searchHandle = setInterval(this._search.bind(this), this.cacheTime / 3);
		this._removeStaleHandle = setInterval(this._removeStale.bind(this), this.cacheTime);

		this._client.start();
		this._search();
	}

	stop() {
		clearInterval(this._searchHandle);
		clearInterval(this._removeStaleHandle);

		this._searchHandle = null;
		this._removeStaleHandle = null;

		this._client.stop();
	}

	_search() {
		this._client.search(this.searchType);
	}

	_removeStale() {
		const staleTime = Date.now() - this.cacheTime;
		Object.keys(this._devices).forEach(key => {
			const device = this._devices[key];
			if(device.lastSeen < staleTime) {
				device.available = false;
				this._events.emit('unavailable', device);
			}
		})
	}

	_handleResponse(headers, statusCode) {
		if(statusCode != 200) return;

		const id = headers.USN;
		let registration = this._devices[id];
		if(registration) {
			registration.lastSeen = Date.now();
			registration.usn = headers.USN;
			registration.location = headers.LOCATION;
			registration.headers = headers;
		} else {
			registration = this._devices[id] = {
				available: false,
				usn: headers.USN,
				location: headers.LOCATION,
				headers: headers
			};
		}

		if(! registration.available) {
			registration.available = true;

			this._events.emit('available', registration);
		}
	}

	_handleAlive() {
	}

	_handleBye() {
	}

}

module.exports.browser = function(searchType) {
	return new SSDP(searchType);
};
