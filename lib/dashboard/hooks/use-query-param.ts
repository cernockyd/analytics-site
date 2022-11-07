import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useQueryParam(
  setDate: (date: { start: Date; end: Date }) => unknown
) {
  const router = useRouter();
  useEffect(() => {
    if ('URLSearchParams' in window) {
      const { search } = window.location;
      const params = new URLSearchParams(search);
      const start = new Date(params.get('start'));
      const end = new Date(params.get('end'));
      if (start && end) {
        setDate({ start, end });
      }
    }
  }, [setDate, router.pathname]);
}
