# The SPI interface must be enabled for the mcp-spi-adc nodejs library.
# From https://www.raspberrypi-spy.co.uk/2014/08/enabling-the-spi-interface-on-the-raspberry-pi.
if ! grep -q "Enable SPI" /boot/config.txt; then
  echo """
# Enable SPI for nodejs library mcp-spi-adc.
dtparam=spi=on
  """ | sudo tee -a /boot/config.txt > /dev/null
fi
