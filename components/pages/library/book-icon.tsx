import Image from 'next/image';
import { useState } from 'react';

export default function BookIcon({ src, alt }) {
  const [error, setError] = useState(false);
  const size = 48;

  return (
    <div className="rounded-full overflow-hidden bg-gray-200 shrink-0 w-10 h-10">
      {!error && (
        <Image
          src={src}
          alt={alt}
          className="object-cover"
          width={size}
          height={size}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
