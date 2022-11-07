import { NextApiRequest, NextApiResponse } from 'next';
import Response from 'lib/response';
import { KPIType } from 'lib/utils';
import {
  BooksReadersList,
  getBooksReadersList,
} from 'lib/api/books-readers-list';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Response<BooksReadersList>>
) => {
  try {
    const {
      query: { type, page, pageSize, dateStart, dateEnd },
    } = req;
    if (!type) throw new Error('Type not provided.');
    if (!['readers'].includes(type as KPIType))
      throw new Error('Type not allowed.');
    if (!page || Array.isArray(page) || !parseInt(page))
      throw new Error('Page not provided.');
    if (!pageSize || Array.isArray(pageSize) || !parseInt(pageSize))
      throw new Error('Page size not provided.');
    if (!dateStart || Array.isArray(dateStart))
      throw new Error('Date start part not provided.');
    if (!dateEnd || Array.isArray(dateEnd))
      throw new Error('Date end part not provided.');
    const dateInterval = {
      start: new Date(dateStart),
      end: new Date(dateEnd),
    };
    const filterData = { dateInterval };
    const data = await getBooksReadersList(
      filterData,
      parseInt(page),
      parseInt(pageSize)
    );
    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
