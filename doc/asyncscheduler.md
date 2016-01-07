# `AsyncScheduler` class

This is an asynchronous scheduler which for immediate scheduling uses the fastest mechanism available such as `setImmediate`, `process.nextTick`, `window.postMessage`, `MessageChannel` or even down to `setTimeout` if none of those are available.  For future scheduling, `setTimeout` is used.  This class inherits from the [`Scheduler`](scheduler.md) class.

## Usage ##

The follow example shows the basic usage of an `AsyncScheduler`.

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const disposable = scheduler.schedule(
  'world',
  function (scheduler, x) { console.log(`hello ${x}`); }
);

// => hello world
```
