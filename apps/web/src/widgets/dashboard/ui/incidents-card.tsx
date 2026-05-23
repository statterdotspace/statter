import { AlertOctagon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface IncidentsCardProps {
  activeIncidents: number;
  weeklyIncidents: number;
}

const IncidentsCard = ({ activeIncidents, weeklyIncidents }: IncidentsCardProps) => {
  return (
    <Card className="border border-neutral-200">
      <CardHeader className="pb-2">
        <h3 className="flex items-center text-sm font-medium text-neutral-700">
          <AlertOctagon className="mr-2 size-4 text-rose-500" />
          Active Incidents
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-rose-500">{activeIncidents}</span>
          <span className="text-xs text-rose-400">
            {activeIncidents > 0 ? 'Needs attention' : 'All clear'}
          </span>
        </div>
        <div className="mt-2 text-xs text-neutral-500">{weeklyIncidents} total this week</div>
      </CardContent>
    </Card>
  );
};

export { IncidentsCard };
