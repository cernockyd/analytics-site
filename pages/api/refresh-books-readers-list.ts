import { NextApiRequest, NextApiResponse } from 'next';
import sql from 'lib/postgres';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sql.unsafe(`
      refresh materialized view books_readers_by_year
    `);
    res.status(200).json({ statusCode: 200 });
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
