import { ConsoleData } from './types/consoleData.interface';
import { SourceMapCache } from './types/sourceMapCache.interface';
import { SourceMapInput, TraceMap, originalPositionFor } from '@jridgewell/trace-mapping';
import { getFilename } from './utils/getFilename';

export const sourceMapping = async (consoleData: ConsoleData[], sourceMapCache: SourceMapCache) => {
  const newConsoleData: ConsoleData[] = [];

  for (const { location, message } of consoleData) {
    if (!location.url.includes('@vite/client')) {
      const sourceUrl = location.url.split('?')[0];
      const timeParam = location.url.split('t=')[1];
      const cacheKey = `${sourceUrl}-${timeParam}`;

      try {
        let tracer: TraceMap;

        if (!sourceMapCache.has(cacheKey)) {
          const sourceMapUrl = `${sourceUrl}.map`;
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

        newConsoleData.push({
          message,
          location: {
            url: original.source ?? '',
            line: original.line ?? 0,
            column: original.column ?? 0,
          },
        });
      } catch {
        console.log('Source map not found or failed to load.');
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
  }
  return newConsoleData;
};
