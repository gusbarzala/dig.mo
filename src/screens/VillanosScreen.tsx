import React from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { VILLAINS } from '../data/digimonData';
import { useGame } from '../state/GameContext';

export const VillanosScreen: React.FC = () => {
  const { challengeVillain, navigate } = useGame();

  return (
    <ArcadeShell
      badgeText="TEMP. 01 · JEFES"
      backTo="inicio"
      backLabel="Volver a inicio"
      showTopNav
      activeNav="villanos"
      footerText="Elige un villano de la Temporada 1 para iniciar el duelo."
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            VILLANOS · T1
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Jefes principales de cada arco de Digimon Adventure (Temporada 1).
          </p>
        </div>

        <section className="flex flex-col gap-2">
          {VILLAINS.map((villain, idx) => {
            const isPrimary = idx === 0;
            return (
              <article
                key={villain.id}
                className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-11 h-11 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                    <DigimonImage
                      src={villain.img}
                      alt={villain.name}
                      className="w-full h-full object-cover block"
                      fallbackLabel={villain.name}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-title text-title-md text-light-on-surface truncate">
                        {villain.name}
                      </h2>
                      <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums shrink-0">
                        {villain.level}
                      </span>
                    </div>
                    <p className="font-body text-body-md text-light-on-surface-variant">
                      {villain.shortDesc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => challengeVillain(villain.id)}
                  className={`shrink-0 px-4 py-2 border-2 border-light-outline rounded font-label text-label-sm uppercase transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                    isPrimary
                      ? 'bg-light-primary text-light-on-primary'
                      : 'bg-light-secondary text-light-on-secondary'
                  }`}
                >
                  <span>RETAR</span>
                </button>
              </article>
            );
          })}
        </section>

        {/* Access Villain Control Screen */}
        <button
          type="button"
          onClick={() => navigate('villano-control')}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm font-label text-label-sm uppercase cursor-pointer hover:-translate-y-0.5 transition-transform"
        >
          <span className="material-symbols-outlined text-base text-light-error" aria-hidden="true">
            bolt
          </span>
          <span>Poder Villano: Eliminar · Restaurar · Pausar</span>
        </button>
      </main>
    </ArcadeShell>
  );
};
