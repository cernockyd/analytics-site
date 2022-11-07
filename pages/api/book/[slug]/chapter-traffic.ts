import { NextApiRequest, NextApiResponse } from 'next';
import Response from 'lib/response';
import {
  ChaptersTraffic,
  getChapterTraffic,
} from 'lib/dashboard/api/chapter-traffic';
import { TrafficType } from 'lib/utils';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<ChaptersTraffic>>
) => {
  try {
    const {
      query: { slug, dateStart, dateEnd, type },
    } = req;
    if (!slug) throw new Error('Slug not provided.');
    if (
      !type ||
      Array.isArray(type) ||
      !Object.values(TrafficType).includes(type as TrafficType)
    )
      throw new Error('Type not provided or invalid.');
    if (!dateStart || Array.isArray(dateStart))
      throw new Error('Date start part not provided.');
    if (!dateEnd || Array.isArray(dateEnd))
      throw new Error('Date end part not provided.');
    const dateInterval = {
      start: new Date(dateStart),
      end: new Date(dateEnd),
    };
    const data = await getChapterTraffic(type as TrafficType, slug as string, {
      dateInterval,
    });
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
