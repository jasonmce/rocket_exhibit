/**
 * Express to handle web requests.
 */
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static("express"));// default URL for website

app.get('/pressure', function(req, res){
   var pressure = Math.round(Date.now() / 1000) % 100;
   res.status(200).send({ psi: pressure });
});
app.all('*', function (req, res, next) {
   res.sendFile(path.join(__dirname+req.url));
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);

/**
 * Button and valve functionality.
 *
 * The system has four interfaces:
 *   Launch button - input - normally open
 *   Pressure sensor - input - normal atmosphere pressure
 *   Launch valve - output - normally off / sealed
 *   Relief valve - output - normally off / sealed
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

var Gpio = require('onoff').Gpio;

// How man milliseconds the launch valve will be kept open for launch.
const launchValveOpenDuration = 2000;
// How many milliseconds the launch button is disabled after a launch.
const launchButtonDelay = 5000;

// Create interface objects.
var rocketValve = new Gpio(20, 'out');
var reliefValve = new Gpio(21, 'out');
var launchButton = new Gpio(16, 'in', 'both');

// Set defaults.
var launchButtonEnabled = true;
var purgeIntervalTimer = 0;

/**
 * Shut the relief valve and stop the check timer once pressure is low enough.
 */
function continueDepressurizing() {
   if ("pressure_gauge" < "threshold") {
      clearInterval(purgeIntervalTimer);
      closeReliefValve();
      launchButtonEnabled = true;
   }
}

/**
 * Begin the pressure relief routine.
 */
function startDepressurizing() {
   launchButtonEnabled = false;
   openReliefValve();
   setInterval(continueDepressurizing, 200);
}

function openReliefValve() {
   reliefValve.writeSync(1);
}
function closeReliefValve() {
   reliefValve.writeSync(0);
}


function openRocketValve() {
   rocketValve.writeSync(1);
}
function closeRocketValve() {
   rocketValve.writeSync(0);
}

/*
 * Disable the launch button for 10 sec and open the launch valve for 2 sec.
 *
 * @see launchValveOpenDuration
 * @see launchButtonDelay
 */
function launchRocket() {
   launchButtonEnabled = false;
   openRocketValve();
   setTimeout(closeRocketValve, launchValveOpenDuration);
   setTimeout(
     function () { launchButtonEnabled = true;},
     launchButtonDelay
   );
}

/*
 * Watch for hardware interrupts on the launch button.
 *
 * Pressing the launch button, when enabled, launches the rocket.
 */
launchButton.watch(function (err, button_value) {
   if (err) {
      console.error('There was an error', err);
      return;
   }
   // Only launch on positive edge trigger while the button is enabled.
   if (button_value && launchButtonEnabled) {
      launchRocket();
   }
});

/*
 * Free GPIO resources when the program terminates.
 */
function unexportOnClose() { //function to run when exiting program
   closeRocketValve();
   rocketValve.unexport();
   launchButton.unexport();
}

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c






