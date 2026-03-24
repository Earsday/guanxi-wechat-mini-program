// utils/crypto.js - Encryption and hashing utilities for WeChat Mini Program

/**
 * Note: WeChat Mini Program does not support Node.js crypto module
 * We use a simplified approach with wx.getRandomValues for random generation
 * and implement basic encryption algorithms
 * 
 * For production, consider using a library like crypto-js adapted for mini-programs
 */

/**
 * Generate random bytes
 */
function randomBytes(length) {
  const array = new Uint8Array(length);
  
  try {
    // Use WeChat's secure random if available
    wx.getRandomValues(array);
  } catch (error) {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }

  return array;
}

/**
 * Generate random string
 */
function randomString(length = 32, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  const bytes = randomBytes(length);
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(bytes[i] % charset.length);
  }

  return result;
}

/**
 * Simple hash function (FNV-1a)
 * Note: This is NOT cryptographically secure, just for checksums
 */
function simpleHash(str) {
  let hash = 2166136261; // FNV offset basis
  
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return (hash >>> 0).toString(16);
}

/**
 * Generate password hash (PBKDF2-like, simplified)
 * In production, use a proper crypto library
 */
function hashPassword(password, salt = null, iterations = 10000) {
  if (!salt) {
    salt = randomString(16);
  }

  let hash = password + salt;
  
  for (let i = 0; i < iterations; i++) {
    hash = simpleHash(hash);
  }

  return {
    hash,
    salt,
    iterations
  };
}

/**
 * Verify password against hash
 */
function verifyPassword(password, storedHash, salt, iterations = 10000) {
  const computed = hashPassword(password, salt, iterations);
  return computed.hash === storedHash;
}

/**
 * XOR cipher (simple symmetric encryption)
 * Note: This is NOT secure for sensitive data, use only for obfuscation
 * For production, use AES from a crypto library
 */
function xorEncrypt(text, key) {
  if (!text || !key) return text;

  const textBytes = stringToBytes(text);
  const keyBytes = stringToBytes(key);
  const encrypted = new Uint8Array(textBytes.length);

  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  return bytesToBase64(encrypted);
}

/**
 * XOR decrypt
 */
function xorDecrypt(encryptedBase64, key) {
  if (!encryptedBase64 || !key) return encryptedBase64;

  try {
    const encrypted = base64ToBytes(encryptedBase64);
    const keyBytes = stringToBytes(key);
    const decrypted = new Uint8Array(encrypted.length);

    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
    }

    return bytesToString(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

/**
 * Base64 encode
 */
function base64Encode(str) {
  return wx.arrayBufferToBase64(stringToArrayBuffer(str));
}

/**
 * Base64 decode
 */
function base64Decode(base64) {
  const arrayBuffer = wx.base64ToArrayBuffer(base64);
  return arrayBufferToString(arrayBuffer);
}

/**
 * Convert string to Uint8Array
 */
function stringToBytes(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i) & 0xFF;
  }
  return bytes;
}

/**
 * Convert Uint8Array to string
 */
function bytesToString(bytes) {
  return String.fromCharCode.apply(null, Array.from(bytes));
}

/**
 * Convert string to ArrayBuffer
 */
function stringToArrayBuffer(str) {
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Convert ArrayBuffer to string
 */
function arrayBufferToString(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

/**
 * Convert Uint8Array to Base64
 */
function bytesToBase64(bytes) {
  return wx.arrayBufferToBase64(bytes.buffer);
}

/**
 * Convert Base64 to Uint8Array
 */
function base64ToBytes(base64) {
  const arrayBuffer = wx.base64ToArrayBuffer(base64);
  return new Uint8Array(arrayBuffer);
}

/**
 * Encrypt data for export (simple implementation)
 * For production: use AES-256-GCM from crypto-js or similar
 */
function encryptForExport(data, password) {
  try {
    const jsonStr = JSON.stringify(data);
    
    // Generate salt
    const salt = randomString(16);
    
    // Derive key from password
    const { hash: key } = hashPassword(password, salt);
    
    // Encrypt with XOR (placeholder for real AES)
    const encrypted = xorEncrypt(jsonStr, key);
    
    return {
      encrypted,
      salt,
      algorithm: 'XOR', // In production: 'AES-256-GCM'
      version: 1
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data from import
 */
function decryptFromImport(encryptedData, password) {
  try {
    const { encrypted, salt, algorithm, version } = encryptedData;

    // Derive key from password
    const { hash: key } = hashPassword(password, salt);

    // Decrypt with XOR (placeholder for real AES)
    let decrypted;
    if (algorithm === 'XOR') {
      decrypted = xorDecrypt(encrypted, key);
    } else {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    if (!decrypted) {
      throw new Error('Decryption failed - wrong password?');
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data - wrong password?');
  }
}

/**
 * Generate secure token
 */
function generateToken(length = 32) {
  return randomString(length);
}

/**
 * Generate UUID v4
 */
function generateUUID() {
  const bytes = randomBytes(16);
  
  // Set version (4) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20, 12)}`;
}

/**
 * Compute checksum for data integrity
 */
function computeChecksum(data) {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return simpleHash(str);
}

/**
 * Verify checksum
 */
function verifyChecksum(data, expectedChecksum) {
  const computed = computeChecksum(data);
  return computed === expectedChecksum;
}

module.exports = {
  randomBytes,
  randomString,
  simpleHash,
  hashPassword,
  verifyPassword,
  xorEncrypt,
  xorDecrypt,
  base64Encode,
  base64Decode,
  encryptForExport,
  decryptFromImport,
  generateToken,
  generateUUID,
  computeChecksum,
  verifyChecksum
};
