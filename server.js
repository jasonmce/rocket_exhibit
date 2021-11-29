'use strict';

var classPressure = require('./pressure.js');
var pressure = new classPressure();

var classHttpd = require('./httpd.js');
var web_requests = new classHttpd(pressure);

var DigitalInterfaces = require('./interfaces.js');
var digital_interfaces = new DigitalInterfaces();

