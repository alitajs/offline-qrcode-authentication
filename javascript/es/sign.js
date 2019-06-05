import MD5 from 'crypto-js/md5';
import SHA1 from 'crypto-js/sha1';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import HmacMD5 from 'crypto-js/hmac-md5';
import HmacSHA1 from 'crypto-js/hmac-sha1';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import HmacSHA512 from 'crypto-js/hmac-sha512';
function padStart(str, length, fill) {
  while (str.length < length) str = fill.concat(str);
  return str.slice(str.length - length);
}
function formatDigits(id, checkCode, timestamp, digits) {
  const { id: di = 8, timestamp: dt = 6 } = digits;
  const timestampMax = Math.pow(10, dt);
  timestamp = (timestamp / 1000) % timestampMax;
  if (timestamp < timestampMax / 10) timestamp += timestampMax / 2;
  timestamp = Math.floor(timestamp);
  return `${timestamp}${padStart(`${id}`, di, '0')}${checkCode}`;
}
export function mergeConfig(config) {
  if (typeof config.id === 'string' && config.id.search(/\D/) !== -1)
    throw new Error('`id` must be a decimal integer');
  if (config.digits) {
    const { checkCode: dc = 4, id: di = 8, timestamp: dt = 6 } = config.digits;
    if (dc < 3 || di < 3 || dt < 3 || dc % 1 || di % 1 || dt % 1)
      throw new Error('Value of `digits` must be an integer greater than 2');
  }
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
export function makeHash(id, token, timestamp, hash, hmac, checkCodeDigit) {
  let hashRes;
  const [message, key] = hmac
    ? [`${id}${timestamp}`, `${token}`]
    : [`${id}${timestamp}${token}`, undefined];
  switch (hash) {
    case 'MD5':
      hashRes = `${hmac ? HmacMD5(message, key) : MD5(message)}`;
      break;
    case 'SHA1':
      hashRes = `${hmac ? HmacSHA1(message, key) : SHA1(message)}`;
      break;
    case 'SHA256':
      hashRes = `${hmac ? HmacSHA256(message, key) : SHA256(message)}`;
      break;
    case 'SHA512':
      hashRes = `${hmac ? HmacSHA512(message, key) : SHA512(message)}`;
      break;
    default:
      hashRes = hash(message, key);
      break;
  }
  return padStart(`${parseInt(hashRes.slice(0, checkCodeDigit), 16)}`, checkCodeDigit, '0');
}
export default config => {
  const { digits, hash, hmac, id, token } = mergeConfig(config);
  if (!id || !token) throw new Error('`id` and `token` is required');
  const timestamp = Date.now();
  const checkCode = makeHash(id, token, timestamp, hash, hmac, digits.checkCode);
  return formatDigits(id, checkCode, timestamp, digits);
};
