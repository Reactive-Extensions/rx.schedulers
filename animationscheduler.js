'use strict';

var Scheduler = require('./scheduler');
var disposables = require('rx.disposables');
var BinaryDisposable = disposables.BinaryDisposable;
var Disposable = disposables.Disposable;
var SingleAssignmentDisposable = disposables.SingleAssignmentDisposable;
var inherits = require('inherits');

var requestAnimFrame, cancelAnimFrame;
if (global.requestAnimationFrame) {
  requestAnimFrame = global.requestAnimationFrame;
  cancelAnimFrame = global.cancelAnimationFrame;
} else if (global.mozRequestAnimationFrame) {
  requestAnimFrame = global.mozRequestAnimationFrame;
  cancelAnimFrame = global.mozCancelAnimationFrame;
} else if (global.webkitRequestAnimationFrame) {
  requestAnimFrame = global.webkitRequestAnimationFrame;
  cancelAnimFrame = global.webkitCancelAnimationFrame;
} else if (global.msRequestAnimationFrame) {
  requestAnimFrame = global.msRequestAnimationFrame;
  cancelAnimFrame = global.msCancelAnimationFrame;
} else if (global.oRequestAnimationFrame) {
  requestAnimFrame = global.oRequestAnimationFrame;
  cancelAnimFrame = global.oCancelAnimationFrame;
} else {
  requestAnimFrame = function(cb) { global.setTimeout(cb, 1000 / 60); };
  cancelAnimFrame = global.clearTimeout;
}

/**
 * Gets a scheduler that schedules schedules work on the requestAnimationFrame for immediate actions.
 */
function AnimationScheduler() {
  Scheduler.call(this);
}

inherits(AnimationScheduler, Scheduler);

function scheduleAction(disposable, action, scheduler, state) {
  return function schedule() {
    !disposable.isDisposed && disposable.setDisposable(Disposable._fixup(action(scheduler, state)));
  };
}

function ClearDisposable(method, id) {
  this._id = id;
  this._method = method;
  this.isDisposed = false;
}

ClearDisposable.prototype.dispose = function () {
  if (!this.isDisposed) {
    this.isDisposed = true;
    this._method.call(null, this._id);
  }
};

AnimationScheduler.prototype.schedule = function (state, action) {
  var disposable = new SingleAssignmentDisposable(),
    id = requestAnimFrame(scheduleAction(disposable, action, this, state));

  return new BinaryDisposable(disposable, new ClearDisposable(cancelAnimFrame, id));
};

AnimationScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  if (dueTime === 0) { return this.schedule(state, action); }

  var disposable = new SingleAssignmentDisposable(),
    id = global.setTimeout(scheduleAction(disposable, action, this, state), dueTime);

  return new BinaryDisposable(disposable, new ClearDisposable(global.clearTimeout, id));
};

module.exports = AnimationScheduler;
