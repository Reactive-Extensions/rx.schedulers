'use strict';

var test = require('tape');
var VirtualTimeScheduler = require('../virtualtimescheduler');

var VirtualSchedulerTestScheduler = (function () {

  function comparer(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function add(absolute, relative) {
    absolute == null && (absolute = '');
    return absolute + relative;
  }

  function toAbsoluteTime(absolute) {
    absolute == null && (absolute = '');
    return new Date(absolute.length);
  }

  function toRelative (timeSpan) {
    return String.fromCharCode(timeSpan % 65535);
  }

  return function () {
    var scheduler = new VirtualTimeScheduler(null, comparer);
    scheduler.add = add;
    scheduler.toAbsoluteTime = toAbsoluteTime;
    scheduler.toRelative = toRelative;
    return scheduler;
  };
}());

test('VirtualTimeScheduler Now', function (t) {
  var res = new VirtualSchedulerTestScheduler().now() - new Date().getTime();

  t.ok(res < 1000, 'should be less than a second');
  t.end();
});

test('VirtualTimeScheduler schedule action', function (t) {
  var ran = false;

  var scheduler = new VirtualSchedulerTestScheduler();

  scheduler.schedule(null, function () { ran = true; });

  scheduler.start();

  t.ok(ran, 'should have run');
  t.end();
});

test('VirtualTimeScheduler Schedule Action Error', function (t) {
  var error = new Error();

  try {
    var scheduler = new VirtualSchedulerTestScheduler();

    scheduler.schedule(error, function (_, e) {
      throw e;
    });

    scheduler.start();
    t.ok(false);
  } catch (e) {
    t.equal(e, error, 'Error should be equal to that thrown');
    t.end();
  }
});
