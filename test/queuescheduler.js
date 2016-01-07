'use strict';

var test = require('tape');
var QueueScheduler = require('../queuescheduler');

var scheduler = new QueueScheduler();
scheduler.ensureTrampoline = function (action) {
  if (this.scheduleRequired()) { this.schedule(null, action); } else { action(); }
};

test('QueueScheduler thread now', function (t) {
  var res = scheduler.now() - new Date().getTime();

  t.ok(res < 1000, 'should be less than a second');

  t.end();
});

test('QueueScheduler thread schedule action', function (t) {
  var ran = false;

  scheduler.schedule(null, function () { ran = true; });

  t.ok(ran, 'should have run');

  t.end();
});

test('QueueScheduler thread schedule action error', function (t) {
  var error = new Error();

  try {
    scheduler.schedule(error, function (_, e) { throw e; });
    t.ok(false, 'should not reach this point in the code');
  } catch (e) {
    t.equal(e, error, 'Error should be the same as thrown');
  }

  t.end();
});

test('QueueScheduler thread schedule nested', function (t) {
  var ran = false;

  scheduler.schedule(null, function () {
    scheduler.schedule(null, function () { ran = true; });
  });

  t.ok(ran, 'should have run');

  t.end();
});

test('QueueScheduler thread ensure trampoline', function (t) {
  var ran1 = false, ran2 = false;

  scheduler.ensureTrampoline(function () {
    scheduler.schedule(null, function () { ran1 = true; });
    scheduler.schedule(null, function () { ran2 = true; });
  });

  t.ok(ran1, 'first should have run');
  t.ok(ran2, 'second should have run');

  t.end();
});

test('QueueScheduler thread ensure trampoline nested', function (t) {
  var ran1 = false, ran2 = false;

  scheduler.ensureTrampoline(function () {
    scheduler.ensureTrampoline(function () { ran1 = true; });
    scheduler.ensureTrampoline(function () { ran2 = true; });
  });

  t.ok(ran1, 'first should have run');
  t.ok(ran2, 'second should have run');

  t.end();
});

test('QueueScheduler thread ensure trampoline and cancel', function (t) {
  var ran1 = false, ran2 = false;

  scheduler.ensureTrampoline(function () {
    scheduler.schedule(null, function () {
      ran1 = true;
      var d = scheduler.schedule(null, function () { ran2 = true; });
      d.dispose();
    });
  });

  t.ok(ran1, 'first should have run');
  t.notOk(ran2, 'second should not have run');

  t.end();
});
