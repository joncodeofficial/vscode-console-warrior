import * as assert from "assert";
import { truncateString } from "../../utils/truncateString";
import { MAX_MESSAGE_LENGTH } from "../../constants";

suite("truncateString Tests", () => {
  test("should return the original string if shorter than MAX_MESSAGE_LENGTH", () => {
    const input = "short string";
    assert.strictEqual(truncateString(input), input);
  });

  test("should return the original string if length is exactly MAX_MESSAGE_LENGTH", () => {
    const input = "a".repeat(MAX_MESSAGE_LENGTH);
    assert.strictEqual(truncateString(input), input);
  });

  test("should truncate and append ' ...' if string is longer than MAX_MESSAGE_LENGTH", () => {
    const input = "b".repeat(MAX_MESSAGE_LENGTH + 5);
    const expected = "b".repeat(MAX_MESSAGE_LENGTH) + " ...";
    assert.strictEqual(truncateString(input), expected);
  });
});
