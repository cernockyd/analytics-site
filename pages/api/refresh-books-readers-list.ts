import { NextApiRequest, NextApiResponse } from 'next';
import sql from 'lib/postgres';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await sql.unsafe(`
      create materialized view if not exists books_readers
      as
        select
          domain,
          split_part(domain, 'books-are-next.github.io/', 2) as slug,
          count(distinct client_id) as readers
        from events
        where domain != '127.0.0.1:23011'
        group by domain
        order by readers desc
    `);
    await sql.unsafe(`
      refresh materialized view books_readers
    `);
    res.status(200).json({ statusCode: 200 });
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
