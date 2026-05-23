interface UptimeBarProps {
  uptime: number;
  seed: string;
}

const UptimeBar = ({ uptime, seed }: UptimeBarProps) => {
  const seedHash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const segments = Array.from({ length: 30 }, (_, index) => {
    const value = (Math.sin(seedHash + index * 17) + 1) / 2;

    if (uptime > 99) {
      return value > 0.1 ? 'up' : 'down';
    }

    if (uptime > 98) {
      return value > 0.2 ? 'up' : value > 0.1 ? 'warning' : 'down';
    }

    return value > 0.3 ? 'up' : value > 0.15 ? 'warning' : 'down';
  });

  return (
    <div className="flex h-6 items-end gap-[2px]">
      {segments.map((status, index) => (
        <div
          key={`${seed}-${index}`}
          className={`h-5 w-2 rounded-sm ${
            status === 'up' ? 'bg-emerald-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
          }`}
        />
      ))}
    </div>
  );
};

export { UptimeBar };
