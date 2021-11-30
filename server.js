'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

// Pressure monitor object for the mcp3008 attached sensor.
var classPressure = require('./pressure.js');
var pressure = new classPressure();

// Express based http request handler.
var classHttpd = require('./httpd.js');
var web_requests = new classHttpd(pressure);

// Handle the GPIO pin actions and responses.
var DigitalInterfaces = require('./interfaces.js');
var digital_interfaces = new DigitalInterfaces();
process.on('SIGINT', digital_interfaces.unexportOnClose); //to run when user closes using ctrl+c
