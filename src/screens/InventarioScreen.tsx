import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { INVENTORY_ITEMS } from '../data/digimonData';
import { useGame } from '../state/GameContext';

type FilterCategory = 'all' | 'heal' | 'gear';

export const InventarioScreen: React.FC = () => {
  const {
    itemQuantities,
    equippedItems,
    useItem,
    toggleEquipItem,
    activePartnerId,
    getPartnerDisplay,
  } = useGame();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [status, setStatus] = useState('Toca un objeto para usarlo o equiparlo.');

  const activeInfo = getPartnerDisplay(activePartnerId);
  const totalItems = Object.values(itemQuantities).reduce((sum, q) => sum + q, 0);

  const visibleItems = INVENTORY_ITEMS.filter(
    (item) => filter === 'all' || item.category === filter
  );

  const handleUse = (id: string) => {
    const msg = useItem(id);
    if (msg) setStatus(msg);
  };

  const handleEquip = (id: string) => {
    const msg = toggleEquipItem(id);
    if (msg) setStatus(msg);
  };

  return (
    <ArcadeShell
      badgeText={`MOCHILA · ${totalItems}/20`}
      backTo="batalla"
      backLabel="Volver a batalla"
      showTopNav
      activeNav="inventario"
      footerText={status}
    >
      <main className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline text-headline-lg-mobile text-light-on-surface uppercase">
            OBJETOS
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant">
            Equipa o usa objetos para ayudar a {activeInfo.formName}.
          </p>
        </div>

        {/* Category Filter Row */}
        <nav aria-label="Categorías de objetos" className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'all', label: 'TODOS' },
              { id: 'heal', label: 'CURA' },
              { id: 'gear', label: 'EQUIPO' },
            ] as const
          ).map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-2 py-2 border-4 border-light-outline rounded arcade-shadow-sm font-label text-label-sm uppercase text-center transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Inventory Item Cards */}
        <section className="flex flex-col gap-2">
          {visibleItems.map((item) => {
            const qty = itemQuantities[item.id] ?? 0;
            const isEquipped = !!equippedItems[item.id];
            const isOut = item.actionType === 'use' && qty <= 0;

            return (
              <article
                key={item.id}
                className="bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 shrink-0 flex items-center justify-center ${item.iconBgClass} border-2 border-light-outline rounded-sm`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-title text-title-md text-light-on-surface truncate">
                        {item.name}
                      </h2>
                      <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums">
                        x{qty}
                      </span>
                    </div>
                    <p className="font-body text-body-md text-light-on-surface-variant">
                      {item.id === 'heal_disc'
                        ? `+40 PS para ${activeInfo.formName}`
                        : item.description}
                    </p>
                  </div>
                </div>

                {item.actionType === 'use' ? (
                  <button
                    type="button"
                    disabled={isOut}
                    onClick={() => handleUse(item.id)}
                    className={`shrink-0 px-4 py-2 bg-light-primary text-light-on-primary border-2 border-light-outline rounded font-label text-label-sm uppercase transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 ${
                      isOut ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <span>USAR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEquip(item.id)}
                    className={`shrink-0 px-4 py-2 border-2 border-light-outline rounded font-label text-label-sm uppercase transition-transform duration-75 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                      isEquipped
                        ? 'bg-light-primary text-light-on-primary'
                        : 'bg-light-secondary text-light-on-secondary'
                    }`}
                  >
                    <span>{isEquipped ? 'LISTO' : 'EQUIPAR'}</span>
                  </button>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </ArcadeShell>
  );
};
