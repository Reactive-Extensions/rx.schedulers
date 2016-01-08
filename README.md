[![Build Status](https://travis-ci.org/Reactive-Extensions/rx.schedulers.svg)](https://travis-ci.org/Reactive-Extensions/rx.schedulers)
[![GitHub version](https://img.shields.io/github/tag/reactive-extensions/rx.schedulers.svg)](https://github.com/Reactive-Extensions/rx.schedulers)
[![NPM version](https://img.shields.io/npm/v/rx.schedulers.svg)](https://www.npmjs.com/package/rx.schedulers)
[![Downloads](https://img.shields.io/npm/dm/rx.schedulers.svg)](https://www.npmjs.com/package/rx.schedulers)
# `rx.schedulers` - RxJS Schedulers

This is a standalone version of the RxJS scheduler classes which can schedule work both now and in the future with relative and absolute time. This allows for scheduling in virtual time with both historical and virtual time.

This includes the following disposables with their documentation:
- [`AnimationScheduler`](doc/animationscheduler)
- [`AsyncScheduler`](doc/asyncscheduler)
- [`HistoricalScheduler`](doc/historicalscheduler.md)
- [`QueueScheduler`](doc/queuescheduler.md)
- [`Scheduler`](doc/scheduler.md)
- [`SyncScheduler`](doc/syncscheduler.md)
- [`VirtualTimeScheduler`](doc/virtualtimescheduler)

## Installation

The `rx.schedulers` library can be installed by the following:

### NPM
```bash
$ npm install rx.schedulers
```

## Usage

Here is some basic usage a simple `AsyncScheduler` to schedule some work asynchronously as soon as possible.

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;

const scheduler = new AsyncScheduler();

// Schedule work async as soon as possible
const disposable = scheduler.schedule('hello world', function (scheduler, state) {
  console.log(state);
});
// => hello world
```

We can also schedule work in the future with relative time, such as 5 seconds from now.

```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;

const scheduler = new AsyncScheduler();

// Schedule work async after 5 seconds
const disposable = scheduler.scheduleFuture('hello world', 5000, function (scheduler, state) {
  console.log(state);
});
// => hello world
```

We can also schedule recursively, for example if we want to execute an item 10 times, we can do the following code.  Note that we can also schedule recursively in the future using absolute and relative time much as we did above.
```js
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;

const scheduler = new AsyncScheduler();

scheduler.scheduleRecursive(0, (state, recurse) => {
  if (state < 10) {
    console.log(`State is ${state}`);
    recurse(state + 1);
  }
});
/*
State is 0
State is 1
State is 2
State is 3
State is 4
State is 5
State is 6
State is 7
State is 8
State is 9
*/
```

We can also schedule items periodically using the `schedulePeriodic` method:
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

There are plenty more options available by reading the documentation linked above.

## Contributing

We appreciate any contributions by the community as long as they abide by the [Code of Conduct](code-of-conduct.md).

Want to get started?  Here are some ways you can get involved.

1. Documentation

    - Examples
    - How Do I?
    - API Documentation

2. Code

    - Additional disposables
    - Unit tests

# LICENSE

The MIT License (MIT)

Copyright (c) 2016 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
