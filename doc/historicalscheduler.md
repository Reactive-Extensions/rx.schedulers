### `HistoricalScheduler` class

Provides a virtual time scheduler that uses a `Date` for absolute time and time spans for relative time.  This inherits from the [`VirtualTimeScheduler`](virtualtimescheduler.md) class.

## Usage ##

The following shows an example of using the `HistoricalScheduler`.  This shows creating a minute's worth of data from January 1st, 1970.

```js
function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
}

const HistoricalScheduler = require('rx.schedulers').HistoricalScheduler;
const EventEmitter = require('events').EventEmitter;

// Initial data
let initialDate = 0;
const scheduler = new HistoricalScheduler(new Date(initialDate), comparer);

// Yield unto this event emitter
const e = new EventEmitter();

// Some random data
function getData(time) {
  return Math.floor(Math.random() * (time + 1));
}

// Enqueue 1 minute's worth of data
while (initialDate <= 60000) {

  (function (i) {

    scheduler.scheduleFuture(i, new Date(i), (s, i) => {
      e.emit('data', { value: getData(i), date: new Date(i) });
    });

  }(initialDate));

  initialDate += 10000;
}

// set up listener
e.on('data', (x) => {
  console.log(`value: ${x.value}`);
  console.log(`date: ${x.date.toGMTString()}`);
});

// Run it
scheduler.start();

// => value: 0
// => date: Thu, 1 Jan 1970 00:00:00 UTC
// => value: 2013
// => date: Thu, 1 Jan 1970 00:00:10 UTC
// => value: 5896
// => date: Thu, 1 Jan 1970 00:00:20 UTC
// => value: 5415
// => date: Thu, 1 Jan 1970 00:00:30 UTC
// => value: 13411
// => date: Thu, 1 Jan 1970 00:00:40 UTC
// => value: 15518
// => date: Thu, 1 Jan 1970 00:00:50 UTC
// => value: 51076
// => date: Thu, 1 Jan 1970 00:01:00 UTC
```

## `HistoricalScheduler Constructor` ##
- [`constructor`](#historicalschedulerinitialclock-comparer)

## Inherited Classes ##
- [`VirtualTimeScheduler`](VirtualTimeScheduler.md)

## _HistoricalScheduler Constructor_ ##

### `HistoricalScheduler([initialClock], [comparer])`

Creates a new historical scheduler with the specified initial clock value.

#### Arguments
1. [`initialClock`] *(Function)*: Initial value for the clock.
2. [`comparer`] *(Function)*: Comparer to determine causality of events based on absolute time.

#### Example
```js
const HistoricalScheduler = require('rx.schedulers').HistoricalScheduler;

function comparer (x, y) {
  if (x > y) { return 1; }
  if (x < y) { return -1; }
  return 0;
}

const scheduler = new HistoricalScheduler(
  new Date(0),  /* initial clock of 0 */
  comparer      /* comparer for determining order */
);
```
