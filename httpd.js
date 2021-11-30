'use strict';
/*jshint esversion: 6 */
/* jshint node: true */
/**
 * Uses Express to handle web requests.
 *
 * Requests for /pressure return a psi pressure, all others go straight through
 * to the file system.
 */

class httpd {

  pressure_object = 0;

  /**
   * Creates an Express based object to handle web requests.
   *
   * @param {int} port
   *   Port to listen to.  Usually 3000 for nodejs apps.
   * @param {Pressure} pressure_obj
   *   A pressure object we can get a reading from.
   */
  constructor(port, pressure_obj) {
    this.pressure_object = pressure_obj;

    const http = require('http');
    const express = require('express');
    const path = require('path');
    const app = express();

    app.use(express.json());
    app.use(express.static("express"));

    // Return the current pressure as psi:value for /pressure requests.
    app.get('/pressure', function (req, res) {
      res.status(200).send({psi: pressure_obj.latest_pressure});
    });
    // All other requests are routed normally.
    app.all('*', function (req, res, next) {
      res.sendFile(path.join(__dirname + req.url));
    });

    const server = http.createServer(app);
    server.listen(port);
    console.debug('Server listening on port ' + port);
  }
}

module.exports = httpd;
