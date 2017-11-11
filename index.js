'use strict';

const util = require('util');
const { TimedDiscovery, search, addService } = require('tinkerhub-discovery');

const Client = require('node-ssdp').Client;

class SSDP extends TimedDiscovery {
	static get type() {
		return 'ssdp';
	}

	constructor(searchType, cacheTime) {
		super({ maxStaleTime: (cacheTime || 1800) * 1000 });

		this.searchType = searchType;

		this._client = new Client();
		this._client.on('response', this._handleResponse.bind(this));
		this._client.on('advertise-alive', this._handleAlive.bind(this));
		this._client.on('advertise-bye', this._handleBye.bind(this));
	}

	start() {
		super.start();

		this._client.start();
	}

	stop() {
		super.stop();

		this._client.stop();
	}

	[search]() {
		this._client.search(this.searchType);
	}

	_handleResponse(headers, statusCode) {
		if(statusCode != 200) return;

		const service = {
			id: headers.USN,
			location: headers.LOCATION,
			headers: headers
		};
		this[addService](service);
	}

	_handleAlive() {
	}

	_handleBye() {
	}

	[util.inspect.custom](depth, options) {
		return options.stylize('SSDP', 'special') + '{type=' + this.searchType + '}';
	}
}

module.exports.browser = function(searchType, cacheTime) {
	return new SSDP(searchType, cacheTime);
};
