/**
 * Uses Express to handle web requests.
 *
 *
 */

'use strict';

class httpd {

  pressure_object;

  constructor(pressure_obj) {
    this.pressure_object = pressure_obj;

    const http = require('http');
    const express = require('express');
    const path = require('path');
    const app = express();

    app.use(express.json());
    app.use(express.static("express"));// default URL for website

    // Return the current pressure as psi:value for /pressure requests.
    app.get('/pressure', function (req, res) {
      // res.status(200).send({psi: pressure_reading});
      res.status(200).send({psi: pressure_obj.latest_pressure});
    });
    // All other requests are routed normally.
    app.all('*', function (req, res, next) {
      res.sendFile(path.join(__dirname + req.url));
    });

    const server = http.createServer(app);
    const port = 3000;
    server.listen(port);
    console.debug('Server listening on port ' + port);
  }
}

module.exports = httpd;
