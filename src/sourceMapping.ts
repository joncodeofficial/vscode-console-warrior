import { SourceMapInput, TraceMap, originalPositionFor } from '@jridgewell/trace-mapping';
import { ConsoleData, SourceMapCache } from './types';
import { getFilename } from './utils';

export const sourceMapping = async (consoleData: ConsoleData[], sourceMapCache: SourceMapCache) => {
  const newConsoleData: ConsoleData[] = [];

  for (const { location, message } of consoleData) {
    // Skip if the location is a vite client
    if (location.url.includes('@vite/client')) continue;

    const [baseUrl, queryString] = location.url.split('?');
    const timeParam = new URLSearchParams(queryString).get('t') ?? '';
    const cacheKey = `${baseUrl}-${timeParam}`;

    try {
      let tracer: TraceMap;
      // Check if the source map is already cached
      if (!sourceMapCache.has(cacheKey)) {
        const sourceMapUrl = `${baseUrl}.map`;
        const response = await fetch(sourceMapUrl);
        if (!response.ok) throw new Error('Failed to fetch sourcemap');
        const sourceMapData = (await response.json()) as SourceMapInput;
        tracer = new TraceMap(sourceMapData);
        sourceMapCache.set(cacheKey, tracer);
      } else {
        tracer = sourceMapCache.get(cacheKey)!;
      }

      const original = originalPositionFor(tracer, {
        line: location.line,
        column: location.column,
      });

      // Add the original location using the source map
      newConsoleData.push({
        message,
        location: {
          url: original.source ?? '',
          line: original.line ?? 0,
          column: original.column ?? 0,
        },
      });
    } catch {
      // If the source map is not found, add the original location to the console data
      newConsoleData.push({
        message,
        location: {
          url: getFilename(location.url),
          line: location.line,
          column: location.column,
        },
      });
    }
  }
  return newConsoleData;
};
