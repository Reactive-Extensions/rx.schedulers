# `VirtualTimeScheduler` class #

Base class for providing scheduling in virtual time.  This inherits from the [`Scheduler`](scheduler.md) class.

## Usage ##

The following shows an example of using the `VirtualTimeScheduler`. In order for this to work, you must implement the `add`, `toAbsoluteTime` and `toRelativeTime` methods as described below.

```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;

/* Comparer required for scheduling priority */
function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

const scheduler = new VirtualTimeScheduler(0, comparer);

/**
 * Adds a relative time value to an absolute time value.
 * @param {Any} absolute Absolute virtual time value.
 * @param {Any} relative Relative virtual time value to add.
 * @return {Any} Resulting absolute virtual time sum value.
 */
scheduler.add = (absolute, relative) => {
  return absolute + relative;
};

/**
 * Converts an absolute time to a number
 * @param {Number} The absolute time in ms
 * @returns {Number} The absolute time in ms
 */
scheduler.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

/**
 * Converts the time span number/Date to a relative virtual time value.
 * @param {Number} timeSpan TimeSpan value to convert.
 * @return {Number} Corresponding relative virtual time value.
 */
scheduler.toRelativeTime = function (timeSpan) {
  return timeSpan;
};

// Schedule some time
scheduler.scheduleAbsolute(null, new Date(1), () => { console.log('foo'); });
scheduler.scheduleAbsolute(null, new Date(2), () => { console.log('bar'); });
scheduler.scheduleAbsolute(null, new Date(3), () => { scheduler.stop(); });

// Start the scheduler
scheduler.start();

// => foo
// => bar

// Check the clock once stopped
console.log(scheduler.now());
// => 3

console.log(scheduler.clock);
// => 3
```
### Location

## `VirtualTimeScheduler Constructor` ##
- [`constructor`](#virtualtimeschedulerinitialclock-comparer)

## `VirtualTimeScheduler Instance Methods` ##
- [`advanceBy`](#virtualtimeschedulerprototypeadvancebytime)
- [`advanceTo`](#virtualtimeschedulerprototypeadvancetotime)
- [`scheduleAbsolute`](#virtualtimeschedulerprototypescheduleabsolutestate-duetime-action)
- [`scheduleRelative`](#virtualtimeschedulerprototypeschedulerelativestate-duetime-action)
- [`sleep`](#virtualtimeschedulerprototypesleeptime)
- [`start`](#virtualtimeschedulerprototypestart)
- [`stop`](#virtualtimeschedulerprototypestop)

## `VirtualTimeScheduler Instance Properties` ##
- [`isEnabled`](#isenabled)

## `VirtualTimeScheduler Protected Abstract Methods` ##
- [`add`](#virtualtimeschedulerprototypeaddabsolute-relative)
- [`toAbsoluteTime`](#virtualtimeschedulerprototypetoabsolutetimeabsolute)
- [`toRelativeTime`](#virtualtimeschedulerprototypetorelativetimetimespan)

## `VirtualTimeScheduler Protected Methods` ##
- [`getNext`](#virtualtimeschedulerprototypegetnext)

## Inherited Classes ##
- [`Scheduler`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/schedulers/scheduler.md)

## _VirtualTimeScheduler Constructor_ ##

### <a id="virtualtimescheduler"></a>`VirtualTimeScheduler(initialClock, comparer)`

Creates a new virtual time scheduler with the specified initial clock value and absolute time comparer.

#### Arguments
  1. `initialClock` `Function`: Initial value for the clock.
2. `comparer` `Function`: Comparer to determine causality of events based on absolute time.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;

function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

const scheduler = new VirtualTimeScheduler(
  0,          /* initial clock of 0 */
  comparer    /* comparer for determining order */
);
```

***

## _VirtualTimeScheduler Instance Methods_ ##

### <a id="virtualtimeschedulerprototypeadvancebytime"></a>`VirtualTimeScheduler.prototype.advanceBy(time)`

Advances the scheduler's clock by the specified relative time, running all work scheduled for that timespan.

#### Arguments
1. `time` `Any`: Relative time to advance the scheduler's clock by.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  200 /* initial time */
);

scheduler.scheduleAbsolute(null, 250, () => {
  console.log('hello');
});

scheduler.advanceBy(300);
// => hello

console.log(scheduler.clock);
// => 500
```

***

### <a id="virtualtimeschedulerprototypeadvancetotime"></a>`VirtualTimeScheduler.prototype.advanceTo(time)`
<a href="#virtualtimeschedulerprototypeadvancetotime">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/concurrency/virtualtimescheduler.js "View in source")

Advances the scheduler's clock to the specified time, running all work till that point.

#### Arguments
1. `time` `Any`: Absolute time to advance the scheduler's clock to.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleAbsolute(null, 100, () => {
  console.log('hello');
});

scheduler.scheduleAbsolute(null, 200, () => {
  console.log('world');
});

scheduler.advanceBy(300);
// => hello
// => world

console.log(scheduler.clock);
// => 300
```

***

### <a id="virtualtimeschedulerprototypescheduleabsolutestate-duetime-action"></a>`VirtualTimeScheduler.prototype.scheduleAbsolute(state, dueTime, action)`

Schedules an action to be executed at dueTime.

#### Arguments
1. `state`: `Any`: State passed to the action to be executed.
2. `dueTime` `Any`: Absolute time at which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleAbsolute('world', 100, (scheduler, state) => {
  console.log(`hello ${state}`);
});

scheduler.scheduleAbsolute('moon', 200, (scheduler, state) => {
  console.log(`goodnight ${state}`);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 200
```

***

### <a id="virtualtimeschedulerprototypeschedulerelativestate-duetime-action"></a>`VirtualTimeScheduler.prototype.scheduleRelative(state, dueTime, action)`

Schedules an action to be executed at dueTime.

#### Arguments
1. `state`: `Any`: State passed to the action to be executed.
2. `dueTime` `Any`: Relative time after which to execute the action.
3. `action`: `Function`: Action to execute with the following arguments:
  1. `scheduler`: `Scheduler` - The current Scheduler
  2. `state`: `Any` - The current state

#### Returns
`Disposable`: The disposable object used to cancel the scheduled action (best effort).

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, (scheduler, state) => {
  console.log(`hello ${state}`);
});

scheduler.scheduleRelative('moon', 200, (scheduler, state) => {
  console.log(`goodnight ${state}`);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 300
```

***

### <a id="virtualtimeschedulerprototypesleeptime"></a>`VirtualTimeScheduler.prototype.sleep(time)`

Advances the scheduler's clock by the specified relative time.

#### Arguments
1. `time` `Any`: Relative time to advance the scheduler's clock by.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.sleep(400);

console.log(scheduler.clock);
// => 400
```

***

### <a id="virtualtimeschedulerprototypestart"></a>`VirtualTimeScheduler.prototype.start()`

Starts the virtual time scheduler.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, (scheduler, state) => {
  console.log(`hello ${state}`);
});

scheduler.scheduleRelative('moon', 200, (scheduler, state) => {
  console.log(`goodnight ${state}`);
});

scheduler.start();
// => hello world
// => goodnight moon

console.log(scheduler.clock);
// => 400
```

***

### <a id="virtualtimeschedulerprototypestop"></a>`VirtualTimeScheduler.prototype.stop()`

Stops the virtual time scheduler.

#### Example
```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};

const scheduler = new MyVirtualScheduler(
  0 /* initial time */
);

scheduler.scheduleRelative('world', 100, (scheduler, state) => {
  console.log(`hello ${state}`);
});

scheduler.scheduleRelative(null, 200, (scheduler, state) => {
  scheduler.stop();
});

scheduler.scheduleRelative(null, 300, (scheduler, state) => {
  console.log(`goodbye cruel ${state}`);
});

scheduler.start();
// => hello world
```

***

## _VirtualTimeScheduler Abstract Protected Methods_ ##

### <a id="virtualtimeschedulerprototypeaddabsolute-relative"></a>`VirtualTimeScheduler.prototype.add(absolute, relative)`
<a href="#virtualtimeschedulerprototypeaddabsolute-relative">#</a> [&#x24C8;](https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/subjects/asyncsubject.js#L54 "View in source")

Adds a relative time value to an absolute time value.  This method is used in several methods including `scheduleRelative`, `advanceBy` and `sleep`.

### Arguments
1. `absolute` `Any`: Absolute virtual time value.
2. `relative` `Any`: Relative virtual time value.

#### Returns
`Any`: Resulting absolute virtual time sum value.

#### Example

One possible implementation could be as simple as the following:

```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.add = (absolute, relative) => {
  return absolute + relative;
};
```

***

### <a id="virtualtimeschedulerprototypetoabsolutetimeabsolute"></a>`VirtualTimeScheduler.prototype.toAbsoluteTime(absolute)`

Converts an absolute time to a number.  This is used directly in the `now` method on the `Scheduler`

### Arguments
1. `absolute` `Any`: The absolute time to convert.

#### Returns
`Number`: The absolute time in ms.

#### Example

One possible implementation could be as simple as the following:

```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.toAbsoluteTime = (absolute) => {
  return +new Date(absolute);
};
```

***

### <a id="virtualtimeschedulerprototypetorelativetimetimespan"></a>`VirtualTimeScheduler.prototype.toRelativeTime(timeSpan)`

Converts the time span number/Date to a relative virtual time value.

### Arguments
1. `timeSpan` `Any`: The time span number value to convert.  This is used directly in `scheduleFuture`.

#### Returns
`Number`: Corresponding relative virtual time value.

#### Example

One possible implementation could be as simple as the following:

```js
const VirtualTimeScheduler = require('rx.schedulers').VirtualTimeScheduler;
const inherits = require('inherits');

// Number -> Number
function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
};

function MyVirtualScheduler(initialState) {
  VirtualTimeScheduler.call(this, initialState, comparer);
}

inherits(MyVirtualScheduler, VirtualTimeScheduler);

MyVirtualScheduler.prototype.toRelativeTime = (timeSpan) => {
  return timeSpan;
};
```

***
