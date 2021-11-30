'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

class Digital {

  constructor() {
  }

  init(canvas) {
    var heading = document.createElement("heading");
    heading.innerHTML = "Pressure in PSI";
    this.content = document.createElement("div");
    this.content.classList.add("content");
    canvas.appendChild(heading);
    canvas.appendChild(this.content);
  }

  updatePressure(pressure) {
    this.content.innerHTML = pressure.toFixed(2);
  }
}
