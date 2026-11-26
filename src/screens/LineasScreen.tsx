import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { OTHER_EVOLUTION_LINES } from '../data/digimonData';
import { useGame } from '../state/GameContext';

const LINE_KEYS = ['gabumon', 'palmon', 'biyomon', 'tentomon', 'gomamon', 'patamon', 'gatomon'];

export const LineasScreen: React.FC = () => {
  const { selectedLineKey, setSelectedLineKey, setActivePartnerId, setPartnerStage } = useGame();
  const [stageIdx, setStageIdx] = useState(2);

  const currentLine = OTHER_EVOLUTION_LINES[selectedLineKey] || OTHER_EVOLUTION_LINES.gabumon;
  const currentStage = currentLine.stages[stageIdx] || currentLine.stages[2];

  const handleSelectLine = (key: string) => {
    setSelectedLineKey(key);
    setStageIdx(2);
  };

  const handleSelectStage = (idx: number) => {
    setStageIdx(idx);
    const st = currentLine.stages[idx];
    const mappedStage = Math.max(1, Math.min(5, idx - 1));
    setActivePartnerId(currentLine.partnerId);
    setPartnerStage(currentLine.partnerId, mappedStage, {
      name: st.name,
      img: st.img,
      attack: st.atk,
    });
  };

  return (
    <ArcadeShell
      badgeText="LÍNEAS · DIGIMON"
      backTo="digevol"
      backLabel="Volver a línea Agumon"
      footerText={`${currentStage.name} (${currentLine.kid}): ${currentStage.atk}.`}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            OTRAS LÍNEAS
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Explora la línea de Gabumon, Palmon, Biyomon, Tentomon, Gomamon, Patamon y Gatomon.
          </p>
        </div>

        {/* Partner Selector Tabs */}
        <nav aria-label="Elegir línea evolutiva" className="flex flex-wrap gap-1">
          {LINE_KEYS.map((key) => {
            const line = OTHER_EVOLUTION_LINES[key];
            const isSelected = selectedLineKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectLine(key)}
                className={`px-2 py-1 border-2 border-light-outline rounded font-label text-label-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                {line.label}
              </button>
            );
          })}
        </nav>

        {/* Active Preview Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
            <DigimonImage
              src={currentStage.img}
              alt={currentStage.name}
              className="w-full h-full object-cover block"
              fallbackLabel={currentStage.name}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-mono text-mono-md text-light-primary uppercase tabular-nums">
              {currentStage.stage}
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface truncate">
              {currentStage.name}
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Ataque: {currentStage.atk}
            </p>
          </div>
        </article>

        {/* 6-Stage Evolution Grid */}
        <section aria-label="Etapas evolutivas" className="grid grid-cols-2 gap-2">
          {currentLine.stages.map((st, idx) => {
            const isActive = idx === stageIdx;
            return (
              <button
                key={st.name}
                type="button"
                onClick={() => handleSelectStage(idx)}
                className={`px-2 py-2 border-4 border-light-outline rounded arcade-shadow-sm font-label text-label-sm text-left cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                <span>
                  {idx + 1}. {st.name}
                </span>
              </button>
            );
          })}
        </section>
      </main>
    </ArcadeShell>
  );
};
