'use strict';

var Scheduler = require('./scheduler');
var Disposable = require('rx.disposables').Disposable;
var inherits = require('inherits');

function SyncScheduler() {
  Scheduler.call(this);
}

inherits(SyncScheduler, Scheduler);

SyncScheduler.prototype.schedule = function (state, action) {
  return Disposable._fixup(action(this, state));
};

module.exports = SyncScheduler;
