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
   * Minimum is `2`.
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
   * Must be a decimal integer.
   * Eg: user id.
   */
  id: number | string;
  /**
   * Get tokens when networking.
   * Regular updates are recommended.
   */
  token: number | string;
}
export declare const defaultCharMap: string;
export interface ChangeRadixConfig {
  /**
   * @default
   * '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+_'
   */
  fromCharMap?: string;
  /**
   * @default
   * toCharMap.length
   */
  radix?: number;
  /**
   * @default
   * '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+_'
   */
  toCharMap?: string;
}
export declare function changeRadix(message: number | string, config?: ChangeRadixConfig): string;
export declare function mergeConfig(
  config: Partial<SignConfig>,
): {
  digits:
    | {
        checkCode: number;
        id: number;
        timestamp: number;
      }
    | {
        checkCode: number;
        id: number;
        timestamp: number;
      };
  hash:
    | 'MD5'
    | 'SHA1'
    | 'SHA256'
    | 'SHA512'
    | ((msg: string, token?: string | undefined) => string);
  hmac: boolean;
  id?: string | number | undefined;
  token?: string | number | undefined;
};
export declare function makeHash(
  id: number | string,
  token: number | string,
  timestamp: number,
  hash: Exclude<SignConfig['hash'], undefined>,
  hmac: boolean,
  checkCodeDigit: number,
): string;
declare const _default: (config: SignConfig) => string;
export default _default;
