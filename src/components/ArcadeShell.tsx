import React from 'react';
import { ScreenId, useGame } from '../state/GameContext';

interface ArcadeShellProps {
  badgeText: string;
  backTo?: ScreenId;
  backLabel?: string;
  showTopNav?: boolean;
  activeNav?: ScreenId;
  footerText?: string;
  customFooter?: React.ReactNode;
  children: React.ReactNode;
}

const TOP_NAV_ITEMS: { id: ScreenId; icon: string; label: string }[] = [
  { id: 'inicio', icon: 'home', label: 'Inicio' },
  { id: 'jugar', icon: 'play_arrow', label: 'Jugar' },
  { id: 'batalla', icon: 'swords', label: 'Batalla' },
  { id: 'companeros', icon: 'groups', label: 'Compañeros' },
  { id: 'inventario', icon: 'backpack', label: 'Inventario' },
  { id: 'villanos', icon: 'skull', label: 'Villanos' },
];

export const ArcadeShell: React.FC<ArcadeShellProps> = ({
  badgeText,
  backTo,
  backLabel = 'Volver',
  showTopNav = false,
  activeNav,
  footerText,
  customFooter,
  children,
}) => {
  const { navigate, muted, toggleMuted } = useGame();

  return (
    <div className="min-h-screen w-full max-w-md mx-auto px-6 py-4 flex flex-col justify-between gap-4">
      {/* Top contextual header */}
      <header className="flex items-center justify-between gap-2">
        {backTo ? (
          <button
            type="button"
            onClick={() => navigate(backTo)}
            aria-label={backLabel}
            className="inline-flex items-center justify-center w-11 h-11 bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-light-surface-container border-2 border-light-outline rounded-sm">
            <span className="font-mono text-mono-md text-light-on-surface tabular-nums">VER 1.0</span>
          </div>
        )}

        {backTo && (
          <div className="inline-flex items-center gap-1 px-4 py-1 bg-light-surface-container border-4 border-light-outline rounded arcade-shadow-sm">
            <span className="font-mono text-mono-md text-light-on-surface tabular-nums uppercase whitespace-nowrap">
              {badgeText}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? 'Activar sonido' : 'Alternar sonido'}
          className="inline-flex items-center justify-center w-11 h-11 bg-light-surface-container text-light-on-surface border-4 border-light-outline rounded arcade-shadow-sm transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
        >
          <span className="material-symbols-outlined">{muted ? 'volume_off' : 'volume_up'}</span>
        </button>
      </header>

      {/* Top 6-Icon Menu */}
      {showTopNav && (
        <nav aria-label="Menú principal" className="grid grid-cols-6 gap-1">
          {TOP_NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                aria-label={item.label}
                title={item.label}
                className={`inline-flex items-center justify-center h-10 border-2 border-light-outline rounded arcade-shadow-sm transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Main Content */}
      {children}

      {/* Footer */}
      {customFooter
        ? customFooter
        : footerText !== undefined && (
            <footer
              aria-live="polite"
              className="bg-light-surface-container border-4 border-light-outline rounded arcade-shadow-sm px-4 py-2"
            >
              <p className="font-body text-body-md text-light-on-surface text-pretty">
                {footerText}
              </p>
            </footer>
          )}
    </div>
  );
};
