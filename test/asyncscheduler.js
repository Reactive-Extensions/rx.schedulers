'use strict';

var test = require('tape');
var AsyncScheduler = require('../asyncscheduler');

var scheduler = new AsyncScheduler();

test('AsyncScheduler now', function (t) {
  var res = scheduler.now() - +new Date();

  t.ok(res < 1000, 'Should be near zero');

  t.end();
});

test('AsyncScheduler schedule action', function (t) {
  scheduler.schedule(true, function (s, state) {
    t.ok(state, 'should schedule action');
    t.end();
  });
});

test('AsyncScheduler schedule relative', function (t) {
  scheduler.scheduleFuture(+new Date(), 200, function (s, startTime) {
    var endTime = +new Date();
    t.ok(endTime - startTime >= 200, 'Should be at least 200 milliseconds');
    t.end();
  });
});

test('AsyncScheduler schedule action cancel', function (t) {
  var set = false;
  var d = scheduler.scheduleFuture(null, 200, function () { set = true; });

  d.dispose();

  setTimeout(function () {
    t.ok(!set, 'after cancel should not be set');
    t.end();
  }, 400);
});
