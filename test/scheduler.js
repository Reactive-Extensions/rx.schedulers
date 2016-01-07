'use strict';

var test = require('tape');
var Scheduler = require('../scheduler');
var SyncScheduler = require('../syncscheduler');
var Disposable = require('rx.disposables').Disposable;
var inherits = require('inherits');

var syncScheduler = new SyncScheduler();

function MyScheduler(now) {
  if (now !== undefined) { this.now = function () { return now; }; }
  this.waitCycles = 0;
  Scheduler.call(this);
}

inherits(MyScheduler, Scheduler);

MyScheduler.prototype.schedule = function (state, action) {
  return action(this, state);
};

MyScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
  var self = this;
  this.check(function (o) { return action(self, o); }, state, dueTime);
  this.waitCycles += dueTime;
  return action(this, state);
};

test('Scheduler schedule non-recursive', function (t) {
  var ms = new MyScheduler();

  var res = false;

  ms.scheduleRecursive(null, function () {
    res = true;
  });

  t.ok(res, 'should have run');
  t.end();
});

test('Scheduler schedule recursive', function (t) {
  var ms = new MyScheduler();

  var i = 0;

  ms.scheduleRecursive(null, function (_, a) { ++i < 10 && a(); });

  t.equal(10, i, 'should have run 10 times');

  t.end();
});

test('Scheduler schedule with time non-recursive', function (t) {
  var now = new Date();

  var ms = new MyScheduler(now);

  var res = false;

  ms.check = function (a, s, tt) { t.equal(tt, 0, 'tt should be zero'); };
  ms.scheduleFuture(null, now, function () { res = true; });

  t.ok(res, 'should have run');
  t.equal(ms.waitCycles, 0, 'should have 0 wait cycles');

  t.end();
});

test('Scheduler schedule with absolute time recursive', function (t) {
  var now = new Date();

  var i = 0;

  var ms = new MyScheduler(now);

  ms.check = function (a, s, tt) { t.equal(tt, 0, 'tt should be zero'); };

  ms.scheduleRecursiveFuture(null, now, function (_, a) {
    ++i < 10 && a(null, now);
  });

  t.equal(ms.waitCycles, 0, 'should have no wait cycles');
  t.equal(10, i, 'should have run 10 times');

  t.end();
});

test('Scheduler schedule with relative time non-recursive', function (t) {
  var now = new Date().getTime();

  var ms = new MyScheduler(now);

  ms.check = function (a, s, tt) { t.equal(tt, 0, 'tt should be zero');   };

  var res = false;
  ms.scheduleRecursiveFuture(null, 0, function () { res = true; });

  t.ok(res, 'should have run');
  t.equal(ms.waitCycles, 0, 'should have no wait cycles');
  t.end();
});

test('Scheduler schedule with time recursive', function (t) {
  var now = new Date().getTime();

  var i = 0;

  var ms = new MyScheduler(now);

  ms.check = function (a, s, tt) {
    t.ok(tt < 10, 'tt should be less than 10');
  };

  ms.scheduleRecursiveFuture(null, 0, function (_, a) { ++i < 10 && a(null, i); });

  t.equal(ms.waitCycles, 45, 'should have 45 wait cycles');
  t.equal(10, i, 'should have run 10 times');
  t.end();
});

test('Scheduler.catch builtin swallow shallow', function (t) {
  var swallow = syncScheduler.catch(function () { return true; });

  swallow.schedule(null, function () { throw new Error('Should be swallowed'); });

  t.ok(true, 'should have been caught');
  t.end();
});

test('Scheduler.catch builtin swallow recursive', function (t) {
  var swallow = syncScheduler.catch(function () { return true; });

  swallow.schedule(42, function (self) {
    return self.schedule(null, function () { new Error('Should be swallowed'); });
  });

  t.ok(true, 'should have been caught');
  t.end();
});

function MyErrorScheduler(onError) {
  this._onError = onError;
  Scheduler.call(this);
}

inherits(MyErrorScheduler, Scheduler);

MyErrorScheduler.prototype.schedule = function (state, action) {
  try {
    return action(this, state);
  } catch (e) {
    this._onError(e);
    return Disposable.empty;
  }
};

MyErrorScheduler.prototype.schedulePeriodic = function (state, period, action) {
  syncScheduler.schedule(this, function (_, self) {
    try {
      var s = state;
      for(var i = 0; true; i++) {
        if (i > 10) { break; }
        s = action(s);
      }
    } catch (e) {
      self._onError(e);
    }
  });
};

test('Scheduler.catch custom unhandled', function (t) {
  var err;

  var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

  scheduler
    .catch(function () { return true; })
    .schedule(null, function () { throw new Error('Should be caught'); });

  t.ok(!err, 'err should not be set');

  var ex1 = 'error';

  scheduler
    .catch(function () { return ex1 instanceof Error; })
    .schedule(null, function () { throw ex1; });

  t.equal(err, ex1, 'should equal error since not caught');
  t.end();
});

test('Scheduler.catch custom periodic caught', function (t) {
  var err;

  var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

  var catcher = scheduler.catch(function () { return true; });

  catcher.schedulePeriodic(42, 0, function () {
    throw new Error('Should be caught');
  });

  t.ok(!err, 'err should not be set');
  t.end();
});

test('Scheduler.catch custom periodic uncaught', function (t) {
  var ex = new Error('Error1');

  var err;

  var scheduler = new MyErrorScheduler(function (e) { err = e; });

  var catcher = scheduler.catch(function (e) { return e instanceof String; });

  catcher.schedulePeriodic(42, 0, function () { throw ex; });

  t.equal(err, ex, 'Error should be set');
  t.end();
});
