# From https://thisdavej.com/beginners-guide-to-installing-node-js-on-a-raspberry-pi/#install-node
# Update our Debian apt package repository to include the NodeSource packages.
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
# Run the installer
sudo apt install -y nodejs
