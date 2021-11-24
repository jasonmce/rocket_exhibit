# Add our chromium-browser statement to autostart if it is not already there.
if ! grep chromium-browser /etc/xdg/lxsession/LXDE-pi/autostart; then
  echo """
# Disable screen saver.
xset -dpms
xset s off
# Launch kiosk mode browser pointed at our app.
/usr/bin/chromium-browser --kiosk  --disable-restore-session-state http://localhost:3000
  """ >> /etc/xdg/lxsession/LXDE-pi/autostart
fi
