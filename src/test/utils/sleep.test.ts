import * as assert from 'assert';
import { sleep } from '../../utils';
import { performance } from 'perf_hooks';

suite('sleep Tests', () => {
  test('should resolve after the specified number of milliseconds', async () => {
    const start = performance.now();
    await sleep(50);
    const end = performance.now();
    assert.ok(end - start >= 50);
  });
});
