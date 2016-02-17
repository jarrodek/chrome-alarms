'use strict';

Polymer({
  /**
   * Fired when an information about alarm(s) has been requested.
   * The details object will always result with an array of alarms set.
   *
   * @event alarm-info
   * @param {Array<Object>} alarms An alarm object.
   *   - {String} name Name of this alarm.
   *   - {double} scheduledTime Time at which this alarm was scheduled to fire, in milliseconds
   *     past the epoch (e.g. Date.now() + n). For performance reasons, the alarm may have been
   *     delayed an arbitrary amount beyond this.
   *   - {double} periodInMinutes Optional. If not null, the alarm is a repeating alarm and will
   *     fire again in periodInMinutes minutes.
   */
  /**
   * Fired when an alarm has fired.
   *
   * @event alarm
   * @param {Object} alarm Aee https://developer.chrome.com/apps/alarms#type-Alarm for description
   */
  /**
   * Fired when an alarm(s) has been removed.
   * The event's details will contain wasCleared (boolean) flag.
   *
   * @event clear
   * @param {Boolean} wasCleared True if the alarm was cleared.
   */
  is: 'chrome-alarms',
  properties: {
    /**
     * A name that identify the alarm. Defaults to the empty string.
     *
     * @type String
     */
    name: {
      type: String,
      value: ''
    }
  },
  /**
   * Creates an alarm. Near the time(s) specified by alarmInfo, the on-alarm
   * event is fired. If there is another alarm with the same name
   * (or no name if none is specified), it will be cancelled and replaced by
   * this alarm.
   *
   * See more: https://developer.chrome.com/apps/alarms#method-create
   *
   * @param alarmInfo - Describes when the alarm should fire.
   *    The initial time must be specified by either when or delayInMinutes
   *    (but not both). If periodInMinutes is set, the alarm will repeat every
   *    periodInMinutes minutes after the initial event. If neither when or
   *    delayInMinutes is set for a repeating alarm, periodInMinutes
   *    is used as the default for delayInMinutes.
   *
   *  - when (optional, double) - Time at which the alarm should fire,
   *                              in milliseconds past the epoch
   *                                 (e.g. Date.now() + n).
   *  - delayInMinutes (optional, double) - Length of time in minutes after
   *                                        which the onAlarm event should fire.
   *  - periodInMinutes (optional, double) - If set, the onAlarm event should fire
   *                                         every periodInMinutes minutes after
   *                                         the initial event specified by when
   *                                         or delayInMinutes. If not set, the alarm
   *                                         will only fire once.
   */
  create: function(alarmInfo) {
    chrome.alarms.create(this.name, alarmInfo);
  },

  /**
   * Retrieves details about the specified alarm.
   */
  getAlarm: function() {
    var context = this;
    chrome.alarms.get(this.name, function(alarm) {
      context.fire('alarm-info', {
        'alarms': [alarm]
      });
    });
  },

  /**
   * Request an array of all the alarms.
   */
  getAll: function() {
    chrome.alarms.getAll((alarms) => {
      this.fire('alarm-info', {
        'alarms': alarms
      });
    });
  },
  /**
   * Clears the alarm.
   */
  clear: function() {
    chrome.alarms.clear(this.name, (wasCleared) => {
      this.fire('clear', {
        'wasCleared': wasCleared
      });
    });
  },

  /**
   * Clears all alarms.
   */
  clearAll: function() {
    chrome.alarms.clearAll((wasCleared) => {
      this.fire('clear', {
        'wasCleared': wasCleared
      });
    });
  },

  /**
   * Register an alarm listener
   */
  created: function() {
    var context = this;

    this._eventFn = function(alarm) {
      if (context.name !== alarm.name) {
        return;
      }
      context.fire('alarm', {
        'alarm': alarm
      });
    };
    chrome.alarms.onAlarm.addListener(this._eventFn);
  },

  detached: function() {
    chrome.alarms.onAlarm.removeListener(this._eventFn);
  }
});
