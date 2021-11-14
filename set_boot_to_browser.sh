# Add our chromium-browser statement to autostart if it is not already there.
if !grep -ri chromium-browser /etc/xdg/lxsession/LXDE-pi/autostart then
  cat "/usr/bin/chromium-browser --kiosk  --disable-restore-session-state http://localhost:3000" >> /etc/xdg/lxsession/LXDE-pi/autostart
fi
