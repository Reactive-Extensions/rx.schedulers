# `AnimationScheduler` class

This is an asynchronous scheduler which for immediate scheduling uses `requestAnimationFrame` if available, else defaults to `setTimeout`.  This is useful for operations that could benefit from animation work.  For future scheduling, `setTimeout` is used.  This class inherits from the [`Scheduler`](scheduler.md) class.

## Usage ##

The follow example shows the basic usage of an `AnimationScheduler`.

```js
const AnimationScheduler = require('rx.schedulers').AnimationScheduler;
const scheduler = new AnimationScheduler();

const disposable = scheduler.schedule(
  'world',
  function (scheduler, x) { console.log(`hello ${x} via requestAnimationFrame`); }
);

// => hello world via requestAnimationFrame
```
