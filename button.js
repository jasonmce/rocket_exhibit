'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

class Button {

   enabled = true;
   disable_after_press_ms = 10000;

   // GPIO interfaces.
   buttonGpio = 0;

   callbacks = [];

   /**
    * Button factory class.
    *
    * @param int pin
    *   Which pin to watch for button events.
    */
   constructor(pin) {
      var Gpio = require('onoff').Gpio;

      this.buttonGpio = new Gpio(pin, 'in', 'both');

      this.buttonGpio.watch((err, button_value) => {
         if (err) {
            console.error('There was an error:', err);
            return;
         }
         // Only launch on positive edge trigger while the button is enabled.
         if (button_value && this.enabled) {
            this.buttonPressed();
         }
      });
   }

   /**
    * Set the enabled property to true.
    */
   enableButton() {
      this.enabled = true;
      console.log("button re-enabled");
   }
   /**
    * Set the enabled property to false.
    *
    * @param int duration_milliseconds
    *   Duration to wait before the button is enabled again.
    */
   disableButton(duration_milliseconds) {
      this.enabled = false;
      console.log("button disabled, starting re-enable timer");
      setTimeout(
         this.enableButton.bind(this),
         duration_milliseconds
      );
   }

   /**
    * Add to the list of callback functions to be run by the button.
    *
    * @param param
    *   Parameter to be passed.
    * @param callback_function
    *   Function to call.
    */
   addCallback(param, callback_function) {
      this.callbacks.push({"arguments" : param, "function" : callback_function});
   }

   /*
    * Disable the launch button for 10 sec, run the callbacks.
    *
    * @see disableButton
    * @see disable_after_press_ms
    */
   buttonPressed() {
      console.log("button pressed");
      // Exit gracefully if the button is not currently enabled.
      if (false === this.enabled) {
         return true;
      }
      this.disableButton(this.disable_after_press_ms);

      if (this.callbacks) {
         this.callbacks.forEach(callback_info => {
            callback_info["function"](callback_info["arguments"]);
         });
      }
   }
}

module.exports = Button;
