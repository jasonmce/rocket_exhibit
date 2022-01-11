'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

/**
 * Rocket Exhibit.
 *
 * The exhibit consists of # parts:
 *   Bladder to hold pressurized air.
 *   User-accessible air pump attached to the bladder.
 *   Pressure sensor inside the bladder.
 *   Launch valve between the bladder and the rocket.
 *   Relief valve to vent the bladder to the atmosphere.
 *   Launch button.
 *   RaspberryPi attached to a video display.
 *
 * System Normal:
 * The system should be at rest with both valves closed, the button un-pressed,
 * and the pressure valve returning a negligible amount of pressure.
 *
 * The Launch:
 * When the launch button is pressed, the launch valve is opened for two seconds
 * and then closed.  The launch button will not respond again for 5 seconds to
 * prevent unanticipated states.
 *
 * The walk-away:
 * The system will periodically check for relatively unchanged pressure over a
 * period of time to indicate pressure was added and the visitor walked away.
 * When this happens the relief valve will be used to slowly bleed the system
 * down to an acceptable threshold.
 */



// Pressure monitor object for the mcp3008 attached sensor.
var classPressure = require('./pressure.js');
var pressureSensor = new classPressure();

// Instantiate our valves.
var Valve = require('./valve.js');
var rocketValve = new Valve(20);
var reliefValve = new Valve(21);

// Create a button, when pressed it opens the rocket valve for 2 seconds.
var Button = require('./button.js');
var launchButton = new Button(16);
launchButton.addCallback(2000, rocketValve.openValveForDuration.bind(rocketValve));

// Detects idle with pressure situations and purges the bladder.
// var PurgeMonitor = require('./interfaces.js');
// var purgeMonitor = new PurgeMonitor(pressureSensor, reliefValve);

// Express based http request handler.
var classHttpd = require('./httpd.js');
// Create a web service with access to the pressure sensor.
var web_requests = new classHttpd(pressureSensor);
