import * as assert from 'assert';
import { isConsoleLogCorrect } from '../../utils/isConsoleLogCorrect';

suite('isConsoleLogCorrect Tests', () => {
  // Valid console.log usages
  test('should return true for a simple console.log with semicolon', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("hello");'), true);
  });

  test('should return true for a simple console.log without semicolon', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("hello")'), true);
  });

  test('should return true for a console.log with spaces', () => {
    assert.strictEqual(isConsoleLogCorrect('  console.log("test");  '), true);
  });

  test('should return true for a multiline console.log start', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log('), true);
  });

  test('should return true for a multiline console.log with backslash', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("foo", \\'), true);
  });

  test('should return true for a multiline console.log end with );', () => {
    assert.strictEqual(isConsoleLogCorrect(');'), false);
  });

  test('should return true for a multiline console.log end with )', () => {
    assert.strictEqual(isConsoleLogCorrect(')'), false);
  });

  // Invalid usages: comments
  test('should return false for console.log in single-line comment', () => {
    assert.strictEqual(isConsoleLogCorrect('// console.log("test");'), false);
  });

  test('should return false for console.log in block comment (single line)', () => {
    assert.strictEqual(isConsoleLogCorrect('/* console.log("test"); */'), false);
  });

  test('should return false for console.log in block comment start', () => {
    assert.strictEqual(isConsoleLogCorrect('/* console.log("test'), false);
  });

  test('should return false for console.log in block comment middle line', () => {
    assert.strictEqual(isConsoleLogCorrect(' * console.log("test");'), false);
  });

  test('should return false for console.log in block comment end', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("test"); */'), false);
  });

  // Invalid usages: not a console.log
  test('should return false for unrelated code', () => {
    assert.strictEqual(isConsoleLogCorrect('let x = 5;'), false);
  });

  test('should return false for console.log typo', () => {
    assert.strictEqual(isConsoleLogCorrect('console.lg("test");'), false);
  });

  test('should return false for console.log without parentheses', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log;'), false);
  });

  test('should return false for empty string', () => {
    assert.strictEqual(isConsoleLogCorrect(''), false);
  });

  // Edge cases
  test('should return true for console.log with complex arguments', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("a", 1, {b:2});'), true);
  });

  test('should return true for console.log with template literals', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log(`value: ${x}`);'), true);
  });

  test('should return true for console.log with trailing comment', () => {
    assert.strictEqual(isConsoleLogCorrect('console.log("ok"); // trailing comment'), true);
  });
});
