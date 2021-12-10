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
    console.log("Creating pressure object");
    this.latest_pressure = -1;

    const mcpadc = require('mcp-spi-adc');
    const tempSensor = mcpadc.openMcp3008(5, {speedHz: 20000}, err => {
        if (err) {
           console.log("Did you remember to enable SPI on the raspberry pi?");
           throw err;
        }

       setInterval(_ => {
          tempSensor.read((err, reading) => {
             if (err) {
               throw err;
             }
             this.latest_pressure = reading.value * 100;
          });
       }, polling_interval_ms);
    });
    console.log("pressure object created and interval timer started");
  }

  /**
   * The last pressure value recorded.
   *
   * @returns int
   *   The current latest_pressure property value.
   */
  getPsi() {
    return this.latest_pressure;
  }
}

module.exports = Pressure;
