import * as assert from "assert";
import { getFilename } from "../../utils/getFilename";

suite("getFilename Tests", () => {
  test("should return the filename with query parameters stripped", () => {
    assert.equal(
      getFilename("http://localhost:5173/src/main.tsx?t=1748105475347"),
      "main.tsx"
    );
  });

  test("should return the filename from a simple URL", () => {
    assert.equal(
      getFilename("https://example.com/path/to/file.txt"),
      "file.txt"
    );
  });

  test("should return empty string for URL with no path", () => {
    assert.equal(getFilename("https://example.com"), "");
  });
});
