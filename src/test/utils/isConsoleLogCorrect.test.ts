import * as assert from 'assert';
import { isConsoleCorrect } from '../../utils';

suite('isConsoleCorrect Tests', () => {
  // Valid console.log usages
  test('should return true for a simple console.log with semicolon', () => {
    assert.strictEqual(isConsoleCorrect('console.log("hello");'), true);
  });

  test('should return true for a simple console.log without semicolon', () => {
    assert.strictEqual(isConsoleCorrect('console.log("hello")'), true);
  });

  test('should return true for a console.log with spaces', () => {
    assert.strictEqual(isConsoleCorrect('  console.log("test");  '), true);
  });

  test('should return true for a multiline console.log start', () => {
    assert.strictEqual(isConsoleCorrect('console.log('), true);
  });

  test('should return true for a multiline console.log with backslash', () => {
    assert.strictEqual(isConsoleCorrect('console.log("foo", \\'), true);
  });

  test('should return true for a multiline console.log end with );', () => {
    assert.strictEqual(isConsoleCorrect(');'), false);
  });

  test('should return true for a multiline console.log end with )', () => {
    assert.strictEqual(isConsoleCorrect(')'), false);
  });

  // Invalid usages: comments
  test('should return false for console.log in single-line comment', () => {
    assert.strictEqual(isConsoleCorrect('// console.log("test");'), false);
  });

  test('should return false for console.log in block comment (single line)', () => {
    assert.strictEqual(isConsoleCorrect('/* console.log("test"); */'), false);
  });

  test('should return false for console.log in block comment start', () => {
    assert.strictEqual(isConsoleCorrect('/* console.log("test'), false);
  });

  test('should return false for console.log in block comment middle line', () => {
    assert.strictEqual(isConsoleCorrect(' * console.log("test");'), false);
  });

  test('should return false for console.log in block comment end', () => {
    assert.strictEqual(isConsoleCorrect('console.log("test"); */'), false);
  });

  // Invalid usages: not a console.log
  test('should return false for unrelated code', () => {
    assert.strictEqual(isConsoleCorrect('let x = 5;'), false);
  });

  test('should return false for console.log typo', () => {
    assert.strictEqual(isConsoleCorrect('console.lg("test");'), false);
  });

  test('should return false for console.log without parentheses', () => {
    assert.strictEqual(isConsoleCorrect('console.log;'), false);
  });

  test('should return false for empty string', () => {
    assert.strictEqual(isConsoleCorrect(''), false);
  });

  // Edge cases
  test('should return true for console.log with complex arguments', () => {
    assert.strictEqual(isConsoleCorrect('console.log("a", 1, {b:2});'), true);
  });

  test('should return true for console.log with template literals', () => {
    assert.strictEqual(isConsoleCorrect('console.log(`value: ${x}`);'), true);
  });

  test('should return true for console.log with trailing comment', () => {
    assert.strictEqual(isConsoleCorrect('console.log("ok"); // trailing comment'), true);
  });
});
