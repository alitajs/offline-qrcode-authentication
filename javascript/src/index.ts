import sign, {
  changeRadix,
  ChangeRadixConfig,
  makeHash,
  mergeConfig,
  SignConfig,
  SignDigitsConfig,
} from './sign';

export { changeRadix, ChangeRadixConfig, sign as encode, SignConfig, SignDigitsConfig };

/**
 * decode timestamp shot
 */
function decodeTSShot(tsShotStr: string, expiresIn: number, now: number): number | null {
  const tsShot = parseInt(tsShotStr, 10);
  const tsMax = Math.pow(10, tsShotStr.length);
  const prefix = now - (now % tsMax);
  let timestamp = prefix + tsShot;
  if (timestamp < now && timestamp > now - expiresIn) return timestamp;
  if (tsShotStr[0] === '5') timestamp -= tsMax / 2;
  else if (tsShotStr[0] === '9') timestamp -= tsMax;
  if (timestamp < now && timestamp > now - expiresIn) return timestamp;
  return null;
}

export function decode(
  message: string,
  expiresIn: number,
  digits: SignDigitsConfig = {},
  needChangeRadix: ChangeRadixConfig | false = false,
) {
  if (needChangeRadix) message = changeRadix(message, needChangeRadix);
  const { checkCode: dc = 4, id: di = 8, timestamp: dt = 6 } = digits;
  const tsShot = message.slice(0, dt);
  const id = message.slice(dt, dt + di);
  const now = Math.floor(Date.now() / 1000);
  const checkCode = message.slice(dt + di, dt + di + dc);
  const timestamp = decodeTSShot(tsShot, expiresIn, now);
  if (timestamp === null) return null;
  return { checkCode, id, timestamp };
}

type Omit<T, K extends keyof T> = { [U in Exclude<keyof T, K>]?: T[U] };

export interface FindOneReturn {
  id: string | number;
  token: string | number;
}

export type FindOneConfig<
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

export function findOne<
  T extends FindOneReturn,
  F extends (id: T['id']) => null | T | T[] | Promise<null | T | T[]>
>(message: string, config: FindOneConfig<T, F>): null | T | Promise<null | T> {
  // format configuration
  const { expiresIn = 60, search } = config;
  const { digits, hash, hmac } = mergeConfig(config);
  // decode message to get `id` and `timestamp`
  const decodeRes = decode(message, expiresIn, digits, config.changeRadix);
  if (!decodeRes) return null;
  // get common args of `makeHash`
  const commonArgs = [decodeRes.timestamp, hash, hmac, digits.checkCode] as const;
  // search by id
  const searchRes = search(decodeRes.id);
  if (!searchRes) return null;
  // type T
  if ('token' in searchRes) {
    const checkCode = makeHash(searchRes.id, searchRes.token, ...commonArgs);
    if (checkCode === decodeRes.checkCode) return searchRes;
  }
  // type T[]
  else if (Array.isArray(searchRes)) {
    for (const item of searchRes) {
      const checkCode = makeHash(item.id, item.token, ...commonArgs);
      if (checkCode === decodeRes.checkCode) return item;
    }
  }
  // type Promise<null | T | T[]>
  else if (typeof searchRes.then === 'function') {
    return searchRes.then(res => {
      if (!res) return null;
      if ('token' in res) {
        const checkCode = makeHash(res.id, res.token, ...commonArgs);
        if (checkCode === decodeRes.checkCode) return res;
      } else if (Array.isArray(res)) {
        for (const item of res) {
          const checkCode = makeHash(item.id, item.token, ...commonArgs);
          if (checkCode === decodeRes.checkCode) return item;
        }
      }
      return null;
    });
  }
  // return `null` by default
  return null;
}

export default findOne;
