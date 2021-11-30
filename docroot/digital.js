'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

class Digital {

  constructor() {
  }

  init(canvas) {
    this.element = canvas;
  }

  updatePressure(pressure) {
    this.element.innerHTML = pressure.toFixed(2);
  }
}
