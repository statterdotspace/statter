export function durationToMs(value: string): number {
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  const match = value.match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) {
    return 3 * 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'ms':
    case 'MS':
      return amount;
    case 's':
    case 'S':
      return amount * 1000;
    case 'm':
    case 'M':
      return amount * 60 * 1000;
    case 'h':
    case 'H':
      return amount * 60 * 60 * 1000;
    case 'd':
    case 'D':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 3 * 24 * 60 * 60 * 1000;
  }
}
