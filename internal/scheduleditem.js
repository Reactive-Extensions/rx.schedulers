'use strict';

var disposables = require('rx.disposables');
var Disposable = disposables.Disposable;
var SingleAssignmentDisposable = disposables.SingleAssignmentDisposable;
var cmp = require('./comparer');

function ScheduledItem(scheduler, state, action, dueTime, comparer) {
  this.scheduler = scheduler;
  this.state = state;
  this.action = action;
  this.dueTime = dueTime;
  this.comparer = comparer || cmp;
  this.disposable = new SingleAssignmentDisposable();
}

ScheduledItem.prototype.invoke = function () {
  this.disposable.setDisposable(this.invokeCore());
};

ScheduledItem.prototype.compareTo = function (other) {
  return this.comparer(this.dueTime, other.dueTime);
};

ScheduledItem.prototype.isCancelled = function () {
  return this.disposable.isDisposed;
};

ScheduledItem.prototype.invokeCore = function () {
  return Disposable._fixup(this.action(this.scheduler, this.state));
};

module.exports = ScheduledItem;
