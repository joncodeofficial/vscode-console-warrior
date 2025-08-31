import * as assert from 'assert';
import { formatLocalTimestamp } from '../../utils';

suite('formatLocalTimestamp Tests', () => {
  test('should return "00:00:00.000" for invalid inputs', () => {
    assert.strictEqual(formatLocalTimestamp('invalid timestamp'), '00:00:00.000');
    assert.strictEqual(formatLocalTimestamp(NaN), '00:00:00.000');
    assert.strictEqual(formatLocalTimestamp(''), '00:00:00.000');
  });

  test('should format ISO string timestamp correctly', () => {
    const isoString = '2024-01-15T14:30:45.123Z';
    const result = formatLocalTimestamp(isoString);
    // Verify format pattern HH:MM:SS.sss
    assert.ok(/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(result));
    assert.strictEqual(result.length, 12);
  });

  test('should format numeric timestamp correctly', () => {
    const numericTimestamp = 1705329045123;
    const result = formatLocalTimestamp(numericTimestamp);
    assert.ok(/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(result));
  });

  test('should handle timestamp without fractional seconds', () => {
    const timestamp = '2024-01-15T14:30:45Z';
    const result = formatLocalTimestamp(timestamp);
    assert.ok(result.endsWith('.000'));
    assert.ok(/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(result));
  });

  test('should use 24-hour format', () => {
    const timestamp = '2024-01-15T14:30:45.123Z';
    const result = formatLocalTimestamp(timestamp);
    assert.ok(!result.includes('AM') && !result.includes('PM'));
  });

  test('should handle edge case timestamps', () => {
    const epochTimestamp = 0; // 1970-01-01
    const result = formatLocalTimestamp(epochTimestamp);
    assert.ok(/^\d{2}:\d{2}:\d{2}\.\d{3}$/.test(result));
    assert.strictEqual(result.length, 12);
  });

  test('should pad single digits with zeros', () => {
    // Test with a timestamp that would have single digits in some timezones
    const timestamp = '2024-01-01T01:02:03.004Z';
    const result = formatLocalTimestamp(timestamp);
    // Verify format: all parts should be properly padded
    const parts = result.split(':');
    assert.strictEqual(parts[0].length, 2); // hours
    assert.strictEqual(parts[1].length, 2); // minutes
    assert.strictEqual(parts[2].split('.')[0].length, 2); // seconds
    assert.strictEqual(parts[2].split('.')[1].length, 3); // milliseconds
  });
});
