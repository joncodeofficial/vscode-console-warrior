import * as assert from 'assert';
import { isPositionInsideConsole } from '../../utils';

suite('isPositionInsideConsole Tests', () => {
  test('should return false for a position outside of console.log', () => {
    assert.equal(isPositionInsideConsole('console.log("hello");', 0), false);
  });

  test('should return true for a position inside of console.log', () => {
    assert.equal(isPositionInsideConsole('console.log("hello")', 14), true);
  });

  test('should return true for a position inside of console.log in final console ', () => {
    assert.equal(
      isPositionInsideConsole('console.log("user:", user, "age:", getAge());', 44),
      true
    );
  });

  test('should return true for a position inside of console.log with multiple parentheses', () => {
    assert.equal(isPositionInsideConsole('console.log(((((value)))));', 23), true);
  });
});
