export function getFilename(url: string) {
  const { pathname } = new URL(url);
  const segments = pathname.split("/").filter(Boolean);
  return segments.pop() || "";
}
