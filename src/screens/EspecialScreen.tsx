import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { useGame } from '../state/GameContext';

export const EspecialScreen: React.FC = () => {
  const { swapPairs, swapPartnerPair, getPartnerDisplay, setActivePartnerId, activePartnerId } =
    useGame();
  const [status, setStatus] = useState(
    'Toca las flechas para reemplazar un compañero por otro.'
  );

  const handleSwap = (idx: number) => {
    const res = swapPartnerPair(idx);
    setStatus(`¡Reemplazo hecho! ${res.leftName} ↔ ${res.rightName}.`);
  };

  const handleSelectForBattle = (partnerId: string, name: string) => {
    setActivePartnerId(partnerId);
    setStatus(`${name} seleccionado como compañero activo en batalla.`);
  };

  return (
    <ArcadeShell
      badgeText="ESPECIAL · CAMBIO"
      backTo="batalla"
      backLabel="Volver a batalla"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            REEMPLAZO DIGI
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Intercambia un compañero por otro (ej. Agumon por Palmon).
          </p>
        </div>

        <section className="flex flex-col gap-2">
          {swapPairs.map((pair, idx) => {
            const left = getPartnerDisplay(pair.leftPartnerId);
            const right = getPartnerDisplay(pair.rightPartnerId);
            const isOdd = idx % 2 === 1;

            return (
              <article
                key={`${pair.leftPartnerId}-${pair.rightPartnerId}-${idx}`}
                className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-2 grid grid-cols-[1fr_auto_1fr] items-center gap-1"
              >
                <button
                  type="button"
                  onClick={() => handleSelectForBattle(left.partner.id, left.formName)}
                  className={`flex items-center gap-1.5 min-w-0 text-left rounded-sm p-1 cursor-pointer transition-colors ${
                    activePartnerId === left.partner.id ? 'bg-light-primary-container' : ''
                  }`}
                >
                  <div className="w-9 h-9 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                    <DigimonImage
                      src={left.img}
                      alt={left.formName}
                      className="w-full h-full object-cover block"
                      fallbackLabel={left.formName}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-title text-label-sm text-light-on-surface truncate">
                      {left.formName}
                    </span>
                    <span className="font-mono text-mono-md text-light-on-surface-variant truncate">
                      {left.partner.tamer}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwap(idx)}
                  aria-label={`Intercambiar ${left.formName} y ${right.formName}`}
                  className={`shrink-0 inline-flex items-center justify-center w-9 h-9 border-2 border-light-outline rounded arcade-shadow-sm transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                    isOdd
                      ? 'bg-light-secondary text-light-on-secondary'
                      : 'bg-light-primary text-light-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    swap_horiz
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectForBattle(right.partner.id, right.formName)}
                  className={`flex items-center justify-end gap-1.5 min-w-0 text-right rounded-sm p-1 cursor-pointer transition-colors ${
                    activePartnerId === right.partner.id ? 'bg-light-primary-container' : ''
                  }`}
                >
                  <div className="flex flex-col items-end min-w-0">
                    <span className="font-title text-label-sm text-light-on-surface truncate">
                      {right.formName}
                    </span>
                    <span className="font-mono text-mono-md text-light-on-surface-variant truncate">
                      {right.partner.tamer}
                    </span>
                  </div>
                  <div className="w-9 h-9 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                    <DigimonImage
                      src={right.img}
                      alt={right.formName}
                      className="w-full h-full object-cover block"
                      fallbackLabel={right.formName}
                    />
                  </div>
                </button>
              </article>
            );
          })}
        </section>
      </main>
    </ArcadeShell>
  );
};
