import { randomUUID } from 'crypto';

/**
 * Sanitizes path segments for s3 object path
 * Example:
 * - test34@gmail.com -> test34gmailcom
 * - few words -> fewwords
 * - --- -> folder
 */
const sanitizePathSegment = (value: string): string => {
  const sanitized = value.replace(/[^a-zA-Z0-9-_]/g, '');
  return sanitized || 'folder';
};

/**
 * Sanitize filename for valid s3 object key
 * Example:
 * - first file.png - > first-file.png
 * - my super file...jpg -> my-super-file.jpg
 * - --- -> file
 */
const sanitizeFileName = (value: string): string => {
  const [namePart, ...extensionParts] = value.split('.');

  const sanitizedName = namePart
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const safeName = sanitizedName || 'file';
  const extension = extensionParts.join('.').replace(/[^a-zA-Z0-9]/g, '');

  if (!extension) {
    return safeName;
  }

  return `${safeName}.${extension}`;
};

const buildPublicFileUrl = (
  objectKey: string,
  bucket: string,
  region: string,
): string => {
  const encodedPath = objectKey
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://${bucket}.s3.${region}.amazonaws.com/${encodedPath}`;
};

const buildObjectKey = (ownerPath: string, rawFileName: string): string => {
  const normalizedOwnerPath = ownerPath
    .split('/')
    .map((segment) => sanitizePathSegment(segment))
    .filter(Boolean)
    .join('/');

  const sanitizedFileName = sanitizeFileName(rawFileName);
  const objectId = randomUUID();

  return `${normalizedOwnerPath}/${objectId}-${sanitizedFileName}`;
};

export { buildObjectKey, buildPublicFileUrl };
