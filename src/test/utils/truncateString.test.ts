import * as assert from 'assert';
import { truncateString } from '../../utils';
import { MAX_MESSAGE_LENGTH } from '../../constants';

suite('truncateString Tests', () => {
  test('should return the original string if shorter than MAX_MESSAGE_LENGTH', () => {
    const input = 'short string';
    assert.strictEqual(truncateString(input), input);
  });

  test('should return the original string if length is exactly MAX_MESSAGE_LENGTH', () => {
    const input = 's'.repeat(MAX_MESSAGE_LENGTH);
    assert.strictEqual(truncateString(input), input);
  });

  test("should truncate and append ' ...' if string is longer than MAX_MESSAGE_LENGTH", () => {
    const input = 's'.repeat(MAX_MESSAGE_LENGTH + 1);
    const expected = 's'.repeat(MAX_MESSAGE_LENGTH) + ' ...';
    assert.strictEqual(truncateString(input), expected);
  });
});
