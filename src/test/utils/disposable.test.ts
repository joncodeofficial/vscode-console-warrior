import * as assert from 'assert';
import { disposable } from '../../utils';

suite('disposable Tests', () => {
  test('should return a disposable object', () => {
    const disposableFn = disposable(() => console.log('Hello World'));
    assert.ok(disposableFn instanceof Object);
  });

  test('should call the provided function when disposed', () => {
    const disposableFn = disposable(() => console.log('Hello World'));
    disposableFn.dispose();
  });
});
