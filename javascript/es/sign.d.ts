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
declare const _default: (config: SignConfig) => string;
export default _default;
