# `QueueScheduler` class

This is much like the `SyncScheduler` but maintains a `PriorityQueue` underneath for keeping items in order for recursive or re-entrant scheduling.  This is useful for operations that can be done synchronously.  This should be used instead of the `SyncScheduler` for recursive scheduling as it has a trampoline feature which allows for greater depths of recursive actions.  Future work scheduling using this scheduler is not permitted.  This class inherits from the [`Scheduler`](scheduler.md) class.

## Usage ##

To show the differences between the `QueueScheduler` and `SyncScheduler`, here is a little mechanism to show how the items are queued using the `QueueScheduler` versus the `SyncScheduler` which executes immediately.  

```js
'use strict';

const SyncScheduler = require('rx.schedulers').SyncScheduler;
const QueueScheduler = require('rx.schedulers').QueueScheduler;

const syncScheduler = new SyncScheduler();
const queueScheduler = new QueueScheduler();

syncScheduler.schedule(42, (scheduler, state) => {
  scheduler.schedule(43, (scheduler, state) => {
    console.log(state);
  });

  console.log(state);
});

// => 43
// => 42

queueScheduler.schedule(84, (scheduler, state) => {
  scheduler.schedule(85, (scheduler, state) => {
    console.log(state);
  });

  console.log(state);
});

// => 84
// => 85
```
