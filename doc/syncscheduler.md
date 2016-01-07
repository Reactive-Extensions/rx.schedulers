# `SyncScheduler` class

This is a synchronous scheduler which does the bare bones basics of executing an item as soon as it is scheduled.  This is useful for operations that can be done synchronously.  Future work scheduling using this scheduler is not permitted.  This class inherits from the [`Scheduler`](scheduler.md) class.

## Usage ##

The follow example shows the basic usage of a `SyncScheduler`.

```js
const SyncScheduler = require('rx.schedulers').SyncScheduler;
const scheduler = new SyncScheduler();

const disposable = scheduler.schedule(
  'world',
  function (scheduler, x) { console.log(`hello ${x}`); }
);

// => hello world
```
