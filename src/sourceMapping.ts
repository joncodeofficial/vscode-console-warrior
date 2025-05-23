import { IConsoleData } from "./types/consoleData.interface";
import { ISourceMapCache } from "./types/sourceMapCache.interface";
import {
  SourceMapInput,
  TraceMap,
  originalPositionFor,
} from "@jridgewell/trace-mapping";
import { getFilename } from "./utils/getFilenameFromUrl";

export const sourceMapping = async (
  consoleData: IConsoleData[],
  sourceMapCache: ISourceMapCache
) => {
  const newConsoleData: IConsoleData[] = [];

  for (const { location, message } of consoleData) {
    if (!location.url.includes("@vite/client")) {
      const sourceUrl = location.url.split("?")[0];
      const timeParam = location.url.split("t=")[1];
      const cacheKey = `${sourceUrl}-${timeParam}`;

      if (!sourceMapCache.has(cacheKey)) {
        try {
          const sourceMapUrl = `${sourceUrl}.map`;

          const response = await fetch(sourceMapUrl);

          if (!response.ok) {
            console.log("Had failed the sourcemap");
            return;
          }
          const sourceMapData = (await response.json()) as SourceMapInput;

          // Create the TraceMap object
          const tracer = new TraceMap(sourceMapData);

          // Find the original position
          const original = originalPositionFor(tracer, {
            line: location.line,
            column: location.column,
          });

          // Add the TraceMap object to the cache
          sourceMapCache.set(cacheKey, tracer);

          newConsoleData.push({
            message,
            location: {
              url: original.source ?? "",
              line: original.line ?? 0,
              column: original.column ?? 0,
            },
          });
        } catch (e) {
          console.log("Source map not found or failed to load.");
          newConsoleData.push({
            message,
            location: {
              url: getFilename(location.url),
              line: location.line,
              column: location.column,
            },
          });
        }
      } else {
        console.log("Cached sourcemap to enhance performance.");

        const tracer = sourceMapCache.get(cacheKey)!;

        const originalPosition = originalPositionFor(tracer, {
          line: location.line,
          column: location.column,
        });

        newConsoleData.push({
          message,
          location: {
            url: originalPosition.source ?? "",
            line: originalPosition.line ?? 0,
            column: originalPosition.column ?? 0,
          },
        });
      }
    }
  }
  return newConsoleData;
};
