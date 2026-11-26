import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { AGUMON_FULL_LINE, IMAGES, AgumonFormItem } from '../data/digimonData';
import { useGame } from '../state/GameContext';

const KIDS_QUICK = [
  { kid: 'Tai', partner: 'Agumon', img: IMAGES.taiKid, lineKey: null },
  { kid: 'Mimi', partner: 'Palmon', img: IMAGES.mimiKid, lineKey: 'palmon' },
  { kid: 'Sora', partner: 'Biyomon', img: IMAGES.soraKid, lineKey: 'biyomon' },
];

export const DigevolScreen: React.FC = () => {
  const { setPartnerStage, setActivePartnerId, navigate, setSelectedLineKey } = useGame();
  const [selectedKid, setSelectedKid] = useState('Tai');
  const [selectedForm, setSelectedForm] = useState<AgumonFormItem>(AGUMON_FULL_LINE[2]);
  const [status, setStatus] = useState('Agumon seleccionado. Toca otra evolución para cambiar.');

  const handleSelectForm = (item: AgumonFormItem) => {
    setSelectedForm(item);
    setActivePartnerId('tai');
    setPartnerStage('tai', item.battleStage || 1, {
      name: item.name,
      img: item.img,
      attack: item.atk,
    });
    setStatus(`¡Digievolución lista: ${item.name}!`);
  };

  const handleSelectKid = (kidObj: (typeof KIDS_QUICK)[number]) => {
    setSelectedKid(kidObj.kid);
    setStatus(`Niño elegido: ${kidObj.kid} (Compañero: ${kidObj.partner}).`);
    if (kidObj.lineKey) {
      setSelectedLineKey(kidObj.lineKey);
    }
  };

  return (
    <ArcadeShell
      badgeText="DIGEVOL · AGUMON"
      backTo="batalla"
      backLabel="Volver a batalla"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            LÍNEA AGUMON
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Todos los nombres y evoluciones de Agumon. Toca uno para verlo.
          </p>
        </div>

        {/* Niños Elegidos: Tai, Mimi, Sora */}
        <section aria-label="Niños elegidos" className="grid grid-cols-3 gap-1">
          {KIDS_QUICK.map((k) => {
            const isSelected = selectedKid === k.kid;
            return (
              <button
                key={k.kid}
                type="button"
                onClick={() => handleSelectKid(k)}
                className={`border-4 border-light-outline rounded arcade-shadow-sm p-1.5 flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                <div className="w-14 h-14 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
                  <DigimonImage
                    src={k.img}
                    alt={`${k.kid}`}
                    className="w-full h-full object-cover block"
                    fallbackLabel={k.kid}
                  />
                </div>
                <span className="font-label text-label-sm uppercase">{k.kid}</span>
              </button>
            );
          })}
        </section>

        {/* Active Preview Card */}
        <article className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
            <DigimonImage
              src={selectedForm.img}
              alt={selectedForm.name}
              className="w-full h-full object-cover block"
              fallbackLabel={selectedForm.name}
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-mono text-mono-md text-light-primary uppercase tabular-nums">
              {selectedForm.stage}
            </span>
            <h2 className="font-headline text-title-lg text-light-on-surface truncate">
              {selectedForm.name}
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Ataque: {selectedForm.atk}
            </p>
          </div>
        </article>

        {/* All Agumon Forms Grid */}
        <section className="grid grid-cols-2 gap-2">
          {AGUMON_FULL_LINE.map((item) => {
            const isActive = selectedForm.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectForm(item)}
                className={`${
                  item.spanFull ? 'col-span-2 text-center' : 'text-left'
                } px-2 py-2 border-4 border-light-outline rounded arcade-shadow-sm font-label text-label-sm transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </section>

        {/* Link to Other Evolution Lines */}
        <button
          type="button"
          onClick={() => navigate('lineas')}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-light-secondary text-light-on-secondary border-4 border-light-outline rounded arcade-shadow-sm font-label text-label-sm uppercase cursor-pointer"
        >
          <span className="material-symbols-outlined text-base" aria-hidden="true">
            account_tree
          </span>
          <span>Ver otras líneas (Gabumon, Palmon y más)</span>
        </button>
      </main>
    </ArcadeShell>
  );
};
