import * as assert from 'assert';
import { getPortFromUrl } from '../../utils';

suite('getPortFromUrl Tests', () => {
  test('should return empty string if no port is found', () => {
    assert.strictEqual(getPortFromUrl('http://localhost'), '');
  });

  test('should return port if port is found', () => {
    assert.strictEqual(getPortFromUrl('http://localhost:3000'), '3000');
  });

  test('should return port if port is found with a trailing slash', () => {
    assert.strictEqual(getPortFromUrl('http://localhost:3000/'), '3000');
  });

  test('should return port if port is found with a query parameter', () => {
    assert.strictEqual(getPortFromUrl('http://localhost:3000/?foo=bar'), '3000');
  });
});
