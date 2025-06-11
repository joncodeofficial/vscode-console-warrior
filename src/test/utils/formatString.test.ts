import * as assert from 'assert';
import { formatString } from '../../utils/formatString';

suite('formatString Tests', () => {
  test('should remove literal newlines', () => {
    assert.equal(formatString('Hello\nWorld'), 'Hello\nWorld');
  });

  test('should remove literal tabs', () => {
    assert.equal(formatString('Hello\tWorld'), 'Hello\tWorld');
  });

  test('should trim spaces at start and end', () => {
    assert.equal(formatString('   Hello World   '), 'Hello World');
  });

  test('should replace multiple spaces with one', () => {
    assert.equal(formatString('Hello    World'), 'Hello World');
  });
});
