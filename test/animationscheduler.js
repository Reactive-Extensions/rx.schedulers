'use strict';

var test = require('tape');
var AnimationScheduler = require('../animationscheduler');

var scheduler = new AnimationScheduler();

test('AnimationScheduler now', function (t) {
  var res = scheduler.now() - new Date().getTime();
  
  t.ok(res < 1000, 'should be less than a second');
  t.end();
});

test('AnimationScheduler schedule', function (t) {
  scheduler.schedule(null, function () {
    t.ok(true, 'should have run');
    t.end();
  });
});

test('AnimationScheduler schedule future relative', function (t) {
  scheduler.scheduleFuture(new Date().getTime(), 200, function (s, startTime) {
    var endTime = new Date().getTime();
    t.ok(endTime - startTime >= 200, 'should be about 200ms');
    t.end();
  });
});

test('AnimationScheduler schedule future absolute', function (t) {
  scheduler.scheduleFuture(new Date().getTime(), new Date(Date.now() + 200), function (s, startTime) {
    var endTime = new Date().getTime();

    t.ok(endTime - startTime > 180, 'should be about 200ms');
    t.end();
  });
});

test('AnimationScheduler schedule action and cancel', function (t) {
  var set = false;
  var d = scheduler.scheduleFuture(null, 200, function () {
    set = true;
  });

  d.dispose();

  setTimeout(function () {
    t.ok(!set, 'should not be set');
    t.end();
  }, 400);
});
