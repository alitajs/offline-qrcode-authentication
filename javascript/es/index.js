const defaultCharMap = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/';
export function changeRadix(message, config = {}) {
  const { fromCharMap = defaultCharMap, toCharMap = defaultCharMap } = config;
  const radix = config.radix || toCharMap.length;
  const digits = [];
  let isNegative = false;
  if (typeof message === 'number') message = `${message}`;
  if (message[0] === '-') isNegative = message = message.slice(1);
  message.split('').forEach(char => {
    let num = fromCharMap.indexOf(char);
    for (let i = 0; num || i < digits.length; i++) {
      num += (digits[i] || 0) * 10;
      digits[i] = num % radix;
      num = (num - digits[i]) / radix;
    }
  });
  const res = digits.reverse().map(num => toCharMap[num || 0]);
  if (!res.length) res.push(toCharMap[0]);
  if (isNegative) res.unshift('-');
  return res.join('');
}
