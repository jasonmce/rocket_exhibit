var config = {
  type: 'gauge',
  data: {
    labels: ['Success', 'Warning', 'Warning', 'Error'],
    datasets: [{
      data: [40, 70, 90, 100],
      value: -1,
      backgroundColor: ['green', 'yellow', 'orange', 'red'],
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
      // Needle circle radius as the percentage of the chart area width
      radiusPercentage: 2,
      // Needle width as the percentage of the chart area width
      widthPercentage: 3.2,
      // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
      lengthPercentage: 80,
      // The color of the needle
      color: 'rgba(0, 0, 0, 1)'
    },
    valueLabel: {
      formatter: Math.round
    }
  }
};

window.onload = function() {
  var ctx = document.getElementById('chart').getContext('2d');
  window.myGauge = new Chart(ctx, config);
};

setInterval(function() {
  fetch('/pressure')
    .then(response => response.json())
    .then(data => {
      config.data.datasets[0].value = data.psi;
      window.myGauge.update();
    });
}, 2000);
