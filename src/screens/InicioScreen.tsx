import React, { useState } from 'react';
import { ArcadeShell } from '../components/ArcadeShell';
import { DigimonImage } from '../components/DigimonImage';
import { IMAGES } from '../data/digimonData';
import { useGame } from '../state/GameContext';

export const InicioScreen: React.FC = () => {
  const { username, login, navigate } = useGame();
  const [userInput, setUserInput] = useState(username === 'Tai_01' ? '' : username);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('INGRESA USUARIO Y CONTRASEÑA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUser = userInput.trim();
    const trimmedPass = passwordInput.trim();
    if (!trimmedUser || !trimmedPass) {
      setStatus('COMPLETA USUARIO Y CONTRASEÑA');
      return;
    }
    login(trimmedUser);
    setStatus(`BIENVENIDO, ${trimmedUser.toUpperCase()}!`);
    window.setTimeout(() => {
      navigate('jugar');
    }, 400);
  };

  return (
    <ArcadeShell badgeText="VER 1.0" showTopNav activeNav="inicio">
      {/* Center hero: Title + Tai & Agumon */}
      <main className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-light-on-surface arcade-title-shadow tracking-wider text-balance">
            DIG.MON
          </h1>
          <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
            Aventura Arcade · Tai &amp; Agumon
          </p>
        </div>

        {/* Center image frame */}
        <figure className="w-full max-w-xs bg-light-surface-container border-4 border-light-outline rounded arcade-shadow-lg p-2">
          <div className="overflow-hidden rounded-sm border-2 border-light-outline bg-light-surface">
            <DigimonImage
              src={IMAGES.taiAgumonHero}
              alt="Tai y Agumon listos para la aventura en DIG.MON"
              className="w-full aspect-square max-h-56 object-cover block"
              fallbackLabel="TAI & AGUMON"
            />
          </div>
          <figcaption className="pt-1 flex items-center justify-between px-1">
            <span className="font-label text-label-sm text-light-on-surface uppercase">
              TAI &amp; AGUMON
            </span>
            <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums">
              NV. 01
            </span>
          </figcaption>
        </figure>
      </main>

      {/* Login Form + Primary Action */}
      <footer className="flex flex-col items-center gap-2 pb-1 w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-2" noValidate>
          <div className="flex flex-col gap-1 text-left">
            <label
              htmlFor="username"
              className="font-label text-label-sm text-light-on-surface uppercase"
            >
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Tai_01"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-4 py-2 bg-light-surface-container text-light-on-surface placeholder:text-light-on-surface-variant border-4 border-light-outline rounded font-body text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label
              htmlFor="password"
              className="font-label text-label-sm text-light-on-surface uppercase"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-light-surface-container text-light-on-surface placeholder:text-light-on-surface-variant border-4 border-light-outline rounded font-body text-body-md focus:outline-none focus:ring-2 focus:ring-light-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-2 inline-flex items-center justify-center w-8 h-8 text-light-on-surface-variant hover:text-light-on-surface focus-visible:outline-none cursor-pointer"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-light-primary text-light-on-primary border-4 border-light-outline rounded arcade-shadow-lg font-headline text-label-lg uppercase tracking-wider transition-transform duration-75 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-light-outline cursor-pointer"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              login
            </span>
            <span>ENTRAR</span>
          </button>
        </form>

        <p
          aria-live="polite"
          className="font-mono text-mono-md text-light-on-surface-variant text-center min-h-5"
        >
          {status}
        </p>
      </footer>
    </ArcadeShell>
  );
};
