import { NextApiRequest, NextApiResponse } from 'next';
import Response from 'lib/response';
import { getReadersInTime } from 'lib/dashboard/api/readers-in-time';
import { allowedKpis, ChartData, KPIType } from 'lib/utils';
import { getPageviewsInTime } from 'lib/dashboard/api/pageviews-in-time';
import { getBounceRateInTime } from 'lib/dashboard/api/bounce-rate-in-time';
import { getReadToEndInTime } from 'lib/dashboard/api/read-to-end-in-time';
import { getSessionMetricsInTime } from 'lib/dashboard/api/sessions-metrics-in-time';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<ChartData>>
) => {
  try {
    const {
      query: { slug, type, dateStart, dateEnd },
    } = req;
    if (!slug) throw new Error('Slug not provided.');
    if (!type) throw new Error('Type not provided.');
    if (![...allowedKpis, 'sessions-metrics'].includes(type as KPIType))
      throw new Error('Type not allowed.');
    if (!dateStart || Array.isArray(dateStart))
      throw new Error('Date start part not provided.');
    if (!dateEnd || Array.isArray(dateEnd))
      throw new Error('Date end part not provided.');
    const dateInterval = {
      start: new Date(dateStart),
      end: new Date(dateEnd),
    };
    const filterData = { dateInterval };
    let data;
    switch (type) {
      case 'readers':
        data = await getReadersInTime(slug as string, filterData);
        break;
      case 'pageviews':
        data = await getPageviewsInTime(slug as string, filterData);
        break;
      case 'bounce-rate':
        data = await getBounceRateInTime(slug as string, filterData);
        break;
      case 'read-to-end':
        data = await getReadToEndInTime(slug as string, filterData);
        break;
      case 'sessions-metrics':
        data = await getSessionMetricsInTime(slug as string, filterData);
        break;
      default:
        throw new Error('Unknown performance type.');
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
