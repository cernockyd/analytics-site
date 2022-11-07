import Layout from 'components/layout';
import Link from 'next/link';

function Paragraph({ children }) {
  return (
    <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-lg lg:mx-auto">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <Layout title="About Analytics">
      <main className="mx-auto my-6 max-w-7xl px-4 sm:my-8 sm:px-6 md:my-9 lg:my-10 lg:px-8 xl:my-12 pb-6">
        <div className="items-center">
          <h1 className="text-4xl text-center font-bold tracking-tight text-gray-900 sm:text-5xl md:text-5xl">
            About Analytics
          </h1>
          <Paragraph>
            Next-book Analytics enables to see core reading metrics of web-based
            books powered by Next-book open platform.
          </Paragraph>
          <Paragraph>
            The platform currently shows interaction data of every Next-book
            published under{' '}
            <Link
              className="text-amber-600 underline"
              href="https://github.com/books-are-next"
            >
              Books Are Next
            </Link>{' '}
            organisation.
          </Paragraph>
          <h1 className="text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-4xl md:text-4xl mt-6 sm:mt-8 md:mt-10">
            What’s Next-book?
          </h1>
          <Paragraph>
            Did you ever wonder how could books that truly utilise the potential
            of web platform might look?{' '}
            <Link
              className="text-amber-600 underline"
              href="https://next-book.info/"
            >
              Next-book
            </Link>{' '}
            is an open platform for publishing and reading on the web. Every
            book is a standalone website, utilizing the core ideas of the web
            technology for good reading experience. Next-book is developed by
            next-book, z. s., a non profit based in Czech Republic, and its{' '}
            <Link
              className="text-amber-600 underline"
              href="https://github.com/next-book"
            >
              source code
            </Link>{' '}
            can be found on GitHub.
          </Paragraph>
        </div>
      </main>
    </Layout>
  );
}
