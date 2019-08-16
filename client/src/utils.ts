export const isSSR = typeof window === "undefined";

export const daysToSeconds = (d: number) => d * 24 * 60 * 60;
export const secondsToDays = (s: number) => s / 24 / 60 / 60;
export const msToSeconds = (ms: number) => ms / 1e3;
export const secondsToMs = (s: number) => s * 1e3;

export const getDeadline = (startedAt: number, timeRequired: number) => {
  if (startedAt === 0) {
    return `${secondsToDays(timeRequired)} days after it starts`;
  }

  return new Date(secondsToMs(startedAt + timeRequired)).toDateString();
};
