'use strict';

var test = require('tape');
var Disposable = require('rx.disposables').Disposable;
var SyncScheduler = require('../syncscheduler');

var scheduler = new SyncScheduler();

test('SyncScheduler now', function (t) {
  var res = scheduler.now() - new Date().getTime();

  t.ok(res < 1000, 'should be less than one second');
  t.end();
});

test('SyncScheduler schedule', function (t) {
  var ran = false;

  scheduler.schedule(null, function () { ran = true; });

  t.ok(ran, 'should have run');
  t.end();
});

test('SyncScheduler schedule error', function (t) {
  var ex = new Error();

  try {
    return scheduler.schedule(null, function () { throw ex; });
  } catch (e) {
    t.equal(e, ex, 'should be the same error');
    t.end();
  }
});

test('SyncScheduler schedule with state', function (t) {
  var xx = 0;

  scheduler.schedule(42, function (self, x) { xx = x; return Disposable.empty; });

  t.equal(42, xx, 'state should be the same');
  t.end();
});

test('SyncScheduler recursive', function (t) {
  var xx = 0;
  var yy = 0;

  scheduler.schedule(42, function (self, x) {
    xx = x;
    return self.schedule(43, function (self2, y) {
      yy = y;
      return Disposable.empty;
    });
  });

  t.equal(42, xx, 'xx should be 42');
  t.equal(43, yy, 'yy should be 43');
  t.end();
});
