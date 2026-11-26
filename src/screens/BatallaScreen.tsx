import React from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { VILLAINS, CRESTS } from '../data/digimonData';
import { useGame } from '../state/GameContext';

export const BatallaScreen: React.FC = () => {
  const { battle, activePartnerId, getPartnerDisplay, navigate, resetBattleRound } = useGame();

  const villain = VILLAINS.find((v) => v.id === battle.enemyId) || VILLAINS[0];
  const partnerInfo = getPartnerDisplay(activePartnerId);
  const activeCrest = CRESTS.find((c) => c.id === battle.activeCrestId);

  const enemyPct = Math.max(0, Math.min(100, (battle.enemyHp / battle.enemyMaxHp) * 100));
  const playerHpPct = Math.max(0, Math.min(100, (battle.playerHp / battle.playerMaxHp) * 100));
  const playerEpPct = Math.max(0, Math.min(100, (battle.playerEp / battle.playerEpMax) * 100));

  const turnFormatted = battle.turn < 10 ? `0${battle.turn}` : String(battle.turn);
  const partnerLevel =
    partnerInfo.stage === 1
      ? partnerInfo.partner.level
      : Math.min(15, partnerInfo.partner.level + (partnerInfo.stage - 1) * 3);
  const partnerLevelStr = partnerLevel < 10 ? `0${partnerLevel}` : String(partnerLevel);

  const battleFooter = (
    <footer className="grid grid-cols-2 gap-2 pb-1">
      <button
        type="button"
        onClick={() => navigate('digevol')}
        className="inline-flex items-center justify-center gap-1 px-2 py-4 bg-light-primary text-light-on-primary border-4 border-light-outline rounded arcade-shadow font-headline text-label-sm uppercase tracking-wide transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          auto_awesome
        </span>
        <span>DIGIEVOL</span>
      </button>

      <button
        type="button"
        onClick={() => navigate('atacar')}
        className="inline-flex items-center justify-center gap-1 px-2 py-4 bg-light-secondary text-light-on-secondary border-4 border-light-outline rounded arcade-shadow font-headline text-label-sm uppercase tracking-wide transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          bolt
        </span>
        <span>ATACAR</span>
      </button>

      <button
        type="button"
        onClick={() => navigate('escudo')}
        className="inline-flex items-center justify-center gap-1 px-2 py-4 bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow font-headline text-label-sm uppercase tracking-wide transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          shield
        </span>
        <span>ESCUDO</span>
      </button>

      <button
        type="button"
        onClick={() => navigate('especial')}
        className="inline-flex items-center justify-center gap-1 px-2 py-4 bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow font-headline text-label-sm uppercase tracking-wide transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          swap_horiz
        </span>
        <span>ESPECIAL</span>
      </button>
    </footer>
  );

  return (
    <ArcadeShell
      badgeText={`BATALLA · TURNO ${turnFormatted}`}
      backTo="inicio"
      backLabel="Volver a inicio"
      showTopNav
      activeNav="batalla"
      customFooter={battleFooter}
    >
      <main className="flex-1 flex flex-col justify-center gap-4">
        {/* Enemy Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 grid grid-cols-12 items-center gap-4">
          <div className="col-span-8 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-1">
              <h2 className="font-headline text-title-lg text-light-on-surface uppercase truncate">
                {villain.name.toUpperCase()}
              </h2>
              <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums shrink-0">
                {villain.level}
              </span>
            </div>
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase">
              {villain.id === 'devimon' ? 'Villano · Oscuridad' : villain.arc}
            </p>

            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-mono-md text-light-on-surface tabular-nums">PS</span>
                <span className="font-mono text-mono-md text-light-on-surface tabular-nums">
                  {battle.enemyHp} / {battle.enemyMaxHp}
                </span>
              </div>
              <div className="w-full h-3 bg-light-surface-container-low border-2 border-light-outline rounded-sm overflow-hidden">
                <div
                  className="h-full bg-light-error transition-all duration-200 origin-left"
                  style={{ width: `${enemyPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface-container">
            <DigimonImage
              src={villain.img}
              alt={`${villain.name} en posición de batalla`}
              className="w-full aspect-square object-cover block"
              fallbackLabel={villain.name}
            />
          </div>
        </article>

        {/* Player Partner Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 grid grid-cols-12 items-center gap-4">
          <div className="col-span-4 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface-container">
            <DigimonImage
              src={partnerInfo.img}
              alt={`${partnerInfo.formName} listo para atacar`}
              className="w-full aspect-square object-cover block"
              fallbackLabel={partnerInfo.formName}
            />
          </div>

          <div className="col-span-8 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-1">
              <h2 className="font-headline text-title-lg text-light-on-surface uppercase truncate">
                {partnerInfo.formName.toUpperCase()}
              </h2>
              <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums shrink-0">
                NV. {partnerLevelStr}
              </span>
            </div>
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase">
              Niño: {partnerInfo.partner.tamer} · Monstruo
              {activeCrest ? ` · ${activeCrest.crest}` : ''}
            </p>

            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-mono-md text-light-on-surface tabular-nums">PS</span>
                <span className="font-mono text-mono-md text-light-on-surface tabular-nums">
                  {battle.playerHp} / {battle.playerMaxHp}
                </span>
              </div>
              <div className="w-full h-3 bg-light-surface-container-low border-2 border-light-outline rounded-sm overflow-hidden">
                <div
                  className="h-full bg-light-primary transition-all duration-200 origin-left"
                  style={{ width: `${playerHpPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums">
                  PE
                </span>
                <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums">
                  {battle.playerEp} / {battle.playerEpMax}
                </span>
              </div>
              <div className="w-full h-2.5 bg-light-surface-container-low border-2 border-light-outline rounded-sm overflow-hidden">
                <div
                  className="h-full bg-light-secondary transition-all duration-200 origin-left"
                  style={{ width: `${playerEpPct}%` }}
                />
              </div>
            </div>
          </div>
        </article>

        {/* Combat Log Banner */}
        <section
          aria-live="polite"
          className="bg-light-surface-container border-4 border-light-outline rounded arcade-shadow-sm px-4 py-2 flex items-center justify-between gap-2"
        >
          <p className="font-body text-body-md text-light-on-surface text-pretty">{battle.log}</p>
          {battle.enemyHp === 0 && (
            <button
              type="button"
              onClick={resetBattleRound}
              className="shrink-0 px-3 py-1 bg-light-primary text-light-on-primary border-2 border-light-outline rounded font-label text-label-sm uppercase cursor-pointer"
            >
              Otra ronda
            </button>
          )}
        </section>
      </main>
    </ArcadeShell>
  );
};
