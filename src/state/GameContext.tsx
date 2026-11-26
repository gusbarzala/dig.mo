import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PARTNERS,
  VILLAINS,
  INVENTORY_ITEMS,
  CRESTS,
  IMAGES,
  PartnerData,
  VillainData,
  CrestItem,
} from '../data/digimonData';
import { playSfx } from '../utils/sound';

export type ScreenId =
  | 'inicio'
  | 'jugar'
  | 'batalla'
  | 'companeros'
  | 'inventario'
  | 'villanos'
  | 'digevol'
  | 'lineas'
  | 'atacar'
  | 'escudo'
  | 'especial'
  | 'villano-control';

export type GameMode = 'Historia' | 'Arcade' | 'Jefe';

export interface SwapPair {
  leftPartnerId: string;
  rightPartnerId: string;
}

export interface BattleState {
  enemyId: string;
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  playerEp: number;
  playerEpMax: number;
  turn: number;
  log: string;
  activeCrestId: string | null;
  shieldPoints: number;
  wins: number;
}

interface GameContextValue {
  screen: ScreenId;
  navigate: (to: ScreenId) => void;
  muted: boolean;
  toggleMuted: () => void;
  username: string;
  loggedIn: boolean;
  login: (username: string) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  activePartnerId: string;
  setActivePartnerId: (id: string) => void;
  partnerStages: Record<string, number>;
  setPartnerStage: (partnerId: string, stage: number, customForm?: { name: string; img: string; attack: string }) => void;
  customForms: Record<string, { name: string; img: string; attack: string; stageLabel?: string }>;
  getPartnerDisplay: (partnerId: string) => {
    partner: PartnerData;
    stage: number;
    formName: string;
    img: string;
    attack: string;
    powerBonus: number;
  };
  battle: BattleState;
  startBattleMode: () => void;
  challengeVillain: (villainId: string) => void;
  performAttack: (baseDmg: number, epCost: number, moveName: string, attackerName?: string) => string;
  resetBattleRound: () => void;
  activateCrest: (crest: CrestItem) => string;
  swapPairs: SwapPair[];
  swapPartnerPair: (pairIdx: number) => { leftName: string; rightName: string };
  itemQuantities: Record<string, number>;
  equippedItems: Record<string, boolean>;
  useItem: (itemId: string) => string;
  toggleEquipItem: (itemId: string) => string;
  selectedLineKey: string;
  setSelectedLineKey: (key: string) => void;
  selectedVillainControlId: string;
  setSelectedVillainControlId: (id: string) => void;
  villainMonsterStates: Record<string, ('activo' | 'eliminado' | 'congelado')[]>;
  applyVillainPower: (power: 'eliminar' | 'restaurar' | 'pausar') => string;
}

const DEFAULT_PARTNER_STAGES: Record<string, number> = {
  tai: 1,
  matt: 1,
  sora: 1,
  izzy: 1,
  mimi: 1,
  joe: 1,
  tk: 1,
  kari: 1,
};

const DEFAULT_SWAP_PAIRS: SwapPair[] = [
  { leftPartnerId: 'tai', rightPartnerId: 'mimi' },
  { leftPartnerId: 'matt', rightPartnerId: 'sora' },
  { leftPartnerId: 'izzy', rightPartnerId: 'joe' },
  { leftPartnerId: 'tk', rightPartnerId: 'kari' },
];

const DEFAULT_QUANTITIES: Record<string, number> = INVENTORY_ITEMS.reduce(
  (acc, item) => ({ ...acc, [item.id]: item.initialQty }),
  {}
);

const DEFAULT_BATTLE: BattleState = {
  enemyId: 'devimon',
  enemyHp: 120,
  enemyMaxHp: 120,
  playerHp: 95,
  playerMaxHp: 100,
  playerEp: 40,
  playerEpMax: 50,
  turn: 1,
  log: '¡Gabumon está listo! Elige tu próximo movimiento.',
  activeCrestId: null,
  shieldPoints: 0,
  wins: 0,
};

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenId>('inicio');
  const [muted, setMuted] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('Tai_01');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [gameMode, setGameModeState] = useState<GameMode>('Historia');
  const [activePartnerId, setActivePartnerIdState] = useState<string>('matt');
  const [partnerStages, setPartnerStages] = useState<Record<string, number>>(DEFAULT_PARTNER_STAGES);
  const [customForms, setCustomForms] = useState<
    Record<string, { name: string; img: string; attack: string; stageLabel?: string }>
  >({});
  const [battle, setBattle] = useState<BattleState>(DEFAULT_BATTLE);
  const [swapPairs, setSwapPairs] = useState<SwapPair[]>(DEFAULT_SWAP_PAIRS);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(DEFAULT_QUANTITIES);
  const [equippedItems, setEquippedItems] = useState<Record<string, boolean>>({});
  const [selectedLineKey, setSelectedLineKey] = useState<string>('gabumon');
  const [selectedVillainControlId, setSelectedVillainControlId] = useState<string>('myotismon');
  const [villainMonsterStates, setVillainMonsterStates] = useState<
    Record<string, ('activo' | 'eliminado' | 'congelado')[]>
  >({
    devimon: ['activo', 'activo', 'activo'],
    etemon: ['activo', 'activo', 'activo'],
    myotismon: ['activo', 'activo', 'activo'],
    amos_oscuros: ['activo', 'activo', 'activo'],
    apocalymon: ['activo', 'activo', 'activo'],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('digmon_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.username) setUsername(parsed.username);
        if (typeof parsed.muted === 'boolean') setMuted(parsed.muted);
        if (parsed.gameMode) setGameModeState(parsed.gameMode);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('digmon_save_v1', JSON.stringify({ username, muted, gameMode }));
    } catch {
      // ignore storage errors
    }
  }, [username, muted, gameMode]);

  const navigate = useCallback(
    (to: ScreenId) => {
      playSfx('click', muted);
      setScreen(to);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    },
    [muted]
  );

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (!next) playSfx('click', false);
      return next;
    });
  }, []);

  const login = useCallback(
    (name: string) => {
      setUsername(name);
      setLoggedIn(true);
      playSfx('evolve', muted);
    },
    [muted]
  );

  const setGameMode = useCallback(
    (mode: GameMode) => {
      playSfx('click', muted);
      setGameModeState(mode);
    },
    [muted]
  );

  const getPartnerDisplay = useCallback(
    (partnerId: string) => {
      const partner = PARTNERS.find((p) => p.id === partnerId) || PARTNERS[0];
      const stage = partnerStages[partner.id] || 1;
      const evo = partner.evolutions.find((e) => e.stage === stage) || partner.evolutions[0];
      const custom = customForms[partner.id];
      return {
        partner,
        stage,
        formName: custom ? custom.name : evo.form,
        img: custom ? custom.img : evo.img,
        attack: custom ? custom.attack : evo.attack,
        powerBonus: evo.powerBonus,
      };
    },
    [partnerStages, customForms]
  );

  const setActivePartnerId = useCallback(
    (id: string) => {
      setActivePartnerIdState(id);
      const partner = PARTNERS.find((p) => p.id === id);
      if (partner) {
        setBattle((prev) => ({
          ...prev,
          playerMaxHp: partner.maxHp,
          playerHp: Math.min(prev.playerHp, partner.maxHp),
          playerEpMax: partner.maxEp,
          playerEp: Math.min(prev.playerEp, partner.maxEp),
          log: `¡${partner.baseName} (Niño: ${partner.tamer}) entró al combate!`,
        }));
      }
    },
    []
  );

  const setPartnerStage = useCallback(
    (partnerId: string, stage: number, customForm?: { name: string; img: string; attack: string }) => {
      playSfx('evolve', muted);
      setPartnerStages((prev) => ({ ...prev, [partnerId]: stage }));
      if (customForm) {
        setCustomForms((prev) => ({ ...prev, [partnerId]: customForm }));
      } else {
        setCustomForms((prev) => {
          const next = { ...prev };
          delete next[partnerId];
          return next;
        });
      }
      if (partnerId === activePartnerId) {
        const partner = PARTNERS.find((p) => p.id === partnerId) || PARTNERS[0];
        const evo = partner.evolutions.find((e) => e.stage === stage) || partner.evolutions[0];
        const name = customForm ? customForm.name : evo.form;
        setBattle((prev) => ({
          ...prev,
          log: `¡Digievolución lista! ${name} está listo para luchar.`,
        }));
      }
    },
    [muted, activePartnerId]
  );

  const challengeVillain = useCallback(
    (villainId: string) => {
      const villain = VILLAINS.find((v) => v.id === villainId) || VILLAINS[0];
      playSfx('villain', muted);
      const active = getPartnerDisplay(activePartnerId);
      setBattle((prev) => ({
        ...prev,
        enemyId: villain.id,
        enemyHp: villain.maxHp,
        enemyMaxHp: villain.maxHp,
        playerHp: active.partner.maxHp,
        playerMaxHp: active.partner.maxHp,
        playerEp: active.partner.maxEp,
        playerEpMax: active.partner.maxEp,
        turn: 1,
        shieldPoints: 0,
        activeCrestId: null,
        log: `¡Desafiando a ${villain.name}! ${active.formName} listo para combatir.`,
      }));
      setScreen('batalla');
    },
    [muted, activePartnerId, getPartnerDisplay]
  );

  const startBattleMode = useCallback(() => {
    const targetVillainId =
      gameMode === 'Jefe' ? 'apocalymon' : gameMode === 'Arcade' ? 'etemon' : 'devimon';
    challengeVillain(targetVillainId);
  }, [gameMode, challengeVillain]);

  const resetBattleRound = useCallback(() => {
    playSfx('click', muted);
    const villain = VILLAINS.find((v) => v.id === battle.enemyId) || VILLAINS[0];
    const active = getPartnerDisplay(activePartnerId);
    setBattle((prev) => ({
      ...prev,
      enemyHp: villain.maxHp,
      enemyMaxHp: villain.maxHp,
      playerHp: active.partner.maxHp,
      playerMaxHp: active.partner.maxHp,
      playerEp: active.partner.maxEp,
      playerEpMax: active.partner.maxEp,
      turn: 1,
      shieldPoints: 0,
      log: `¡Nueva ronda! ${villain.name} regresa al combate.`,
    }));
  }, [muted, battle.enemyId, activePartnerId, getPartnerDisplay]);

  const performAttack = useCallback(
    (baseDmg: number, epCost: number, moveName: string, attackerName?: string): string => {
      const villain: VillainData = VILLAINS.find((v) => v.id === battle.enemyId) || VILLAINS[0];
      const active = getPartnerDisplay(activePartnerId);
      const heroName = attackerName || active.formName;

      if (battle.enemyHp <= 0) {
        const msg = `¡${villain.name} ya fue derrotado! Inicia una nueva ronda.`;
        setBattle((prev) => ({ ...prev, log: msg }));
        return msg;
      }

      if (battle.playerEp < epCost) {
        playSfx('click', muted);
        const msg = '¡Sin energía suficiente! Usa Escudo o Carga Digivice.';
        setBattle((prev) => ({ ...prev, log: msg }));
        return msg;
      }

      const gearBonus =
        (equippedItems['power_chip'] ? 15 : 0) + (equippedItems['friendship_crest'] ? 10 : 0);
      const totalDmg = baseDmg + gearBonus;
      const newEnemyHp = Math.max(0, battle.enemyHp - totalDmg);
      const newEp = Math.max(0, battle.playerEp - epCost);

      if (newEnemyHp === 0) {
        playSfx('victory', muted);
        const msg = `¡Victoria! ${heroName} usó ${moveName} (${totalDmg} daño) y derrotó a ${villain.name}.`;
        setBattle((prev) => ({
          ...prev,
          enemyHp: 0,
          playerEp: newEp,
          turn: prev.turn + 1,
          wins: prev.wins + 1,
          log: msg,
        }));
        return msg;
      }

      playSfx('attack', muted);
      // Enemy counterattack mitigated by active shield
      const rawCounter = villain.atk;
      const absorbed = Math.min(battle.shieldPoints, rawCounter);
      const actualCounter = Math.max(4, rawCounter - absorbed);
      const remainingShield = Math.max(0, battle.shieldPoints - absorbed);
      const newPlayerHp = Math.max(1, battle.playerHp - actualCounter);

      const shieldNote = absorbed > 0 ? ` (Escudo bloqueó ${absorbed})` : '';
      const msg = `¡${heroName} lanzó ${moveName} e hizo ${totalDmg} de daño! ${villain.name} contraatacó (-${actualCounter} PS)${shieldNote}.`;

      setBattle((prev) => ({
        ...prev,
        enemyHp: newEnemyHp,
        playerHp: newPlayerHp,
        playerEp: newEp,
        shieldPoints: remainingShield,
        turn: prev.turn + 1,
        log: msg,
      }));
      return msg;
    },
    [battle, activePartnerId, getPartnerDisplay, equippedItems, muted]
  );

  const activateCrest = useCallback(
    (crest: CrestItem): string => {
      playSfx('shield', muted);
      const msg = `¡Joya de ${crest.crest} (${crest.child}) activada! ${crest.boost}.`;
      setBattle((prev) => ({
        ...prev,
        activeCrestId: crest.id,
        shieldPoints: prev.shieldPoints + crest.defBonus,
        playerHp: Math.min(prev.playerMaxHp, prev.playerHp + crest.healHp),
        playerEp: Math.min(prev.playerEpMax, prev.playerEp + crest.healEp),
        log: msg,
      }));
      return msg;
    },
    [muted]
  );

  const swapPartnerPair = useCallback(
    (pairIdx: number): { leftName: string; rightName: string } => {
      playSfx('click', muted);
      const pair = swapPairs[pairIdx];
      if (!pair) return { leftName: '', rightName: '' };

      const leftInfo = getPartnerDisplay(pair.leftPartnerId);
      const rightInfo = getPartnerDisplay(pair.rightPartnerId);

      setSwapPairs((prev) =>
        prev.map((p, i) =>
          i === pairIdx
            ? { leftPartnerId: p.rightPartnerId, rightPartnerId: p.leftPartnerId }
            : p
        )
      );

      // If one of them is currently active in battle, swap to the incoming partner
      if (activePartnerId === pair.leftPartnerId) {
        setActivePartnerIdState(pair.rightPartnerId);
        setBattle((prev) => ({
          ...prev,
          log: `¡Reemplazo en batalla! ${rightInfo.formName} relevó a ${leftInfo.formName}.`,
        }));
      } else if (activePartnerId === pair.rightPartnerId) {
        setActivePartnerIdState(pair.leftPartnerId);
        setBattle((prev) => ({
          ...prev,
          log: `¡Reemplazo en batalla! ${leftInfo.formName} relevó a ${rightInfo.formName}.`,
        }));
      }

      return { leftName: rightInfo.formName, rightName: leftInfo.formName };
    },
    [muted, swapPairs, getPartnerDisplay, activePartnerId]
  );

  const useItem = useCallback(
    (itemId: string): string => {
      const def = INVENTORY_ITEMS.find((i) => i.id === itemId);
      if (!def) return '';
      const qty = itemQuantities[itemId] ?? 0;
      if (qty <= 0) {
        playSfx('click', muted);
        return `No te quedan unidades de ${def.name}.`;
      }
      playSfx('heal', muted);
      setItemQuantities((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] ?? 0) - 1) }));
      setBattle((prev) => ({
        ...prev,
        playerHp: itemId === 'heal_disc' ? Math.min(prev.playerMaxHp, prev.playerHp + 40) : prev.playerHp,
        playerEp: itemId === 'digivice_charge' ? Math.min(prev.playerEpMax, prev.playerEp + 25) : prev.playerEp,
        log: `${def.name}: ${def.effectText}.`,
      }));
      return `${def.name}: ${def.effectText}.`;
    },
    [itemQuantities, muted]
  );

  const toggleEquipItem = useCallback(
    (itemId: string): string => {
      const def = INVENTORY_ITEMS.find((i) => i.id === itemId);
      if (!def) return '';
      playSfx('click', muted);
      const currentlyEquipped = !!equippedItems[itemId];
      setEquippedItems((prev) => ({ ...prev, [itemId]: !currentlyEquipped }));
      const msg = currentlyEquipped
        ? `${def.name} guardado en mochila.`
        : `${def.name}: ${def.effectText}.`;
      setBattle((prev) => ({ ...prev, log: msg }));
      return msg;
    },
    [equippedItems, muted]
  );

  const applyVillainPower = useCallback(
    (power: 'eliminar' | 'restaurar' | 'pausar'): string => {
      const villain = VILLAINS.find((v) => v.id === selectedVillainControlId) || VILLAINS[2];
      const targetNames = villain.targets.map((t) => t.name);

      if (power === 'eliminar') {
        playSfx('villain', muted);
        setVillainMonsterStates((prev) => ({
          ...prev,
          [villain.id]: ['eliminado', 'eliminado', prev[villain.id]?.[2] || 'activo'],
        }));
        return `¡${villain.name} usó ELIMINAR contra ${targetNames[0]} y ${targetNames[1]}!`;
      }
      if (power === 'restaurar') {
        playSfx('heal', muted);
        setVillainMonsterStates((prev) => ({
          ...prev,
          [villain.id]: ['activo', 'activo', 'activo'],
        }));
        return '¡Mujer Murciélago (LadyDevimon) restauró a todos los monstruos!';
      }
      playSfx('shield', muted);
      setVillainMonsterStates((prev) => {
        const curr = prev[villain.id] || ['activo', 'activo', 'activo'];
        return {
          ...prev,
          [villain.id]: curr.map((st) => (st === 'eliminado' ? 'eliminado' : 'congelado')),
        };
      });
      return '¡Monstruos digitales congelados y pausados!';
    },
    [selectedVillainControlId, muted]
  );

  // Also keep CRESTS referenced to avoid unused import warnings if any
  void CRESTS;
  void IMAGES;

  return (
    <GameContext.Provider
      value={{
        screen,
        navigate,
        muted,
        toggleMuted,
        username,
        loggedIn,
        login,
        gameMode,
        setGameMode,
        activePartnerId,
        setActivePartnerId,
        partnerStages,
        setPartnerStage,
        customForms,
        getPartnerDisplay,
        battle,
        startBattleMode,
        challengeVillain,
        performAttack,
        resetBattleRound,
        activateCrest,
        swapPairs,
        swapPartnerPair,
        itemQuantities,
        equippedItems,
        useItem,
        toggleEquipItem,
        selectedLineKey,
        setSelectedLineKey,
        selectedVillainControlId,
        setSelectedVillainControlId,
        villainMonsterStates,
        applyVillainPower,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}
