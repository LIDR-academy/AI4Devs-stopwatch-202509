'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  CountdownEngine,
  StopwatchEngine,
  TimeFormatter,
  parseDurationValues,
  MS_IN_SECOND,
  MS_IN_MINUTE,
  MS_IN_HOUR,
} = require('../script.js');

test('TimeFormatter formats hours, minutes, seconds and milliseconds', () => {
  assert.deepEqual(TimeFormatter.format(0), { main: '00:00:00', millis: '000' });
  assert.deepEqual(TimeFormatter.format(MS_IN_HOUR + 2 * MS_IN_MINUTE + 3 * MS_IN_SECOND + 4), {
    main: '01:02:03',
    millis: '004',
  });
});

test('StopwatchEngine accumulates elapsed time across pause/resume', () => {
  const stopwatch = new StopwatchEngine();
  stopwatch.start(100);
  assert.equal(stopwatch.getElapsed(250), 150);
  stopwatch.pause(300);
  assert.equal(stopwatch.getElapsed(500), 200);
  stopwatch.start(600);
  assert.equal(stopwatch.getElapsed(900), 500);
});

test('CountdownEngine never returns negative remaining time', () => {
  const countdown = new CountdownEngine(1000);
  countdown.start(0);
  assert.equal(countdown.getRemaining(600), 400);
  assert.equal(countdown.getRemaining(1500), 0);
  assert.equal(countdown.hasFinished(1500), true);
});

test('parseDurationValues clamps unsafe input', () => {
  assert.equal(parseDurationValues('2', '3', '4'), 2 * MS_IN_HOUR + 3 * MS_IN_MINUTE + 4 * MS_IN_SECOND);
  assert.equal(parseDurationValues('-1', '99', 'abc'), 59 * MS_IN_MINUTE);
});
