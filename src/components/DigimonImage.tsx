import React, { useState } from 'react';

interface DigimonImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const DigimonImage: React.FC<DigimonImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover block',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-light-surface-container-low text-light-on-surface p-1 text-center"
        role="img"
        aria-label={alt}
      >
        <span className="material-symbols-outlined text-light-primary text-2xl" aria-hidden="true">
          catching_pokemon
        </span>
        {fallbackLabel && (
          <span className="font-mono text-[10px] font-bold uppercase truncate max-w-full mt-0.5">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
