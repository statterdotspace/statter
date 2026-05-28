import { Activity } from 'lucide-react';
import type { Check } from '@/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

interface MonitorIncidentsCardProps {
  incidents: Check[];
  timeRangeLabel: string;
}

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const MonitorIncidentsCard = ({ incidents, timeRangeLabel }: MonitorIncidentsCardProps) => {
  return (
    <Card className="border border-neutral-200 ring-0">
      <CardHeader>
        <CardTitle className="inline-flex items-center gap-2">
          <Activity className="size-4" />
          Latest incidents
        </CardTitle>
        <CardDescription>Failed checks in selected period ({timeRangeLabel})</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status Code</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length > 0 ? (
              incidents.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{formatDateTime(check.checkedAt)}</TableCell>
                  <TableCell className="capitalize">{check.status}</TableCell>
                  <TableCell>{check.region.toUpperCase()}</TableCell>
                  <TableCell>{check.statusCode ?? '-'}</TableCell>
                  <TableCell>{check.latencyMs ?? '-'}</TableCell>
                  <TableCell className="max-w-[360px] truncate">{check.errorMessage ?? '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-neutral-500">
                  No incidents for selected range.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export { MonitorIncidentsCard };
