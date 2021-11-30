'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

var classPressure = require('./pressure.js');
var pressure = new classPressure();

var classHttpd = require('./httpd.js');
var web_requests = new classHttpd(3000, pressure);

var DigitalInterfaces = require('./interfaces.js');
var digital_interfaces = new DigitalInterfaces();
process.on('SIGINT', digital_interfaces.unexportOnClose); //to run when user closes using ctrl+c
