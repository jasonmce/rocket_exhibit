'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

var gauge = new Gauge();
var digital = new Digital();
window.onload = function() {
  gauge.init(window.document.getElementById('chart'));
  digital.init(window.document.getElementById('digital'));
};

setInterval(function() {
  fetch('/pressure')
    .then(response => response.json())
    .then(data => {
      gauge.updatePressure(data.psi);
      digital.updatePressure(data.psi);
    });
}, 500);
