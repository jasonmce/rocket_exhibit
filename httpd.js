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
   * @param {Pressure} pressure_obj
   *   A pressure object we can get a reading from.
   */
  constructor(pressure_obj) {
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
    // Node modules are in their own local path.
    app.all('/node_modules/*', function (req, res, next) {
      res.sendFile(path.join(__dirname + req.url));
    });

    // All other requests are routed through docroot.
    app.all('*', function (req, res, next) {
      res.sendFile(path.join(__dirname + "/docroot" + req.url));
    });

    const server = http.createServer(app);
    const port = 3000;
    server.listen(port);
    console.debug('Server listening on port ' + port);
  }
}

module.exports = httpd;
