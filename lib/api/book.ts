import { Manifest } from '@next-book/publisher';
import getDomain from 'lib/domain';

export interface Book extends Manifest {
  slug?: string;
  domain: string;
}

export async function getBook(slug: string): Promise<Book> {
  const domain = getDomain(slug);
  const pagesLink = `https://${domain}`;
  let manifest: Manifest | null = null;
  const res = await fetch(pagesLink + '/manifest.json');
  manifest = (await res.json()) as Manifest;
  return { slug, domain, ...manifest };
}
