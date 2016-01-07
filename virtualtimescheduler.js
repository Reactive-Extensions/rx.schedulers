'use strict';

var Scheduler = require('./scheduler');
var PriorityQueue = require('rx.priorityqueue');
var ScheduledItem = require('./internal/scheduleditem');
var SchedulePeriodicRecursive = require('./internal/scheduleperiodicrecursive');
var inherits = require('inherits');

function notImplemented(method) {
  return function () { throw new Error(method + ' is not implemented'); };
}

/**
 * Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.
 *
 * @constructor
 * @param {Number} initialClock Initial value for the clock.
 * @param {Function} comparer Comparer to determine causality of events based on absolute time.
 */
function VirtualTimeScheduler(initialClock, comparer) {
  this.clock = initialClock;
  this.comparer = comparer;
  this.isEnabled = false;
  this.queue = new PriorityQueue();
  Scheduler.call(this);
}

inherits(VirtualTimeScheduler, Scheduler);

VirtualTimeScheduler.prototype.now = function () {
  return this.toAbsoluteTime(this.clock);
};

VirtualTimeScheduler.prototype.schedule = function (state, action) {
  return this.scheduleAbsolute(state, this.clock, action);
};

VirtualTimeScheduler.prototype.scheduleFuture = function (state, dueTime, action) {
  var dt = dueTime instanceof Date ?
    this.toRelativeTime(dueTime - this.now()) :
    this.toRelativeTime(dueTime);

  return this.scheduleRelative(state, dt, action);
};

/**
 * Adds a relative time value to an absolute time value.
 * @param {Number} absolute Absolute virtual time value.
 * @param {Number} relative Relative virtual time value to add.
 * @return {Number} Resulting absolute virtual time sum value.
 */
VirtualTimeScheduler.prototype.add = notImplemented('add');

/**
 * Converts an absolute time to a number
 * @param {Any} The absolute time.
 * @returns {Number} The absolute time in ms
 */
VirtualTimeScheduler.prototype.toAbsoluteTime = notImplemented('toAbsoluteTime');

/**
 * Converts the TimeSpan value to a relative virtual time value.
 * @param {Number} timeSpan TimeSpan value to convert.
 * @return {Number} Corresponding relative virtual time value.
 */
VirtualTimeScheduler.prototype.toRelativeTime = notImplemented('toRelativeTime');

/**
 * Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be emulated using recursive scheduling.
 * @param {Mixed} state Initial state passed to the action upon the first iteration.
 * @param {Number} period Period for running the work periodically.
 * @param {Function} action Action to be executed, potentially updating the state.
 * @returns {Disposable} The disposable object used to cancel the scheduled recurring action (best effort).
 */
VirtualTimeScheduler.prototype.schedulePeriodic = function (state, period, action) {
  var s = new SchedulePeriodicRecursive(this, state, period, action);
  return s.start();
};

/**
 * Schedules an action to be executed after dueTime.
 * @param {Mixed} state State passed to the action to be executed.
 * @param {Number} dueTime Relative time after which to execute the action.
 * @param {Function} action Action to be executed.
 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
 */
VirtualTimeScheduler.prototype.scheduleRelative = function (state, dueTime, action) {
  var runAt = this.add(this.clock, dueTime);
  return this.scheduleAbsolute(state, runAt, action);
};

/**
 * Starts the virtual time scheduler.
 */
VirtualTimeScheduler.prototype.start = function () {
  if (!this.isEnabled) {
    this.isEnabled = true;
    do {
      var next = this.getNext();
      if (next !== null) {
        this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
        next.invoke();
      } else {
        this.isEnabled = false;
      }
    } while (this.isEnabled);
  }
};

/**
 * Stops the virtual time scheduler.
 */
VirtualTimeScheduler.prototype.stop = function () {
  this.isEnabled = false;
};

/**
 * Advances the scheduler's clock to the specified time, running all work till that point.
 * @param {Number} time Absolute time to advance the scheduler's clock to.
 */
VirtualTimeScheduler.prototype.advanceTo = function (time) {
  var dueToClock = this.comparer(this.clock, time);
  if (this.comparer(this.clock, time) > 0) { throw new Error('time cannot be in the past'); }
  if (dueToClock === 0) { return; }
  if (!this.isEnabled) {
    this.isEnabled = true;
    do {
      var next = this.getNext();
      if (next !== null && this.comparer(next.dueTime, time) <= 0) {
        this.comparer(next.dueTime, this.clock) > 0 && (this.clock = next.dueTime);
        next.invoke();
      } else {
        this.isEnabled = false;
      }
    } while (this.isEnabled);
    this.clock = time;
  }
};

/**
 * Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.
 * @param {Number} time Relative time to advance the scheduler's clock by.
 */
VirtualTimeScheduler.prototype.advanceBy = function (time) {
  var dt = this.add(this.clock, time),
      dueToClock = this.comparer(this.clock, dt);
  if (dueToClock > 0) { throw new Error('time cannot be in the past'); }
  if (dueToClock === 0) {  return; }

  this.advanceTo(dt);
};

/**
 * Advances the scheduler's clock by the specified relative time.
 * @param {Number} time Relative time to advance the scheduler's clock by.
 */
VirtualTimeScheduler.prototype.sleep = function (time) {
  var dt = this.add(this.clock, time);
  if (this.comparer(this.clock, dt) >= 0) { throw new Error('time cannot be less than or equal to zero'); }

  this.clock = dt;
};

/**
 * Gets the next scheduled item to be executed.
 * @returns {ScheduledItem} The next scheduled item.
 */
VirtualTimeScheduler.prototype.getNext = function () {
  while (this.queue.length > 0) {
    var next = this.queue.peek();
    if (next.isCancelled()) {
      this.queue.dequeue();
    } else {
      return next;
    }
  }
  return null;
};

/**
 * Schedules an action to be executed at dueTime.
 * @param {Mixed} state State passed to the action to be executed.
 * @param {Number} dueTime Absolute time at which to execute the action.
 * @param {Function} action Action to be executed.
 * @returns {Disposable} The disposable object used to cancel the scheduled action (best effort).
 */
VirtualTimeScheduler.prototype.scheduleAbsolute = function (state, dueTime, action) {
  var self = this;

  function run(scheduler, state1) {
    self.queue.remove(si);
    return action(scheduler, state1);
  }

  var si = new ScheduledItem(this, state, run, dueTime, this.comparer);
  this.queue.enqueue(si);

  return si.disposable;
};

module.exports = VirtualTimeScheduler;
