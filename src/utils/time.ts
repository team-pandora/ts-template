export const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const prettyDuration = (ms: number) => {
    const roundedMs = Math.round(ms * 1000) / 1000;
    const seconds = Math.floor(roundedMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const msLeft = roundedMs % 1000;
    const secondsLeft = seconds % 60;
    const minutesLeft = minutes % 60;

    const result: Array<string> = [];

    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutesLeft}m`);
    if (seconds > 0) result.push(`${secondsLeft}s`);
    result.push(`${msLeft}ms`);

    return result.join(' ');
};

export const getPreciseTime = () => {
    return Number(process.hrtime.bigint() / 1000n) / 1000;
};
