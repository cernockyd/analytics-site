import { NextApiRequest, NextApiResponse } from 'next';
import Response from 'lib/response';
import { KPIData, KPIDataDuration, KPIType, allowedKpis } from 'lib/utils';
import { getReaders } from 'lib/dashboard/api/readers';
import { getReadToEnd } from 'lib/dashboard/api/read-to-end';
import { getPageViews } from 'lib/dashboard/api/pageviews';
import { getBounceRate } from 'lib/dashboard/api/bounce-rate';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<KPIData | KPIDataDuration>>
) => {
  try {
    const {
      query: { slug, kpi, dateStart, dateEnd },
    } = req;
    if (!slug) throw new Error('Slug not provided.');
    if (!kpi || Array.isArray(kpi)) throw new Error('KPI not provided.');
    if (!allowedKpis.includes(kpi as KPIType))
      throw new Error('KPI not allowed.');
    if (!dateStart || Array.isArray(dateStart))
      throw new Error('Date start part not provided.');
    if (!dateEnd || Array.isArray(dateEnd))
      throw new Error('Date end part not provided.');
    const dateInterval = {
      start: new Date(dateStart),
      end: new Date(dateEnd),
    };
    let data: KPIData | KPIDataDuration;
    switch (kpi as KPIType) {
      case 'readers':
        data = await getReaders(slug as string, { dateInterval });
        break;
      case 'read-to-end':
        data = await getReadToEnd(slug as string, { dateInterval });
        break;
      case 'pageviews':
        data = await getPageViews(slug as string, { dateInterval });
        break;
      case 'bounce-rate':
        data = await getBounceRate(slug as string, { dateInterval });
        break;
      default:
        throw new Error('Invalid KPI.' + kpi);
    }
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
