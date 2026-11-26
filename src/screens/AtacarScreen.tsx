import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { IMAGES } from '../data/digimonData';
import { useGame } from '../state/GameContext';

interface AttackMode {
  key: 'BASE' | 'META' | 'WAR';
  name: string;
  modeLabel: string;
  move: string;
  dmg: number;
  epCost: number;
  img: string;
}

const ATTACK_MODES: AttackMode[] = [
  {
    key: 'BASE',
    name: 'AGUMON',
    modeLabel: 'FORMA BASE · ATQ 35',
    move: 'Llama Bebé',
    dmg: 35,
    epCost: 0,
    img: IMAGES.agumon,
  },
  {
    key: 'META',
    name: 'METALGREYMON',
    modeLabel: 'META · ATQ 85',
    move: 'Giga Destructor',
    dmg: 85,
    epCost: 15,
    img: IMAGES.metalGreymon,
  },
  {
    key: 'WAR',
    name: 'WARGREYMON',
    modeLabel: 'WAR · ATQ 140',
    move: 'Fuerza Terra',
    dmg: 140,
    epCost: 25,
    img: IMAGES.warGreymon,
  },
];

export const AtacarScreen: React.FC = () => {
  const { performAttack, battle, navigate } = useGame();
  const [selectedKey, setSelectedKey] = useState<'BASE' | 'META' | 'WAR'>('BASE');
  const [status, setStatus] = useState('Elige BASE, META o WAR y pulsa ATACAR.');
  const [attackHit, setAttackHit] = useState(false);

  const currentMode = ATTACK_MODES.find((m) => m.key === selectedKey) || ATTACK_MODES[0];

  const handleSelectMode = (mode: AttackMode) => {
    setSelectedKey(mode.key);
    setStatus(`Transformado en ${mode.name}. ¡Listo para atacar!`);
  };

  const handleAttack = () => {
    const resultMsg = performAttack(
      currentMode.dmg,
      currentMode.epCost,
      currentMode.move,
      currentMode.name
    );
    setStatus(resultMsg);
    setAttackHit(true);
    window.setTimeout(() => setAttackHit(false), 200);
  };

  return (
    <ArcadeShell
      badgeText="ATACAR · META / WAR"
      backTo="batalla"
      backLabel="Volver a batalla"
      footerText={status}
    >
      <main className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            MODO ATAQUE
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Un solo Digimon: transforma a Agumon en Meta o War para atacar.
          </p>
        </div>

        {/* Featured Digimon Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex flex-col items-center gap-4 text-center">
          <div
            className={`w-40 h-40 overflow-hidden rounded-sm border-4 border-light-outline bg-light-surface transition-transform duration-150 ${
              attackHit ? 'scale-105' : 'scale-100'
            }`}
          >
            <DigimonImage
              src={currentMode.img}
              alt={currentMode.name}
              className="w-full h-full object-cover block"
              fallbackLabel={currentMode.name}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <span className="font-mono text-mono-md text-light-primary uppercase tabular-nums">
              {currentMode.modeLabel}
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface">
              {currentMode.name}
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Técnica: {currentMode.move}
            </p>
            <p className="font-mono text-mono-md text-light-on-surface-variant tabular-nums">
              Enemigo PS: {battle.enemyHp} / {battle.enemyMaxHp} · Tu PE: {battle.playerEp}/{battle.playerEpMax}
            </p>
          </div>

          {/* Transform into Meta / War */}
          <div className="grid grid-cols-3 gap-1 w-full">
            {ATTACK_MODES.map((mode) => {
              const isActive = selectedKey === mode.key;
              return (
                <button
                  key={mode.key}
                  type="button"
                  onClick={() => handleSelectMode(mode)}
                  className={`px-1 py-2 border-2 border-light-outline rounded font-label text-label-sm uppercase cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-light-primary text-light-on-primary'
                      : 'bg-light-surface-container-low text-light-on-surface'
                  }`}
                >
                  <span>{mode.key}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <button
              type="button"
              onClick={handleAttack}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-light-secondary text-light-on-secondary border-4 border-light-outline rounded arcade-shadow-sm font-headline text-label-lg uppercase tracking-wider transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                bolt
              </span>
              <span>ATACAR</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('batalla')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-surface-container-low text-light-on-surface border-2 border-light-outline rounded font-label text-label-sm uppercase cursor-pointer"
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">
                swords
              </span>
              <span>Ver estado en Batalla</span>
            </button>
          </div>
        </article>
      </main>
    </ArcadeShell>
  );
};
