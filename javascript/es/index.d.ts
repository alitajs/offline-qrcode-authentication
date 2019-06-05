import sign, { changeRadix, ChangeRadixConfig, SignConfig, SignDigitsConfig } from './sign';
export { changeRadix, ChangeRadixConfig, sign as encode, SignConfig, SignDigitsConfig };
export declare function decode(
  message: string,
  expiresIn: number,
  digits?: SignDigitsConfig,
  needChangeRadix?: ChangeRadixConfig | false,
): {
  checkCode: string;
  id: string;
  timestamp: number;
} | null;
declare type Omit<T, K extends keyof T> = { [U in Exclude<keyof T, K>]?: T[U] };
export interface FindOneReturn {
  id: string | number;
  token: string | number;
}
export declare type FindOneConfig<
  T extends FindOneReturn,
  F extends (id: T['id']) => null | T | T[] | Promise<null | T | T[]>
> = Omit<SignConfig, 'id' | 'token'> & {
  /**
   * Change the radix of input message. Set `false` to disable it.
   * @default
   * false
   */
  changeRadix?: ChangeRadixConfig | false;
  /**
   * The validity time of the signature.
   * @default
   * 60
   */
  expiresIn?: number;
  /**
   * Search user info by `id`
   */
  search: F;
};
export declare function findOne<
  T extends FindOneReturn,
  F extends (id: T['id']) => null | T | T[] | Promise<null | T | T[]>
>(message: string, config: FindOneConfig<T, F>): null | T | Promise<null | T>;
export default findOne;
