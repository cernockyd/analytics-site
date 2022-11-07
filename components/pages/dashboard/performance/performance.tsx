import Card from 'components/blocks/card';
import Chart from './chart';
import MetricTabGrid from './metric-tab-grid';
import { Item } from 'react-stately';
import useDashboardData from 'lib/dashboard/hooks/use-dashboard-data';
import { KPIType } from 'lib/utils';

function Performance() {
  const { setActiveMetric } = useDashboardData();
  return (
    <Card className="mt-6">
      <MetricTabGrid
        onSelectionChange={(key: KPIType) => setActiveMetric(key)}
        keyboardActivation="manual"
      >
        <Item key="readers">Readers</Item>
        <Item key="sessions-duration">Ø Reading duration</Item>
        <Item key="read-to-end">Read to end</Item>
        <Item key="pageviews">Page views</Item>
        <Item key="sessions">Total sessions</Item>
        <Item key="bounce-rate">Bounce rate</Item>
      </MetricTabGrid>
      <Chart />
    </Card>
  );
}

export default Performance;
