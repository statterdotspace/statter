import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

/**
 * Functions for password hashing and verification
 */

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(SALT_LENGTH);
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
};

const verifyPassword = async (password: string, passwordHash: string): Promise<boolean> => {
  const [saltHex, hashHex] = passwordHash.split(':');
  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const storedHash = Buffer.from(hashHex, 'hex');
  const derivedKey = (await scrypt(password, salt, storedHash.length)) as Buffer;

  if (storedHash.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedHash, derivedKey);
};

export { hashPassword, verifyPassword };
