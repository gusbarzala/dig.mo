import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { PARTNERS } from '../data/digimonData';
import { useGame } from '../state/GameContext';

export const CompanerosScreen: React.FC = () => {
  const { partnerStages, setPartnerStage, getPartnerDisplay, setActivePartnerId, activePartnerId } =
    useGame();
  const [status, setStatus] = useState(
    'Toca el botón de cualquier evolución para transformar.'
  );

  const handleEvolve = (partnerId: string, stage: number, form: string, tamer: string) => {
    setPartnerStage(partnerId, stage);
    setActivePartnerId(partnerId);
    setStatus(`${tamer}: ¡Transformado en ${form} (FASE ${stage})!`);
  };

  return (
    <ArcadeShell
      badgeText="NIÑOS ELEGIDOS · 08"
      backTo="inicio"
      backLabel="Volver a inicio"
      showTopNav
      activeNav="companeros"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            DIGIEVOLUCIONES
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Toca cualquier evolución para transformar a cada compañero.
          </p>
        </div>

        <section className="flex flex-col gap-4">
          {PARTNERS.map((partner) => {
            const display = getPartnerDisplay(partner.id);
            const currentStage = partnerStages[partner.id] || 1;
            const isBattleActive = activePartnerId === partner.id;

            return (
              <article
                key={partner.id}
                className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-12 h-12 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                      <DigimonImage
                        src={display.img}
                        alt={`${display.formName} de ${partner.tamer}`}
                        className="w-full h-full object-cover block"
                        fallbackLabel={display.formName}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h2 className="font-title text-title-md text-light-on-surface truncate">
                        {display.formName}
                      </h2>
                      <p className="font-body text-body-md text-light-on-surface-variant">
                        {partner.tamerLabel}
                        {isBattleActive ? ' · En batalla' : ''}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2 py-1 bg-light-surface-container-low border-2 border-light-outline rounded-sm font-mono text-mono-md text-light-on-surface tabular-nums">
                    FASE {currentStage}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  {partner.evolutions.map((evo) => {
                    const isSelected = currentStage === evo.stage;
                    const isFifth = evo.stage === 5;
                    return (
                      <button
                        key={evo.stage}
                        type="button"
                        onClick={() =>
                          handleEvolve(partner.id, evo.stage, evo.form, partner.tamer)
                        }
                        className={`${
                          isFifth ? 'col-span-2' : ''
                        } px-2 py-1.5 border-2 border-light-outline rounded font-label text-label-sm text-center transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                          isSelected
                            ? 'bg-light-primary text-light-on-primary'
                            : 'bg-light-surface-container-low text-light-on-surface'
                        }`}
                      >
                        <span>{evo.shortLabel || evo.label}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </ArcadeShell>
  );
};
