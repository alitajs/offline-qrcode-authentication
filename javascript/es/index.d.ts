export interface ChangeRadixConfig {
  /**
   * @default
   * '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   */
  fromCharMap?: string;
  /**
   * @default
   * toCharMap.length
   */
  radix?: number;
  /**
   * @default
   * '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
   */
  toCharMap?: string;
}
export declare function changeRadix(message: number | string, config?: ChangeRadixConfig): string;
