# From https://medium.com/going-fullstack/run-node-js-apps-when-your-raspberry-pi-boots-up-345b7e6fcf4f
sudo npm install pm2 -g
sudo pm2 start server.js
sudo pm2 startup
