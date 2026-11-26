import React from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { IMAGES } from '../data/digimonData';
import { GameMode, useGame } from '../state/GameContext';

const MODE_OPTIONS: { id: GameMode; label: string; desc: string }[] = [
  {
    id: 'Historia',
    label: 'Historia',
    desc: 'Sigue la aventura de la Temporada 1 desde la Isla File.',
  },
  {
    id: 'Arcade',
    label: 'Arcade',
    desc: 'Combates rápidos contra Digimon salvajes y jefes.',
  },
  {
    id: 'Jefe',
    label: 'Jefe Final',
    desc: 'Desafía directo a Devimon, Myotismon o Apocalymon.',
  },
];

export const JugarScreen: React.FC = () => {
  const { gameMode, setGameMode, startBattleMode, navigate, activePartnerId, getPartnerDisplay } =
    useGame();

  const activeInfo = getPartnerDisplay(activePartnerId);
  const currentModeObj = MODE_OPTIONS.find((m) => m.id === gameMode) || MODE_OPTIONS[0];
  const heroTitle =
    activePartnerId === 'tai' && activeInfo.stage === 1
      ? 'Tai & Agumon'
      : `${activeInfo.partner.tamer} & ${activeInfo.formName}`;
  const heroImg =
    activePartnerId === 'tai' && activeInfo.stage === 1 ? IMAGES.taiAgumonHero : activeInfo.img;

  return (
    <ArcadeShell
      badgeText="MODO · JUGAR"
      backTo="inicio"
      backLabel="Volver al inicio"
      showTopNav
      activeNav="jugar"
      footerText={`Modo ${currentModeObj.id}: ${currentModeObj.desc}`}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            JUGAR
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Elige tu modo de aventura y salta al Mundo Digital con Tai y Agumon.
          </p>
        </div>

        {/* Active Partner Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-14 h-14 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
              <DigimonImage
                src={heroImg}
                alt={`${heroTitle} listos para jugar`}
                className="w-full h-full object-cover block"
                fallbackLabel={activeInfo.formName}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-title text-title-md text-light-on-surface truncate">
                {heroTitle}
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant truncate">
                Equipo activo · Isla File
              </p>
            </div>
          </div>
          <div className="px-2 py-1 bg-light-surface-container-low border-2 border-light-outline rounded-sm shrink-0">
            <span className="font-mono text-mono-md text-light-on-surface tabular-nums uppercase">
              NV. {activeInfo.stage < 10 ? `0${activeInfo.stage}` : activeInfo.stage}
            </span>
          </div>
        </article>

        {/* Mode Selector Pills */}
        <nav aria-label="Modos de juego" className="grid grid-cols-3 gap-1">
          {MODE_OPTIONS.map((mode) => {
            const isSelected = gameMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setGameMode(mode.id)}
                className={`px-2 py-1.5 border-2 border-light-outline rounded font-label text-label-sm whitespace-nowrap cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </nav>

        {/* Primary Play CTA */}
        <button
          type="button"
          onClick={startBattleMode}
          className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-light-secondary text-light-on-secondary border-4 border-light-outline rounded arcade-shadow-lg font-headline text-label-lg uppercase tracking-wider transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            play_arrow
          </span>
          <span>¡A JUGAR!</span>
        </button>

        {/* Quick Access Destinations Grid */}
        <section aria-label="Zonas del juego" className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate('batalla')}
            className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm p-2 flex flex-col items-start gap-1 text-left transition-transform duration-75 hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-light-primary" aria-hidden="true">
              swords
            </span>
            <span className="font-title text-title-md text-light-on-surface">Batalla</span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Digevol y ataques
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('companeros')}
            className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm p-2 flex flex-col items-start gap-1 text-left transition-transform duration-75 hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-light-primary" aria-hidden="true">
              groups
            </span>
            <span className="font-title text-title-md text-light-on-surface">Compañeros</span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              8 niños elegidos
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('inventario')}
            className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm p-2 flex flex-col items-start gap-1 text-left transition-transform duration-75 hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-light-primary" aria-hidden="true">
              backpack
            </span>
            <span className="font-title text-title-md text-light-on-surface">Inventario</span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Joyas y objetos
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('villanos')}
            className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm p-2 flex flex-col items-start gap-1 text-left transition-transform duration-75 hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-light-error" aria-hidden="true">
              skull
            </span>
            <span className="font-title text-title-md text-light-on-surface">Villanos</span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Temporada 1
            </span>
          </button>
        </section>
      </main>
    </ArcadeShell>
  );
};
