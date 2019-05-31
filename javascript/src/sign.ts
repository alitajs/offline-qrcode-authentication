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
   * Hash type.
   * @default
   * 'MD5'
   */
  hash?: 'MD5' | 'SHA1' | 'SHA256' | 'SHA512' | ((msg: string, token: string) => string);
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
   * The number of digits of the encrypted output.
   * @example
   * const id = 12345678;
   * const checkCode = 1234;
   * const time = 1559287714 % 1000000;
   * const signres = parseInt(`${timestamp}${id}${checkCode}`);
   * @example
   * let time = 12345; // not six digits
   * time = time < 100000 ? time + 500000 : time;
   */
  digits?: SignDigitsConfig;
  /**
   * Get tokens when networking.
   * Regular updates are recommended.
   */
  token: string;
}

function padStart(str: string, length: number, fill: string): string {
  while (str.length < length) str = fill.concat(str);
  return str.slice(str.length - length);
}

function formatDigits(id: number, checkCode: number, digits: SignDigitsConfig = {}): string {
  const { checkCode: dc = 4, id: di = 8, timestamp: dt = 6 } = digits;
  const timestampMax = Math.pow(10, dt);
  let timestamp = (Date.now() / 1000) % timestampMax;
  if (timestamp < timestampMax / 10) timestamp += timestampMax / 2;
  timestamp = Math.floor(timestamp);
  return `${timestamp}${padStart(`${id}`, di, '0')}${padStart(`${checkCode}`, dc, '0')}`;
}

export default (config: SignConfig): string => {
  return formatDigits(config.id, 0, config.digits);
};
