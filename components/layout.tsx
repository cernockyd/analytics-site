import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const router = useRouter();
  return (
    <div className="bg-gray-50 relative">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className="px-6 sm:px-8 bg-gray-50 max-w-7xl mx-auto">
        <nav className="flex justify-between items-center h-16">
          <Link
            className="flex text-base text-gray-500 hover:text-gray-700 font-semibold"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 -ml-1 mr-1"
            >
              <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
            </svg>
            {router.pathname !== '/' && 'Next-book Analytics'}
          </Link>{' '}
          <div className="flex items-center space-x-8">
            <div className="text-gray-500 hover:text-gray-700 relative md:flex justify-center text-base font space-x-8">
              <Link href="/about">About</Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="px-6 pb-6 pt-3 sm:pb-5 bg-gray-50 min-h-screen max-w-7xl mx-auto sm:px-8">
        {children}
      </main>
      <footer className="bg-gray-50 px-6 sm:px-8 text-sm max-w-7xl mx-auto leading-5">
        <div className="py-6 sm:py-8 max-w-10xl flex justify-between items-baseline text-center space-y-0 border-t border-gray-200">
          <p className="text-gray-500 max-w-10j">
            Simple analytical platform for web-based books.
          </p>
          <p className="flex space-x-8 text-sm text-gray-500 text-center">
            <Link href="https://github.com/next-book/analytics-site/issues/new">
              Send feedback on Github
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
