'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

class Pressure {

  latest_pressure;

  /**
   * Creates a pressure module monitor object.
   *
   * @param {int} polling_interval_ms How often the value should update.
   */
  constructor(polling_interval_ms = 250) {
    this.latest_pressure = -1;

    const mcpadc = require('mcp-spi-adc');
    const tempSensor = mcpadc.openMcp3008(5, {speedHz: 20000}, err => {
        console.log("in");
        if (err) {
           console.log("Did you remember to enable SPI on the raspberry pi?");
           throw err;
        }
        console.log("through");

       setInterval(_ => {
          tempSensor.read((err, reading) => {
             if (err) {
               throw err;
             }
             this.latest_pressure = reading.value * 100;
             console.log(this.latest_pressure);
          });
       }, polling_interval_ms);
    });
  }
}

module.exports = Pressure;
