import { ArrowDown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface ResponseTimeCardProps {
  responseTimeMs: number;
  deltaMs: number;
}

const ResponseTimeCard = ({ responseTimeMs, deltaMs }: ResponseTimeCardProps) => {
  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-2">
        <h3 className="flex items-center text-sm font-medium text-neutral-700">
          <Zap className="mr-2 size-4 text-blue-500" />
          Avg. Response Time
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{responseTimeMs}ms</span>
          <div className="flex items-center text-xs text-emerald-500">
            <ArrowDown className="mr-1 size-3" />
            {deltaMs}ms
          </div>
        </div>
        <div className="mt-2 text-xs text-neutral-500">Global average</div>
      </CardContent>
    </Card>
  );
};

export { ResponseTimeCard };
