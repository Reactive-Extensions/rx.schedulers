'use strict';

var VirtualTimeScheduler = require('./virtualtimescheduler');
var inherits = require('inherits');
var defaultComparer = require('./internal/comparer');

/**
 * Creates a new historical scheduler with the specified initial clock value.
 * @constructor
 * @param {Number} initialClock Initial value for the clock.
 * @param {Function} comparer Comparer to determine causality of events based on absolute time.
 */
function HistoricalScheduler(initialClock, comparer) {
  var clock = initialClock == null ? 0 : initialClock;
  var cmp = comparer || defaultComparer;
  VirtualTimeScheduler.call(this, clock, cmp);
}

inherits(HistoricalScheduler, VirtualTimeScheduler);

/**
 * Adds a relative time value to an absolute time value.
 * @param {Number} absolute Absolute virtual time value.
 * @param {Number} relative Relative virtual time value to add.
 * @return {Number} Resulting absolute virtual time sum value.
 */
HistoricalScheduler.prototype.add = function (absolute, relative) {
  return absolute + relative;
};

HistoricalScheduler.prototype.toAbsoluteTime = function (absolute) {
  return new Date(absolute).getTime();
};

/**
 * Converts the TimeSpan value to a relative virtual time value.
 * @memberOf HistoricalScheduler
 * @param {Number} timeSpan TimeSpan value to convert.
 * @return {Number} Corresponding relative virtual time value.
 */
HistoricalScheduler.prototype.toRelativeTime = function (timeSpan) {
  return timeSpan;
};

module.exports = HistoricalScheduler;
