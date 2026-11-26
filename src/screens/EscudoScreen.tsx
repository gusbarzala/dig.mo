import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { CRESTS, IMAGES, CrestItem } from '../data/digimonData';
import { useGame } from '../state/GameContext';

export const EscudoScreen: React.FC = () => {
  const { battle, activateCrest } = useGame();
  const [status, setStatus] = useState(
    'Selecciona cualquiera de las 8 joyas para activar el escudo.'
  );

  const handleSelectCrest = (crest: CrestItem) => {
    const msg = activateCrest(crest);
    setStatus(msg);
  };

  return (
    <ArcadeShell
      badgeText="ESCUDO · 8 JOYAS"
      backTo="batalla"
      backLabel="Volver a batalla"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            LAS 8 JOYAS
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Emblemas de los 8 Niños Elegidos. Toca una joya para activar su escudo.
          </p>
        </div>

        {/* Crests Showcase */}
        <figure className="bg-light-surface-container-high border-4 border-light-outline rounded arcade-shadow p-2">
          <DigimonImage
            src={IMAGES.crestShowcase}
            alt="Joyas y emblemas de los 8 Niños Elegidos"
            className="w-full h-44 object-contain block rounded-sm"
            fallbackLabel="8 JOYAS"
          />
        </figure>

        {/* 8 Crests Grid */}
        <section className="grid grid-cols-2 gap-2">
          {CRESTS.map((crest) => {
            const isSelected = battle.activeCrestId === crest.id;
            return (
              <button
                key={crest.id}
                type="button"
                onClick={() => handleSelectCrest(crest)}
                className={`border-4 border-light-outline rounded arcade-shadow p-2 flex flex-col items-start gap-1 text-left transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  isSelected ? 'bg-light-primary-container' : 'bg-light-surface-container'
                } text-light-on-surface`}
              >
                <div className="flex items-center justify-between w-full gap-1">
                  <div className="w-10 h-10 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                    <DigimonImage
                      src={crest.img}
                      alt={crest.alt}
                      className="w-full h-full object-cover block"
                      fallbackLabel={crest.crest}
                    />
                  </div>
                  <span className="font-mono text-mono-md text-light-on-surface-variant">
                    {crest.childUpper}
                  </span>
                </div>
                <span className="font-title text-title-md text-light-on-surface">
                  {crest.crest}
                </span>
                <span className="font-label text-label-sm text-light-primary uppercase">
                  {crest.boost}
                </span>
              </button>
            );
          })}
        </section>
      </main>
    </ArcadeShell>
  );
};
