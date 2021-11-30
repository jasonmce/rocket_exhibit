'use strict';
/*jshint esversion: 6 */
/* jshint node: true */

/**
 * https://www.npmjs.com/package/chartjs-gauge.
 */
class Gauge {

  constructor() {
    this.config = {
      type: 'gauge',
      data: {
        labels: ['Low', 'Medium', 'High'],
        datasets: [{
          data: [40, 80, 100],
          value: -1,
          backgroundColor: ['green', 'orange', 'red'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: 'Gauge chart'
        },
        layout: {
          padding: {
            bottom: 30
          }
        },
        needle: {
          // Needle circle radius as the percentage of the chart area width.
          radiusPercentage: 2,
          // Needle width as the percentage of the chart area width.
          widthPercentage: 3.2,
          // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc.
          lengthPercentage: 80,
          // The color of the needle.
          color: 'rgba(0, 0, 0, 1)'
        },
        valueLabel: {
          display: false,
        }
      }
    };
  }

  init(canvas) {
    var ctx = canvas.getContext('2d');
    this.myGauge = new Chart(ctx, this.config);
  }

  updatePressure(presure) {
    this.config.data.datasets[0].value = presure;
    this.myGauge.update();
  }
}
