function padStart(str, length, fill) {
    while (str.length < length)
        str = fill.concat(str);
    return str.slice(str.length - length);
}
function formatDigits(id, checkCode, digits = {}) {
    const { checkCode: dc = 4, id: di = 8, timestamp: dt = 6 } = digits;
    const timestampMax = Math.pow(10, dt);
    let timestamp = (Date.now() / 1000) % timestampMax;
    if (timestamp < timestampMax / 10)
        timestamp += timestampMax / 2;
    timestamp = Math.floor(timestamp);
    return `${timestamp}${padStart(`${id}`, di, '0')}${padStart(`${checkCode}`, dc, '0')}`;
}
export default (config) => {
    return formatDigits(config.id, 0, config.digits);
};
