# chrome-alarms
A Chrome App's alarms API.

Use the chrome.alarms API to schedule code to run periodically or at a specified
time in the future.

You need to declare "alarms" perrmissions into your manifest file.

    ...
       "permissions": [
          "alarms"
       ],
    ...

Example:

    <chrome-app-alarms id="alarms" 
      on-alarm-info="{{onAlarmInfo}}" 
      on-alarm="{{onAlarm}}" 
      name="{{name}}"></chrome-app-alarms>