/**
 * Converts a string to a URL-friendly slug
 * @param input - Input string
 * @param separator - Word separator (default: '-')
 * @returns Normalized slug
 */
export const slugify = (input: string, separator = '-'): string => {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove all except letters, numbers, and spaces
    .replace(/\s+/g, separator) // Replace spaces with separator
    .replace(new RegExp(`\\${separator}+`, 'g'), separator); // Remove duplicate separators
};
