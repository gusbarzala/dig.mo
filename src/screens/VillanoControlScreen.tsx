import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { VILLAINS } from '../data/digimonData';
import { useGame } from '../state/GameContext';

const TAB_ORDER = ['myotismon', 'devimon', 'etemon', 'amos_oscuros', 'apocalymon'];

export const VillanoControlScreen: React.FC = () => {
  const {
    selectedVillainControlId,
    setSelectedVillainControlId,
    villainMonsterStates,
    applyVillainPower,
  } = useGame();
  const [status, setStatus] = useState(
    'Elige un villano y pulsa ELIMINAR, RESTAURAR o PAUSAR.'
  );

  const orderedVillains = TAB_ORDER.map(
    (id) => VILLAINS.find((v) => v.id === id) || VILLAINS[0]
  );
  const currentVillain =
    VILLAINS.find((v) => v.id === selectedVillainControlId) || VILLAINS[2];
  const monsterStates = villainMonsterStates[currentVillain.id] || [
    'activo',
    'activo',
    'activo',
  ];

  const handleSelectVillain = (id: string) => {
    const v = VILLAINS.find((item) => item.id === id) || VILLAINS[0];
    setSelectedVillainControlId(id);
    setStatus(`${v.name} seleccionado: ${v.controlSub}.`);
  };

  const handlePower = (power: 'eliminar' | 'restaurar' | 'pausar') => {
    const msg = applyVillainPower(power);
    setStatus(msg);
  };

  return (
    <ArcadeShell
      badgeText="PODER · VILLANO"
      backTo="villanos"
      backLabel="Volver a villanos"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            CONTROL VILLANO
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Myotismon y Mujer Murciélago controlan a los monstruos digitales.
          </p>
        </div>

        {/* Villain Selector Pills */}
        <nav aria-label="Villanos" className="flex flex-wrap gap-1">
          {orderedVillains.map((v) => {
            const isSelected = currentVillain.id === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => handleSelectVillain(v.id)}
                className={`px-2 py-1 border-2 border-light-outline rounded font-label text-label-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                {v.name}
              </button>
            );
          })}
        </nav>

        {/* Villain Duo Banner */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-12 h-12 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
              <DigimonImage
                src={currentVillain.img}
                alt={currentVillain.name}
                className="w-full h-full object-cover block"
                fallbackLabel={currentVillain.name}
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="font-title text-title-md text-light-on-surface">
                {currentVillain.name}
              </h2>
              <p className="font-body text-body-md text-light-on-surface-variant">
                {currentVillain.controlSub}
              </p>
            </div>
          </div>
          <div className="px-2 py-1 bg-light-surface-container-low border-2 border-light-outline rounded-sm shrink-0">
            <span className="font-mono text-mono-md text-light-on-surface uppercase">
              {currentVillain.level}
            </span>
          </div>
        </article>

        {/* Target Digital Monsters List */}
        <section className="flex flex-col gap-1" aria-label="Monstruos digitales">
          {currentVillain.targets.map((target, idx) => {
            const st = monsterStates[idx] || 'activo';
            const isEliminado = st === 'eliminado';
            const isCongelado = st === 'congelado';
            return (
              <article
                key={target.name}
                className={`bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm px-4 py-2 flex items-center justify-between gap-2 ${
                  isEliminado ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-11 h-11 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                    <DigimonImage
                      src={target.img}
                      alt={target.name}
                      className="w-full h-full object-cover block"
                      fallbackLabel={target.name}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`font-title text-title-md text-light-on-surface ${
                        isEliminado ? 'line-through' : ''
                      }`}
                    >
                      {target.name}
                    </span>
                    <span className="font-mono text-mono-md text-light-on-surface-variant">
                      {target.info}
                    </span>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 border-2 border-light-outline rounded-sm font-mono text-mono-md uppercase ${
                    isEliminado
                      ? 'bg-light-error text-light-on-error'
                      : isCongelado
                        ? 'bg-light-secondary-container text-light-on-secondary-container'
                        : 'bg-light-primary-container text-light-on-primary-container'
                  }`}
                >
                  {isEliminado ? 'ELIMINADO' : isCongelado ? 'CONGELADO' : 'ACTIVO'}
                </span>
              </article>
            );
          })}
        </section>

        {/* 3 Villain Power Buttons */}
        <section className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handlePower('eliminar')}
            className="w-full inline-flex items-center justify-between gap-2 px-4 py-2 bg-light-error text-light-on-error border-4 border-light-outline rounded arcade-shadow transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined" aria-hidden="true">
                delete_forever
              </span>
              <span className="font-headline text-label-lg uppercase">ELIMINAR</span>
            </span>
            <span className="font-label text-label-sm text-right">
              {currentVillain.name} · {currentVillain.targets[0]?.name} y{' '}
              {currentVillain.targets[1]?.name}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePower('restaurar')}
            className="w-full inline-flex items-center justify-between gap-2 px-4 py-2 bg-light-primary text-light-on-primary border-4 border-light-outline rounded arcade-shadow transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined" aria-hidden="true">
                restart_alt
              </span>
              <span className="font-headline text-label-lg uppercase">RESTAURAR</span>
            </span>
            <span className="font-label text-label-sm text-right">
              Mujer Murciélago (LadyDevimon)
            </span>
          </button>

          <button
            type="button"
            onClick={() => handlePower('pausar')}
            className="w-full inline-flex items-center justify-between gap-2 px-4 py-2 bg-light-secondary text-light-on-secondary border-4 border-light-outline rounded arcade-shadow transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined" aria-hidden="true">
                ac_unit
              </span>
              <span className="font-headline text-label-lg uppercase">PAUSAR</span>
            </span>
            <span className="font-label text-label-sm text-right">
              Congelar monstruos digitales
            </span>
          </button>
        </section>

        {/* Registro de Derrotas de Villanos */}
        <section
          aria-label="Registro de derrotas"
          className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-1 border-b-2 border-light-outline pb-1">
            <h2 className="font-headline text-label-lg text-light-on-surface uppercase">
              DERROTAS
            </h2>
            <span className="font-mono text-mono-md text-light-on-surface-variant uppercase">
              TEMP. 1
            </span>
          </div>

          <ul className="flex flex-col gap-1 font-body text-body-md text-light-on-surface">
            <li className="bg-light-surface-container-low border-2 border-light-outline rounded-sm px-2 py-1">
              <span className="font-title font-bold">Devimon:</span> Eliminado por Angemon.
            </li>
            <li className="bg-light-surface-container-low border-2 border-light-outline rounded-sm px-2 py-1">
              <span className="font-title font-bold">Etemon:</span> Eliminado por MetalGreymon.
            </li>
            <li className="bg-light-surface-container-low border-2 border-light-outline rounded-sm px-2 py-1 flex flex-col gap-1">
              <span className="font-title font-bold uppercase">Amos Oscuros:</span>
              <span>
                • <span className="font-bold">MetalSeadramon:</span> Eliminado por WarGreymon en el
                océano.
              </span>
              <span>
                • <span className="font-bold">Puppetmon (Pinochimon):</span> Derrotado por
                MetalGarurumon.
              </span>
              <span>
                • <span className="font-bold">Machinedramon (Mugendramon):</span> Eliminado por
                WarGreymon.
              </span>
              <span>
                • <span className="font-bold">Piedmon:</span> Derrotado por WarGreymon y
                MetalGarurumon tras ser enviado al portal de la oscuridad por Angemon y MagnaAngemon.
              </span>
            </li>
            <li className="bg-light-surface-container-low border-2 border-light-outline rounded-sm px-2 py-1">
              <span className="font-title font-bold">Apocalymon:</span> Eliminó las joyas de
              Digimon; lograron recuperarlas y es derrotado por los niños de Digimon.
            </li>
          </ul>
        </section>
      </main>
    </ArcadeShell>
  );
};
