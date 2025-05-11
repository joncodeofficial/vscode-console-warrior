import { IConsoleData } from "./types/consoleData.interface";
import { RawSourceMap, SourceMapConsumer } from "source-map";

type SourceMapCacheValue = {
  consumer: SourceMapConsumer;
  data: RawSourceMap;
};

export const sourceMapping = async (
  consoleData: IConsoleData[],
  sourceMapCache: Map<string, SourceMapCacheValue>
) => {
  const temp: IConsoleData[] = [];

  for (const row of consoleData) {
    const location = row.location;

    if (!location.url.includes("@vite/client")) {
      const sourceUrl = location.url.split("?")[0];
      const timeParam = location.url.split("t=")[1];
      const cacheKey = `${sourceUrl}-${timeParam}`;

      if (!sourceMapCache.has(cacheKey)) {
        try {
          const sourceMapUrl = `${sourceUrl}.map`;

          const response = await fetch(sourceMapUrl);

          if (!response.ok) {
            console.log("Ha fallado el sourcemap");
            return;
          }
          const sourceMapData = (await response.json()) as RawSourceMap;

          await SourceMapConsumer.with(sourceMapData, null, (consumer) => {
            sourceMapCache.set(cacheKey, { consumer, data: sourceMapData });
          });

          const { consumer } = sourceMapCache.get(cacheKey)!;

          const sourceContent = sourceMapData.sourcesContent?.[0];
          const lines = sourceContent?.split("\n");

          // Find the original position from the generated position
          const originalPosition = consumer.originalPositionFor({
            line: location.line,
            column: location.column - 1,
          });

          // If we found a valid original position
          if (originalPosition.source && originalPosition.line) {
            const originalLine = lines?.[originalPosition.line - 1] || "";

            // Check if this line contains a console.log statement
            if (
              originalLine.includes("console.log") &&
              !originalLine.trim().startsWith("//")
            ) {
              // console.log(`\nMensaje: ${row.message}`);
              // console.log(`Archivo Original: ${originalPosition.source}`);
              // console.log(`Línea Original: ${originalPosition.line}`);

              temp.push({
                message: row.message,
                location: {
                  url: originalPosition.source,
                  line: originalPosition.line,
                  column: originalPosition.column ?? 0,
                },
              });
            }
          }
        } catch (err) {
          // console.log("No existe el sourcemap");
          // console.log(`Mensaje: ${row.message}`);
          // console.log(`Archivo: ${location.url}`);
          // console.log(`Línea: ${location.line + 1}`);
        }
      } else {
        console.log("Cached sourcemap to enhance performance.");

        const { consumer } = sourceMapCache.get(cacheKey)!;

        const originalPosition = consumer.originalPositionFor({
          line: location.line,
          column: location.column - 1,
        });

        if (originalPosition.source) {
          // console.log(`Mensaje: ${row.message}`);
          // console.log(`Línea Original: ${originalPosition.line}`);

          temp.push({
            message: row.message,
            location: {
              url: originalPosition.source,
              line: originalPosition.line ?? 0,
              column: originalPosition.column ?? 0,
            },
          });
        }
      }
    }
  }
  return temp;
};
