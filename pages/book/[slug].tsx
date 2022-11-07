import { GetStaticProps, GetStaticPaths } from 'next';
import Dashboard from 'components/pages/dashboard';
import { getBook, Book } from 'lib/api/book';

type Props = {
  book?: Book;
  errors?: string;
};

export default function DashboardPage({ book }: Props) {
  return <Dashboard book={book} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // We'll pre-render 0 paths at build time.
  // { fallback: 'blocking' } will render pages on demand.
  return { paths: [], fallback: 'blocking' };
};

// This function gets called at build time on server-side.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const revalidateFrequency = 600;
  try {
    const slug = params?.slug as string;
    const book = await getBook(slug);
    return { props: { book }, revalidate: revalidateFrequency };
  } catch (err: any) {
    return { props: { errors: err.message }, revalidate: revalidateFrequency };
  }
};
