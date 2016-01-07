# `Scheduler` class #

Provides a set of methods available to all scheduler instances.

## Usage ##

The follow example shows the basic usage of an `Scheduler`.

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const disposable = scheduler.schedule(
  'world',
  function (scheduler, x) { console.log(`hello ${x}`); }
);

// => hello world
```

## `Scheduler Instance Methods` ##
- [`catch`](#schedulerprototypecatchhandler)
- [`now`](#schedulerprototypenow)

### Standard Scheduling ###
- [`schedule`](#schedulerprototypeschedulestate-action)
- [`scheduleFuture`](#schedulerprototypeschedulefuturestate-duetime-action)

### Recursive Scheduling ###
- [`scheduleRecursive`](#schedulerprototypeschedulerecursivestate-action)
- [`scheduleRecursiveFuture`](#schedulerprototypeschedulerecursivefuturestate-duetime-action)

### Periodic Scheduling ###
- [`schedulePeriodic`](#schedulerscheduleperiodicstate-period-action)

## `Scheduler` Class Methods ##
- [`normalize`](#schedulernormalizetimespan)
- [`isScheduler`](#schedulerisschedulerobj)

## _Scheduler Instance Methods_ ##

### <a id="schedulerprototypecatchhandler"></a>`Scheduler.prototype.catch(handler)`

Returns a scheduler that wraps the original scheduler, adding exception handling for scheduled actions.

#### Arguments
1. `handler` `Function`: Handler that's run if an exception is caught. The error will be rethrown if the handler returns `false`.

#### Returns
`Scheduler`: Wrapper around the original scheduler, enforcing exception handling.

#### Example

```js
function SchedulerError(message) {
  this.message = message;
  Error.call(this);
}

SchedulerError.prototype = Object.create(Error.prototype);

const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const catchScheduler = scheduler.catch(function (e) {
  return e instanceof SchedulerError;
});

// Throws no exception
const d1 = catchScheduler.schedule(null, function () {
  throw new SchedulerError('woops');
});
```

***

### <a id="schedulerprototypenow"></a>`Scheduler.prototype.now()`

Gets the current time according to the Scheduler implementation.

#### Returns
`Number`: The current time according to the Scheduler implementation.

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const now = scheduler.now();

console.log(now);
// => 1381806323143
```

***

### Standard Scheduling ###

***

### <a id="schedulerprototypeschedulestate-action"></a>`Scheduler.prototype.schedule(state, action)`

Schedules an action to be executed with state.

#### Arguments
1. `state`: Any: State passed to the action to be executed.
2. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
const SyncScheduler = require('rx.schedulers').SyncScheduler;
const scheduler = new SyncScheduler();

const disposable = scheduler.schedule('world', function (scheduler, x) {
 console.log(`hello ${x}`);
});
// => hello world

// Tries to cancel but too late since it is immediate
disposable.dispose();
```

***

### <a id="schedulerprototypeschedulefuturestate-duetime-action"></a>`Scheduler.prototype.scheduleFuture(state, dueTime, action)`

Schedules an action to be executed at the specified relative due time. Note this only works with the built-in `scheduler` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `dueTime` `Number` | `Date`: Relative or absolute time at which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

/* Relative schedule */
const disposable1 = scheduler.scheduleFuture(
  'world',
  5000, /* 5 seconds in the future */
  function (scheduler, x) {
    console.log(`hello ${x} after 5 seconds`);
  }
);
// => hello world after 5 seconds

/* Absolute schedule */
const disposable2 = scheduler.scheduleFuture(
  'world',
  new Date(Date.now() + 5000), /* 5 seconds in the future */
  (scheduler, x) => {
    console.log(`hello ${x} after 5 seconds`);
  }
);
// => hello world after 5 seconds
```

***

### Recursive Scheduling ###

### <a id="schedulerprototypeschedulerecursivestate-action"></a>`Scheduler.prototype.scheduleRecursive(state, action)`

Schedules an action to be executed with state.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `action`: `Function`: Action to execute with the following parameters:
  1. `state`: `Any` - The state passed in
  2. `recurse`: `Function` - The action to execute for recursive actions which takes the form of `recurse(newState)` where the new state is passed to be executed again.

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const disposable = scheduler.scheduleRecursive(
   0,
   (i, recurse) => {
    console.log(i); if (++i < 3) { recurse(i); }
   }
);

// => 0
// => 1
// => 2
```

***

### <a id="schedulerprototypeschedulerecursivefuturestate-duetime-action"></a>`Scheduler.prototype.scheduleRecursiveFuture(state, dueTime, action)`

Schedules an action to be executed recursively at a specified absolute or relative due time. Note this only works with the built-in `Scheduler.timeout` scheduler, as the rest will throw an exception as the framework does not allow for blocking.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `dueTime` `Number`: Absolute time at which to execute the action for the first time.
2. `action`: `Function`: Action to execute with the following parameters:
  1. `state`: `Any` - The state passed in
  2. `recurse`: `Function` - The action to execute for recursive actions which takes the form of `recurse(newState, dueTime)`.

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

/* Absolute recursive future */
const disposable1 = scheduler.scheduleRecursiveFuture(
  0,
  new Date(Date.now() + 5000), /* 5 seconds in the future */
  (i, self) => {
    console.log(i);
    if (++i < 3) {
      // Schedule mutliplied by a second by position
      self(i, new Date(Date.now() + (i * 1000)));
    }
  }
);

// => 0
// => 1
// => 2

/* Relative recursive future */
const disposable2 = scheduler.scheduleRecursiveFuture(
  0,
  5000, /* 5 seconds in the future */
  (i, self) => {
    console.log(i);
    if (++i < 3) {
      // Schedule mutliplied by a second by position
      self(i, i * 1000);
    }
  }
);

// => 0
// => 1
// => 2
```

***

### Periodic Scheduling ###

### <a id="schedulerscheduleperiodicstate-period-action"></a>`Scheduler.prototype.schedulePeriodic(state, period, action)`

Schedules a periodic piece of work by dynamically discovering the scheduler's capabilities. The periodic task will be scheduled using `window.setInterval` for the base implementation.

#### Arguments
1. `state` `Any`: State passed to the action to be executed.
2. `period` `Number`: Period for running the work periodically in ms.
3. `action`: `Function`: Action to execute with the following parameters.  Note that the return value from this function becomes the state in the next execution of the action.
  1. `state`: `Any` - The state passed in

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const disposable = scheduler.schedulePeriodic(
  0,
  1000, /* 1 second */
  (i) => {
    console.log(i);

    // After three times, dispose
    if (++i > 3) { disposable.dispose(); }

    return i;
});

// => 0
// => 1
// => 2
// => 3
```

***

## _Scheduler Class Methods_ ##

### <a id="schedulernormalizetimespan"></a>`Scheduler.normalize(timeSpan)`

Normalizes the specified time span value to a positive value.

#### Arguments
1. `timeSpan` `Number`: The time span value to normalize.

#### Returns
`Number`: The specified time span value if it is zero or positive; otherwise, 0

#### Example

```js
const Scheduler = require('rx.schedulers').Scheduler;

const r1 = Scheduler.normalize(-1);
console.log(r1);
// => 0

const r2 = Scheduler.normalize(255);
console.log(r2);
// => 255
```

***

### <a id="schedulerisschedulerobj"></a>`Scheduler.isScheduler(obj)`

Determines whether the given object is a `Scheduler` instance

#### Arguments
1. `obj` `Any`: The object to determine whether it is a `Scheduler` instance

#### Returns
`Boolean`: Whether the given object is a Scheduler.

#### Example

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const Scheduler = require('rx.schedulers').Scheduler;

const isScheduler = Scheduler.isScheduler(scheduler);

console.log(`Is scheduler? ${Scheduler.isScheduler(scheduler)}`);
// Is scheduler? true
```

***
