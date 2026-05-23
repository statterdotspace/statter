import { Server } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';

interface MonitorsCardProps {
  total: number;
  operational: number;
}

const MonitorsCard = ({ total, operational }: MonitorsCardProps) => {
  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-2">
        <h3 className="flex items-center text-sm font-medium text-neutral-700">
          <Server className="mr-2 size-4 text-purple-500" />
          Active Monitors
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{total}</span>
          <span className="text-xs text-neutral-500">
            {operational}/{total} operational
          </span>
        </div>
        <div className="mt-2">
          <Progress value={(operational / total) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export { MonitorsCard };
