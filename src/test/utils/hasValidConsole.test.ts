import * as assert from 'assert';
import { hasValidConsole } from '../../utils';

suite('hasValidConsole Tests', () => {
  // Valid console.log usages
  test('should return true for a simple console.log with semicolon', () => {
    assert.strictEqual(hasValidConsole('console.log("hello");'), true);
  });

  test('should return true for a simple console.log without semicolon', () => {
    assert.strictEqual(hasValidConsole('console.log("hello")'), true);
  });

  test('should return true for a console.log with spaces', () => {
    assert.strictEqual(hasValidConsole('  console.log("test");  '), true);
  });

  test('should return true for a multiline console.log start', () => {
    assert.strictEqual(hasValidConsole('console.log('), true);
  });

  test('should return true for a multiline console.log with backslash', () => {
    assert.strictEqual(hasValidConsole('console.log("foo", \\'), true);
  });

  test('should return true for a multiline console.log end with );', () => {
    assert.strictEqual(hasValidConsole(');'), false);
  });

  test('should return true for a multiline console.log end with )', () => {
    assert.strictEqual(hasValidConsole(')'), false);
  });

  // Invalid usages: comments
  test('should return false for console.log in single-line comment', () => {
    assert.strictEqual(hasValidConsole('// console.log("test");'), false);
  });

  test('should return false for console.log in block comment (single line)', () => {
    assert.strictEqual(hasValidConsole('/* console.log("test"); */'), false);
  });

  test('should return false for console.log in block comment start', () => {
    assert.strictEqual(hasValidConsole('/* console.log("test'), false);
  });

  test('should return false for console.log in block comment middle line', () => {
    assert.strictEqual(hasValidConsole(' * console.log("test");'), false);
  });

  test('should return false for console.log in block comment end', () => {
    assert.strictEqual(hasValidConsole('console.log("test"); */'), false);
  });

  // Invalid usages: not a console.log
  test('should return false for unrelated code', () => {
    assert.strictEqual(hasValidConsole('let x = 5;'), false);
  });

  test('should return false for console.log typo', () => {
    assert.strictEqual(hasValidConsole('console.lg("test");'), false);
  });

  test('should return false for console.log without parentheses', () => {
    assert.strictEqual(hasValidConsole('console.log;'), false);
  });

  test('should return false for empty string', () => {
    assert.strictEqual(hasValidConsole(''), false);
  });

  // Edge cases
  test('should return true for console.log with complex arguments', () => {
    assert.strictEqual(hasValidConsole('console.log("a", 1, {b:2});'), true);
  });

  test('should return true for console.log with template literals', () => {
    assert.strictEqual(hasValidConsole('console.log(`value: ${x}`);'), true);
  });

  test('should return true for console.log with trailing comment', () => {
    assert.strictEqual(hasValidConsole('console.log("ok"); // trailing comment'), true);
  });
});
