# `ScheduledDisposable` class #

Represents a class which schedules the `dispose` to occur on the specified scheduler.

## Usage ##

The follow example shows the basic usage of a `ScheduledDisposable`.

```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);
disposable.dispose();
// => one
```

## `ScheduledDisposable` Constructor ##
- [`constructor`](#scheduleddisposabledisposable-scheduler)

## `ScheduledDisposable` Instance Methods ##
- [`dispose`](#scheduleddisposableprototypedispose)

## `ScheduledDisposable` Instance Properties ##
- [`disposable`](#disposable)
- [`isDisposed`](#isdisposed)
- [`scheduler`](#scheduler)

## _ScheduledDisposable Constructor_ ##

### <a id="scheduleddisposabledisposable-scheduler"></a>`ScheduledDisposable(disposable, scheduler)`

Creates a scheduled disposable which disposes the given disposable on the given scheduler.

#### Arguments
1. `disposable`: `Disposable` - The disposable that will be disposed on the given scheduler.
2. `scheduler`: `Scheduler` - The scheduler used to dispose the disposable.

#### Example
```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);
disposable.dispose();
// => one
```

* * *

## _ScheduledDisposable Instance Methods_ ##

### <a id="scheduleddisposableprototypedispose"></a>`ScheduledDisposable.prototype.dispose()`

Disposes the underlying disposable by scheduling it on the specified scheduler.

#### Example

```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);
disposable.dispose();
// => one
```
* * *

## _ScheduledDisposable Instance Properties_ ##

### <a id="disposable"></a>`disposable`

Gets the underlying disposable.

#### Example
```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);

console.log(d1 === disposable.disposable);
// => true
```

* * *

### <a id="isdisposed"></a>`isDisposed`

Gets a value that indicates whether the object is disposed.

#### Example
```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);

console.log(disposable.isDisposed);
// => false

disposable.dispose();
// => disposed

console.log(disposable.isDisposed);
// => true
```

* * *

### <a id="scheduler"></a>`scheduler`

Gets the underlying scheduler.

#### Example
```js
const Disposable = require('rx.disposables').Disposable;
const ScheduledDisposable = require('rx.schedulers').ScheduledDisposable;
const AsyncScheduler = require('rx.schedulers').AsyncScheduler;
const scheduler = new AsyncScheduler();

const d1 = Disposable.create(() => console.log('one'));

const disposable = new ScheduledDisposable(scheduler, d1);

console.log(scheduler === disposable.scheduler);
// => true
```

* * *
