'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

/**
 * Valve functionality.
 *
 * The system has four interfaces:
 *   Launch button - input - normally open.
 *   Pressure sensor - input - normal atmosphere pressure.
 *   Launch valve - output - normally off / sealed.
 *   Relief valve - output - normally off / sealed.
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

class Valve {

   // GPIO interface.
   valveGpio = 0;

   /**
    * Create a valve object.
    *
    * @param int pin
    *   GPIO pin the valve circuit is attached to.
    */
   constructor(pin) {
      var Gpio = require('onoff').Gpio;

      // Create interface objects.
      this.valveGpio = new Gpio(pin, 'out');
   }

   openValve() {
      console.log("opening valve");
      this.valveGpio.writeSync(1);
   }
   closeValve() {
      console.log("closing valve");
      this.valveGpio.writeSync(0);
   }

   /*
    * Open the valve for at least {milliseconds}.
    *
    * Opens the valve and sets a timer to closeValve().
    *
    * @param int milliseconds
    *   Minimum amount of time the valve should be kept open.
    *
    * @see launchValveOpenDuration
    * @see launchButtonDelay
    */
   openValveForDuration(milliseconds) {
      this.openValve();
      setTimeout(this.closeValve.bind(this), milliseconds);
   }
}

module.exports = Valve;
