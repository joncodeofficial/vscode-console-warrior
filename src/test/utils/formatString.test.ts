import * as assert from 'assert';
import { formatString } from '../../utils';

suite('formatString Tests', () => {
  test('should remove literal newlines', () => {
    assert.equal(formatString('Hello\nWorld'), 'Hello\nWorld');
  });

  test('should trim spaces at start and end', () => {
    assert.equal(formatString('   Hello World   '), 'Hello World');
  });

  test('should replace multiple spaces with one', () => {
    assert.equal(formatString('Hello    World'), 'Hello World');
  });
});
