import { IncidentsCard } from './incidents-card';
import { MonitorsCard } from './monitors-card';
import { ResponseTimeCard } from './response-time-card';
import { UptimeCard } from './uptime-card';

const avgUptime = 99.97;
const avgResponseTimeMs = 142;
const responseDeltaMs = 12;
const totalMonitors = 18;
const operationalMonitors = 17;
const activeIncidents = 2;
const weeklyIncidents = 5;

const DashboardStatsGrid = () => {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <UptimeCard uptime={avgUptime} delta="+0.02%" />
      <ResponseTimeCard responseTimeMs={avgResponseTimeMs} deltaMs={responseDeltaMs} />
      <MonitorsCard total={totalMonitors} operational={operationalMonitors} />
      <IncidentsCard activeIncidents={activeIncidents} weeklyIncidents={weeklyIncidents} />
    </section>
  );
};

export { DashboardStatsGrid };
