export const formatString = (message: string) => {
  return message
    .replace(/^\s+|\s+$/g, "") // Delete spaces at start and end
    .replace(/\s{2,}/g, " "); // Replace multiple spaces with one
};
