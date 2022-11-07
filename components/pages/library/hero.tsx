export default function Hero() {
  return (
    <main className="mx-auto my-6 max-w-7xl px-4 sm:my-8 sm:px-6 md:my-9 lg:my-10 lg:px-8 xl:my-12 pb-6">
      <div className="text-center items-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Next-book </span>{' '}
          <span className="block text-amber-600 xl:inline">Analytics</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-auto">
          See core reading metrics of web-based books powered by the Next-book’s
          open web book publishing platform.
        </p>
      </div>
    </main>
  );
}
