# One time steps to configure the pi for the Rocket_Exhibit application.

# The SPI interface must be enabled for the mcp-spi-adc nodejs library.
# From https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi.
if ! grep -q "Enable SPI" /boot/config.txt; then
  echo """
# Enable SPI for nodejs library mcp-spi-adc.
dtparam=spi=on
  """ | sudo tee -a /boot/config.txt > /dev/null
fi

# Install NodeJS.
# From https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node.
# Update our Debian apt package repository to include the NodeSource packages.
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
# Run the NodeJS installer.
sudo apt install -y nodejs

# Clone the code repository into our home directory.
git clone https://github.com/jasonmce/rocket_exhibit.git /home/pi/rocket_exhibit
cd /home/pi/rocket_exhibit
npm install

# Use pm2 to automatically start our nodejs application.
# From https://medium.com/going-fullstack/run-node-js-apps-when-your-raspberry-pi-boots-up-345b7e6fcf4f
sudo npm install pm2 -g
sudo pm2 start server.js
sudo pm2 startup

# Disable the screensaver and add our chromium-browser statement to autostart.
if ! grep chromium-browser /etc/xdg/lxsession/LXDE-pi/autostart; then
  echo """
# Disable screen saver.
xset -dpms
xset s off
# Launch kiosk mode browser pointed at our app.
/usr/bin/chromium-browser --kiosk  --disable-restore-session-state http://localhost:3000
  """ >> /etc/xdg/lxsession/LXDE-pi/autostart
fi
