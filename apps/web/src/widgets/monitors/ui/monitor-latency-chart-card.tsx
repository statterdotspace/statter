import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartPoint, TimeRange } from '@/features/monitor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface MonitorLatencyChartCardProps {
  chartData: ChartPoint[];
  timeRange: TimeRange;
  timeRangeLabel: string;
  isHourlyRange: boolean;
  onTimeRangeChange: (value: TimeRange) => void;
}

const chartConfig = {
  eu: { label: 'EU', color: 'var(--primary)' },
  ua: { label: 'UA', color: 'var(--chart-2)' },
} satisfies ChartConfig;

const MonitorLatencyChartCard = ({
  chartData,
  timeRange,
  timeRangeLabel,
  isHourlyRange,
  onTimeRangeChange,
}: MonitorLatencyChartCardProps) => {
  return (
    <Card className="border border-neutral-200 pt-0 ring-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Latency by region</CardTitle>
          <CardDescription>Real check history ({timeRangeLabel})</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={(value) => onTimeRangeChange(value as TimeRange)}>
          <SelectTrigger className="hidden w-[140px] rounded-lg sm:ml-auto sm:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectGroup>
              <SelectItem value="12h" className="rounded-lg">
                Last 12 hours
              </SelectItem>
              <SelectItem value="24h" className="rounded-lg">
                Last 24 hours
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="14d" className="rounded-lg">
                Last 14 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillEu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-eu)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--color-eu)" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="fillUa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ua)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--color-ua)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(String(value));
                return isHourlyRange
                  ? date.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={46}
              tickFormatter={(value) => `${value}ms`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value) => (typeof value === 'number' ? `${value} ms` : 'n/a')}
                  labelFormatter={(value) => {
                    const date = new Date(String(value));
                    return isHourlyRange
                      ? date.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        });
                  }}
                />
              }
            />
            <Area
              dataKey="ua"
              type="natural"
              fill="url(#fillUa)"
              stroke="var(--color-ua)"
              strokeWidth={2}
            />
            <Area
              dataKey="eu"
              type="natural"
              fill="url(#fillEu)"
              stroke="var(--color-eu)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { MonitorLatencyChartCard };
