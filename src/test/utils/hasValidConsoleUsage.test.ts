import * as assert from 'assert';
import { hasValidConsoleUsage } from '../../utils';

suite('hasValidConsoleUsage Tests', () => {
  // Valid console.log usages
  test('should return true for a simple console.log with semicolon', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("hello");'), true);
  });

  test('should return true for a simple console.log without semicolon', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("hello")'), true);
  });

  test('should return true for a console.log with spaces', () => {
    assert.strictEqual(hasValidConsoleUsage('  console.log("test");  '), true);
  });

  test('should return true for a multiline console.log start', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log('), true);
  });

  test('should return true for a multiline console.log with backslash', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("foo", \\'), true);
  });

  test('should return true for a multiline console.log end with );', () => {
    assert.strictEqual(hasValidConsoleUsage(');'), false);
  });

  test('should return true for a multiline console.log end with )', () => {
    assert.strictEqual(hasValidConsoleUsage(')'), false);
  });

  // Invalid usages: comments
  test('should return false for console.log in single-line comment', () => {
    assert.strictEqual(hasValidConsoleUsage('// console.log("test");'), false);
  });

  test('should return false for console.log in block comment (single line)', () => {
    assert.strictEqual(hasValidConsoleUsage('/* console.log("test"); */'), false);
  });

  test('should return false for console.log in block comment start', () => {
    assert.strictEqual(hasValidConsoleUsage('/* console.log("test'), false);
  });

  test('should return false for console.log in block comment middle line', () => {
    assert.strictEqual(hasValidConsoleUsage(' * console.log("test");'), false);
  });

  test('should return false for console.log in block comment end', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("test"); */'), false);
  });

  // Invalid usages: not a console.log
  test('should return false for unrelated code', () => {
    assert.strictEqual(hasValidConsoleUsage('let x = 5;'), false);
  });

  test('should return false for console.log typo', () => {
    assert.strictEqual(hasValidConsoleUsage('console.lg("test");'), false);
  });

  test('should return false for console.log without parentheses', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log;'), false);
  });

  test('should return false for empty string', () => {
    assert.strictEqual(hasValidConsoleUsage(''), false);
  });

  // Edge cases
  test('should return true for console.log with complex arguments', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("a", 1, {b:2});'), true);
  });

  test('should return true for console.log with template literals', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log(`value: ${x}`);'), true);
  });

  test('should return true for console.log with trailing comment', () => {
    assert.strictEqual(hasValidConsoleUsage('console.log("ok"); // trailing comment'), true);
  });
});
