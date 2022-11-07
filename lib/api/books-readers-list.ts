import sql from 'lib/postgres';
import { ServerFilterData } from 'lib/dashboard/hooks/use-dashboard-data';

export type QueryRow = {
  domain: string;
  readers: number;
};

export type ResultRow = {
  domain: string;
  slug: string;
  readers: number;
};

export type BooksReadersItem = ResultRow;
export type BooksReadersList = ResultRow[];

export async function getBooksReadersList(
  filter: ServerFilterData,
  page: number,
  pageSize: number
): Promise<BooksReadersList> {
  const rows = await sql.unsafe<QueryRow[]>(
    `
    select
      slug,
      domain,
      readers
    from books_readers_by_year
    order by readers desc, domain asc
    limit $1 offset $2 
  `,
    [pageSize, (page - 1) * pageSize]
  );
  return rows.map((x) => ({
    slug: x.domain.split('books-are-next.github.io/')[1],
    ...x,
  }));
}
