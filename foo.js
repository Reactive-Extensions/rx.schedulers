'use strict';

function comparer (x, y) {
  if (x > y) { return 1; }
  if (y > x) { return -1; }
  return 0;
}

const HistoricalScheduler = require('./.').HistoricalScheduler;
const EventEmitter = require('events').EventEmitter;

// Initial data
let initialDate = 0;
const scheduler = new HistoricalScheduler(new Date(initialDate), comparer);

// Yield unto this event emitter
var e = new EventEmitter();

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
