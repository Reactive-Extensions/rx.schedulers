'use strict';

var test = require('tape');
var ScheduledDisposable = require('../scheduleddisposable');
var SyncScheduler = require('../syncscheduler');

var scheduler = new SyncScheduler();

function BooleanDisposable() {
  this.isDisposed = false;
}

BooleanDisposable.prototype.dispose = function () {
  !this.isDisposed && (this.isDisposed = true);
};

test('ScheduledDisposable', function (t) {
  var d = new BooleanDisposable();
  var s = new ScheduledDisposable(scheduler, d);

  t.notOk(d.isDisposed);

  t.equal(scheduler, s.scheduler);
  t.equal(d, s.disposable);

  s.dispose();

  t.ok(d.isDisposed);
  t.ok(s.isDisposed);

  t.equal(scheduler, s.scheduler);
  s.disposable.dispose();

  t.end();
});
