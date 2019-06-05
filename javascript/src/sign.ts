import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import HmacMD5 from 'crypto-js/hmac-md5';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import HmacSHA512 from 'crypto-js/hmac-sha512';

export interface SignDigitsConfig {
  /**
   * @default
   * 4
   */
  checkCode?: number;
  /**
   * @default
   * 8
   */
  id?: number;
  /**
   * @default
   * 6
   */
  timestamp?: number;
}

export interface SignConfig {
  /**
   * The number of digits of the encrypted output.
   * @example
   * const id = 12345678;
   * const checkCode = 1234;
   * const time = 1559287714 % 1000000;
   * const signRes = parseInt(`${timestamp}${id}${checkCode}`);
   * @example
   * let time = 12345; // not six digits
   * time = time < 100000 ? time + 500000 : time;
   */
  digits?: SignDigitsConfig;
  /**
   * Hash type.
   * @default
   * 'MD5'
   */
  hash?: 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | ((msg: string, token?: string) => string);
  /**
   * Enable hmac.
   * @default
   * true
   */
  hmac?: boolean;
  /**
   * Eg: user id.
   */
  id: number;
  /**
   * Get tokens when networking.
   * Regular updates are recommended.
   */
  token: number | string;
}

function padStart(str: string, length: number, fill: string): string {
  while (str.length < length) str = fill.concat(str);
  return str.slice(str.length - length);
}

function formatDigits(
  id: number,
  checkCode: number,
  timestamp: number,
  digits: SignDigitsConfig,
): string {
  const { checkCode: dc = 4, id: di = 8, timestamp: dt = 6 } = digits;
  const timestampMax = Math.pow(10, dt);
  timestamp = (timestamp / 1000) % timestampMax;
  if (timestamp < timestampMax / 10) timestamp += timestampMax / 2;
  timestamp = Math.floor(timestamp);
  return `${timestamp}${padStart(`${id}`, di, '0')}${padStart(`${checkCode}`, dc, '0')}`;
}

function mergeConfig(config: SignConfig): Required<SignConfig> {
  return {
    hash: 'MD5',
    hmac: true,
    ...config,
    digits: {
      checkCode: 4,
      id: 8,
      timestamp: 6,
      ...config.digits,
    },
  };
}

function makeHash(
  hash: Exclude<SignConfig['hash'], undefined>,
  hmac: boolean,
  id: number,
  token: string | number,
  timestamp: number,
): string {
  const [message, key] = hmac
    ? [`${id}${timestamp}`, `${token}`]
    : [`${id}${timestamp}${token}`, undefined];
  switch (hash) {
    case 'MD5':
      return `${hmac ? HmacMD5(message, key) : MD5(message)}`;
    case 'SHA1':
      return `${hmac ? HmacSHA1(message, key) : SHA1(message)}`;
    case 'SHA256':
      return `${hmac ? HmacSHA256(message, key) : SHA256(message)}`;
    case 'SHA512':
      return `${hmac ? HmacSHA512(message, key) : SHA512(message)}`;
    default:
      return hash(message, key);
  }
}

export default (config: SignConfig): string => {
  const { digits, hash, hmac, id, token } = mergeConfig(config);
  const timestamp = Date.now();
  const hashRes: string = makeHash(hash, hmac, id, token, timestamp);
  const checkCode = parseInt(hashRes.slice(0, digits.checkCode), 16);
  return formatDigits(id, checkCode, timestamp, digits);
};
