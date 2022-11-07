import ChaptersTraffic from './chapters-traffic';
import DeviceShare from './device-share';
import ExternalSource from './external-source';

export default function Other() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6 mt-6">
      <ChaptersTraffic />
      <DeviceShare />
      <ExternalSource />
    </div>
  );
}
