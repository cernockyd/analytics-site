import Image from 'next/image';
import { useState } from 'react';

export default function BookIcon({ src, alt, size = 48 }) {
  const [error, setError] = useState(false);

  return (
    <div className="rounded-md overflow-hidden bg-gray-200 shrink-0 w-12 h-12">
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
