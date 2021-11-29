'use strict';

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

class DigitalInterfaces {

   // Set defaults.
   // NOTE - all times are in milliseconds.
   launchButtonEnabled = true;
   purgeIntervalTimer = 0;
   launchValveOpenDuration = 2000;
   launchButtonDelay = 5000;

   // GPIO interfaces.
   rocketValve;
   reliefValve;
   launchButton;

   constructor() {
      var Gpio = require('onoff').Gpio;


      // Create interface objects.
      this.rocketValve = new Gpio(20, 'out');
      this.reliefValve = new Gpio(21, 'out');
      this.launchButton = new Gpio(16, 'in', 'both');

      /*
       * Watch for hardware interrupts on the launch button.
       *
       * Pressing the launch button, when enabled, launches the rocket.
       */
      this.launchButton.watch((err, button_value) {
         if (err) {
            console.error('There was an error', err);
            return;
         }
         // Only launch on positive edge trigger while the button is enabled.
         if (button_value && this.launchButtonEnabled) {
            this.launchRocket();
         }
      });



   }
   /**
    * Shut the relief valve and stop the check timer once pressure is low enough.
    */
   continueDepressurizing() {
      if ("pressure_gauge" < "threshold") {
         clearInterval(this.purgeIntervalTimer);
         this.closeReliefValve();
         this.launchButtonEnabled = true;
      }
   }

   /**
    * Begin the pressure relief routine.
    */
   startDepressurizing() {
      this.launchButtonEnabled = false;
      this.openReliefValve();
      setInterval(this.continueDepressurizing, 200);
   }

   openReliefValve() {
      this.reliefValve.writeSync(1);
   }
   closeReliefValve() {
      this.reliefValve.writeSync(0);
   }


   openRocketValve() {
      this.rocketValve.writeSync(1);
   }
   closeRocketValve() {
      this.rocketValve.writeSync(0);
   }

   /*
    * Disable the launch button for 10 sec and open the launch valve for 2 sec.
    *
    * @see launchValveOpenDuration
    * @see launchButtonDelay
    */
   launchRocket() {
      this.launchButtonEnabled = false;
      this.openRocketValve();
      setTimeout(this.closeRocketValve, this.launchValveOpenDuration);
      setTimeout(
        () { this.launchButtonEnabled = true;},
        this.launchButtonDelay
      );
   }


   /*
    * Free GPIO resources when the program terminates.
    */
   unexportOnClose() { //to run when exiting program
      this.closeRocketValve();
      this.rocketValve.unexport();
      this.launchButton.unexport();
   }

   // process.on('SIGINT', unexportOnClose); //to run when user closes using ctrl+c
}
module.exports = DigitalInterfaces
