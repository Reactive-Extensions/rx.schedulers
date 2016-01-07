'use strict';

var Scheduler = require('./scheduler');
var ScheduledItem = require('./internal/scheduleditem');
var PriorityQueue = require('rx.priorityqueue');
var tryCatchUtils = require('./internal/trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;
var inherits = require('inherits');

function QueueScheduler() {
  Scheduler.call(this);
}

inherits(QueueScheduler, Scheduler);

QueueScheduler.queue = null;

function runTrampoline () {
  while (QueueScheduler.queue.length > 0) {
    var item = QueueScheduler.queue.dequeue();
    !item.isCancelled() && item.invoke();
  }
}

QueueScheduler.prototype.schedule = function (state, action) {
  var si = new ScheduledItem(this, state, action, this.now());

  if (!QueueScheduler.queue) {
    QueueScheduler.queue = new PriorityQueue();
    QueueScheduler.queue.enqueue(si);

    var result = tryCatch(runTrampoline)();
    QueueScheduler.queue = null;
    if (result === global.RxSchedulers.errorObj) { thrower(result.e); }
  } else {
    QueueScheduler.queue.enqueue(si);
  }
  return si.disposable;
};

QueueScheduler.prototype.scheduleRequired = function () { return !QueueScheduler.queue; };

module.exports = QueueScheduler;
