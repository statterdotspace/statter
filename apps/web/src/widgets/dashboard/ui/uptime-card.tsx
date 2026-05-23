import { ArrowUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

interface UptimeCardProps {
  uptime: number;
  delta: string;
}

const UptimeCard = ({ uptime, delta }: UptimeCardProps) => {
  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-2">
        <h3 className="flex items-center text-sm font-medium text-neutral-700">
          <TrendingUp className="mr-2 size-4 text-emerald-500" />
          Global Uptime (24h)
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{uptime.toFixed(2)}%</span>
          <div className="flex items-center text-xs text-emerald-500">
            <ArrowUp className="mr-1 size-3" />
            {delta}
          </div>
        </div>
        <Progress value={uptime} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
};

export { UptimeCard };
