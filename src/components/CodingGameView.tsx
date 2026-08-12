import React, { useState, useEffect, useRef } from 'react';
import {
  GAME_LEVELS,
  GAME_BADGES,
  MOCK_LEADERBOARD,
  GameLevel,
  BlockInstance,
  BadgeItem,
} from '../data/gameLevelsData';
import { MascotAvatar } from './MascotAvatar';
import { ConfettiCanvas } from './ConfettiCanvas';
import { soundManager } from '../utils/audioUtils';
import { GameProgress, UserProfile } from '../types';

interface CodingGameViewProps {
  gameProgress?: GameProgress;
  onSaveProgress: (updated: Partial<GameProgress>) => void;
  currentUserUid: string | null;
  profile: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

export const CodingGameView: React.FC<CodingGameViewProps> = ({
  gameProgress,
  onSaveProgress,
  currentUserUid,
  profile,
  onNavigateTab,
}) => {
  // Game State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const currentLevel: GameLevel =
    GAME_LEVELS.find((l) => l.id === currentLevelId) || GAME_LEVELS[0];

  // User Local Progress State
  const [completedLevels, setCompletedLevels] = useState<number[]>(
    gameProgress?.completedLevels || []
  );
  const [levelStars, setLevelStars] = useState<Record<number, number>>(
    gameProgress?.levelStars || {}
  );
  const [totalXP, setTotalXP] = useState<number>(gameProgress?.totalXP || 0);
  const [streak, setStreak] = useState<number>(gameProgress?.streak || 1);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(
    gameProgress?.unlockedBadges || ['code_novice']
  );

  // Sync props if changed
  useEffect(() => {
    if (gameProgress) {
      if (gameProgress.completedLevels) setCompletedLevels(gameProgress.completedLevels);
      if (gameProgress.levelStars) setLevelStars(gameProgress.levelStars);
      if (gameProgress.totalXP) setTotalXP(gameProgress.totalXP);
      if (gameProgress.streak) setStreak(gameProgress.streak);
      if (gameProgress.unlockedBadges) setUnlockedBadges(gameProgress.unlockedBadges);
    }
  }, [gameProgress]);

  // Board Runtime State
  const [mascotPos, setMascotPos] = useState<{ x: number; y: number }>(
    currentLevel.startPos
  );
  const [mascotDir, setMascotDir] = useState<'up' | 'right' | 'down' | 'left'>(
    currentLevel.startDir
  );
  const [mascotMood, setMascotMood] = useState<'idle' | 'moving' | 'happy' | 'oops'>('idle');
  const [collectedGems, setCollectedGems] = useState<{ x: number; y: number }[]>([]);

  // Workspace Blocks State
  const [workspaceBlocks, setWorkspaceBlocks] = useState<BlockInstance[]>([]);
  const [activeLoopCount, setActiveLoopCount] = useState<number>(3);
  const [targetContainerId, setTargetContainerId] = useState<string | null>(null);

  // Runtime Controls
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [execSpeed, setExecSpeed] = useState<number>(400); // ms per step
  const [statusMessage, setStatusMessage] = useState<string>('Drag or tap blocks to build your algorithm!');
  const [hasError, setHasError] = useState<boolean>(false);

  // Modals & UI Controls
  const [showLevelMap, setShowLevelMap] = useState<boolean>(false);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [earnedStarsCurrentLevel, setEarnedStarsCurrentLevel] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getIsMuted());

  // Reset Level Environment when currentLevelId changes
  useEffect(() => {
    resetLevelState();
  }, [currentLevelId]);

  const resetLevelState = () => {
    setIsRunning(false);
    setActiveBlockId(null);
    setMascotPos(currentLevel.startPos);
    setMascotDir(currentLevel.startDir);
    setMascotMood('idle');
    setCollectedGems([]);
    setHasError(false);
    setStatusMessage('Grid reset! Tap "Run Code" when ready.');
  };

  // Helper: Count total blocks in nested workspace
  const countBlocks = (blocks: BlockInstance[]): number => {
    let count = 0;
    blocks.forEach((b) => {
      count += 1;
      if (b.children) {
        count += countBlocks(b.children);
      }
    });
    return count;
  };

  const totalWorkspaceBlocks = countBlocks(workspaceBlocks);

  // Block Manipulation Handlers
  const handleAddBlock = (
    type: 'move_forward' | 'turn_left' | 'turn_right' | 'repeat' | 'if_path'
  ) => {
    soundManager.playBlockClick();
    const newBlock: BlockInstance = {
      id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      label:
        type === 'move_forward'
          ? 'Move Forward'
          : type === 'turn_left'
          ? 'Turn Left ↺'
          : type === 'turn_right'
          ? 'Turn Right ↻'
          : type === 'repeat'
          ? `Repeat ${activeLoopCount} Times`
          : 'If Path Ahead',
      count: type === 'repeat' ? activeLoopCount : undefined,
      children: type === 'repeat' || type === 'if_path' ? [] : undefined,
    };

    if (targetContainerId) {
      // Append inside specified loop/if container
      setWorkspaceBlocks((prev) => addBlockToContainer(prev, targetContainerId, newBlock));
    } else {
      setWorkspaceBlocks((prev) => [...prev, newBlock]);
    }
  };

  const addBlockToContainer = (
    list: BlockInstance[],
    containerId: string,
    newBlock: BlockInstance
  ): BlockInstance[] => {
    return list.map((item) => {
      if (item.id === containerId) {
        return {
          ...item,
          children: [...(item.children || []), newBlock],
        };
      }
      if (item.children) {
        return {
          ...item,
          children: addBlockToContainer(item.children, containerId, newBlock),
        };
      }
      return item;
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    soundManager.playBlockClick();
    setWorkspaceBlocks((prev) => removeBlockRecursive(prev, blockId));
    if (targetContainerId === blockId) {
      setTargetContainerId(null);
    }
  };

  const removeBlockRecursive = (
    list: BlockInstance[],
    blockId: string
  ): BlockInstance[] => {
    return list
      .filter((item) => item.id !== blockId)
      .map((item) => {
        if (item.children) {
          return {
            ...item,
            children: removeBlockRecursive(item.children, blockId),
          };
        }
        return item;
      });
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    soundManager.playBlockClick();
    setWorkspaceBlocks((prev) => moveBlockRecursive(prev, blockId, direction));
  };

  const moveBlockRecursive = (
    list: BlockInstance[],
    blockId: string,
    direction: 'up' | 'down'
  ): BlockInstance[] => {
    const idx = list.findIndex((item) => item.id === blockId);
    if (idx !== -1) {
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx >= 0 && targetIdx < list.length) {
        const copy = [...list];
        const [moved] = copy.splice(idx, 1);
        copy.splice(targetIdx, 0, moved);
        return copy;
      }
      return list;
    }
    return list.map((item) => {
      if (item.children) {
        return {
          ...item,
          children: moveBlockRecursive(item.children, blockId, direction),
        };
      }
      return item;
    });
  };

  const handleUpdateLoopCount = (blockId: string, delta: number) => {
    soundManager.playBlockClick();
    setWorkspaceBlocks((prev) => updateLoopCountRecursive(prev, blockId, delta));
  };

  const updateLoopCountRecursive = (
    list: BlockInstance[],
    blockId: string,
    delta: number
  ): BlockInstance[] => {
    return list.map((item) => {
      if (item.id === blockId && item.type === 'repeat') {
        const newCount = Math.max(2, Math.min(8, (item.count || 3) + delta));
        return {
          ...item,
          count: newCount,
          label: `Repeat ${newCount} Times`,
        };
      }
      if (item.children) {
        return {
          ...item,
          children: updateLoopCountRecursive(item.children, blockId, delta),
        };
      }
      return item;
    });
  };

  // Execution Engine
  const runCode = async () => {
    if (workspaceBlocks.length === 0) {
      setStatusMessage('⚠️ Add at least one block to your workspace first!');
      return;
    }

    resetLevelState();
    setIsRunning(true);
    setMascotMood('moving');
    setStatusMessage('Executing code blocks...');

    let pos = { ...currentLevel.startPos };
    let dir = currentLevel.startDir;
    let gemsCollected = [...collectedGems];
    let isTerminated = false;

    // Helper sleep
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // Turn directions map
    const turnLeftMap: Record<string, 'up' | 'right' | 'down' | 'left'> = {
      up: 'left',
      left: 'down',
      down: 'right',
      right: 'up',
    };

    const turnRightMap: Record<string, 'up' | 'right' | 'down' | 'left'> = {
      up: 'right',
      right: 'down',
      down: 'left',
      left: 'up',
    };

    // Forward vectors
    const forwardVector: Record<string, { dx: number; dy: number }> = {
      up: { dx: 0, dy: -1 },
      right: { dx: 1, dy: 0 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
    };

    // Check if cell ahead is clear (no obstacle and within grid)
    const isPathAheadClear = (currentPos: { x: number; y: number }, currentDir: string) => {
      const vec = forwardVector[currentDir];
      const nextX = currentPos.x + vec.dx;
      const nextY = currentPos.y + vec.dy;

      // Check boundary
      if (
        nextX < 0 ||
        nextX >= currentLevel.gridSize.cols ||
        nextY < 0 ||
        nextY >= currentLevel.gridSize.rows
      ) {
        return false;
      }

      // Check obstacle
      const hitObstacle = currentLevel.obstacles.some(
        (obs) => obs.x === nextX && obs.y === nextY
      );
      return !hitObstacle;
    };

    // Recursive Executor
    const executeBlocksList = async (blocks: BlockInstance[]): Promise<boolean> => {
      for (const block of blocks) {
        if (isTerminated) return false;

        setActiveBlockId(block.id);
        await delay(execSpeed);

        if (block.type === 'move_forward') {
          const vec = forwardVector[dir];
          const nextX = pos.x + vec.dx;
          const nextY = pos.y + vec.dy;

          // Boundary check
          if (
            nextX < 0 ||
            nextX >= currentLevel.gridSize.cols ||
            nextY < 0 ||
            nextY >= currentLevel.gridSize.rows
          ) {
            isTerminated = true;
            setMascotMood('oops');
            setHasError(true);
            soundManager.playErrorSound();
            setStatusMessage('💥 Ouch! Frandy walked off the grid boundary!');
            return false;
          }

          // Obstacle collision check
          const hitObstacle = currentLevel.obstacles.some(
            (obs) => obs.x === nextX && obs.y === nextY
          );
          if (hitObstacle) {
            isTerminated = true;
            setMascotMood('oops');
            setHasError(true);
            soundManager.playErrorSound();
            setStatusMessage('💥 Bump! Frandy hit a wall barrier. Modify your code!');
            return false;
          }

          // Move step successful
          pos = { x: nextX, y: nextY };
          setMascotPos(pos);
          soundManager.playStepSound();

          // Check Energy Gem pickup
          if (currentLevel.gems && currentLevel.gems.length > 0) {
            const hitGem = currentLevel.gems.find(
              (g) => g.x === nextX && g.y === nextY
            );
            if (hitGem && !gemsCollected.some((g) => g.x === nextX && g.y === nextY)) {
              gemsCollected.push(hitGem);
              setCollectedGems([...gemsCollected]);
              soundManager.playGemSound();
            }
          }
        } else if (block.type === 'turn_left') {
          dir = turnLeftMap[dir];
          setMascotDir(dir);
          soundManager.playTurnSound();
        } else if (block.type === 'turn_right') {
          dir = turnRightMap[dir];
          setMascotDir(dir);
          soundManager.playTurnSound();
        } else if (block.type === 'repeat') {
          const loopCount = block.count || 3;
          for (let i = 0; i < loopCount; i++) {
            if (isTerminated) return false;
            if (block.children && block.children.length > 0) {
              const res = await executeBlocksList(block.children);
              if (!res) return false;
            }
          }
        } else if (block.type === 'if_path') {
          const pathClear = isPathAheadClear(pos, dir);
          if (pathClear && block.children && block.children.length > 0) {
            const res = await executeBlocksList(block.children);
            if (!res) return false;
          }
        }
      }
      return true;
    };

    const success = await executeBlocksList(workspaceBlocks);
    setActiveBlockId(null);
    setIsRunning(false);

    if (success && !isTerminated) {
      // Check win condition
      const reachedGoal = pos.x === currentLevel.goalPos.x && pos.y === currentLevel.goalPos.y;
      const totalGemsNeeded = currentLevel.gems?.length || 0;
      const gemsSatisfied = gemsCollected.length >= totalGemsNeeded;

      if (reachedGoal && gemsSatisfied) {
        // WIN LEVEL!
        setMascotMood('happy');
        soundManager.playWinFanfare();

        // Calculate stars
        let stars = 1;
        if (totalWorkspaceBlocks <= currentLevel.optimalBlockCount) {
          stars = 3;
        } else if (totalWorkspaceBlocks <= currentLevel.optimalBlockCount + 3) {
          stars = 2;
        }
        setEarnedStarsCurrentLevel(stars);

        // Update progress
        const newCompleted = Array.from(new Set([...completedLevels, currentLevel.id]));
        const newStars = { ...levelStars, [currentLevel.id]: Math.max(levelStars[currentLevel.id] || 0, stars) };
        const levelXPBonus = stars * 100;
        const newXP = totalXP + levelXPBonus;

        // Check new badges unlocked
        const newBadges = [...unlockedBadges];
        GAME_BADGES.forEach((b) => {
          if (newCompleted.includes(b.requiredLevel) && !newBadges.includes(b.id)) {
            newBadges.push(b.id);
          }
        });

        setCompletedLevels(newCompleted);
        setLevelStars(newStars);
        setTotalXP(newXP);
        setUnlockedBadges(newBadges);

        // Save progress to Firestore or localStorage
        onSaveProgress({
          completedLevels: newCompleted,
          levelStars: newStars,
          totalXP: newXP,
          streak: streak,
          unlockedBadges: newBadges,
        });

        setStatusMessage(`🎉 Victory! Goal reached with ${stars} Stars!`);
        setShowWinModal(true);
      } else if (reachedGoal && !gemsSatisfied) {
        setMascotMood('idle');
        setStatusMessage(`⚠️ Goal reached, but you missed collecting all Energy Gems (${gemsCollected.length}/${totalGemsNeeded})!`);
      } else {
        setMascotMood('idle');
        setStatusMessage('Reached end of code blocks, but didn\'t reach the goal yet. Add more blocks!');
      }
    }
  };

  // Switch sound mute
  const toggleMuteSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Show Confetti on Level Win */}
      {showWinModal && <ConfettiCanvas />}

      {/* HERO HEADLINE BANNER AT THE TOP OF CODE QUEST PAGE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/40 ring-1 ring-white/10 group">
        {/* Background Glowing Ambient Orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-500/30 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        {/* Floating Decorative Coding & Gaming Icons */}
        <div className="absolute top-4 right-6 sm:right-10 opacity-25 group-hover:opacity-50 transition-opacity pointer-events-none animate-bounce-subtle">
          <span className="text-4xl sm:text-5xl">🎮</span>
        </div>
        <div className="absolute bottom-4 right-16 sm:right-28 opacity-25 group-hover:opacity-50 transition-opacity pointer-events-none animate-bounce-subtle" style={{ animationDelay: '1s' }}>
          <span className="text-3xl sm:text-4xl">⚡</span>
        </div>
        <div className="absolute top-10 right-32 opacity-20 pointer-events-none animate-bounce-subtle hidden md:block" style={{ animationDelay: '0.5s' }}>
          <span className="text-2xl font-mono text-cyan-300 font-black">{`{ code }`}</span>
        </div>
        <div className="absolute bottom-6 left-8 opacity-20 pointer-events-none animate-bounce-subtle hidden sm:block" style={{ animationDelay: '1.5s' }}>
          <span className="text-2xl font-mono text-amber-300 font-black">{`</>`}</span>
        </div>

        <div className="relative z-10 max-w-4xl space-y-3">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-900/80 border border-indigo-400/30 text-xs font-extrabold text-amber-300 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="tracking-wide uppercase">Code Quest • Beginner Friendly</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white font-heading">
            Coding ka ABC bhi nahi pata tha? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              Koi tension nahi — yahan khel-khel mein seekhoge!
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-indigo-100 font-medium leading-relaxed max-w-2xl">
            Zero experience? Perfect start. Play, learn, aur dheere-dheere ban jao coding pro.
          </p>

          {/* Quick Features & Play Direct Button */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-extrabold text-indigo-200">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="text-amber-400">🧩</span> Drag & Drop Logic
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="text-emerald-400">🚀</span> 100% Fun Learning
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-indigo-500/30 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="text-purple-400">⭐</span> Earn Stars & XP
            </span>
            <a
              href="#game-area"
              onClick={(e) => {
                e.preventDefault();
                const elem = document.getElementById('game-area');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer transform hover:scale-105 active:scale-95 ml-auto sm:ml-0"
            >
              <span>Play Now</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_downward</span>
            </a>
          </div>
        </div>
      </div>

      {/* HEADER BANNER / GAME METRICS BAR */}
      <div id="game-area" className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-indigo-700/60 relative overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-32 h-32 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">sports_esports</span>
                <span>Visual Coding Game</span>
              </span>
              <span className="text-xs text-indigo-200 font-extrabold bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-700/60">
                Beginner Friendly
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Code Quest: Frandy's Adventure</span>
              <span className="text-amber-300">🚀</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl font-medium">
              Drag-and-drop code blocks to guide Frandy through coding logic mazes! Master sequences, loops, and conditional logic.
            </p>
          </div>

          {/* Metrics Pill Grid */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Stars Count */}
            <div className="bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-500/40 flex items-center gap-2">
              <span className="text-amber-400 text-lg">⭐</span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-black">Stars</div>
                <div className="text-xs font-black text-amber-300">
                  {Object.values(levelStars).reduce((a, b) => a + b, 0)} / 30
                </div>
              </div>
            </div>

            {/* Total XP */}
            <div className="bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-500/40 flex items-center gap-2">
              <span className="text-purple-400 text-lg">⚡</span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-black">XP Score</div>
                <div className="text-xs font-black text-purple-300">{totalXP} XP</div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-slate-950/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-indigo-500/40 flex items-center gap-2">
              <span className="text-rose-400 text-lg">🔥</span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-black">Streak</div>
                <div className="text-xs font-black text-rose-300">{streak} Levels</div>
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleMuteSound}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-indigo-600/80 border-indigo-400 text-amber-300 hover:bg-indigo-500'
              }`}
              title={isMuted ? 'Unmute Audio Effects' : 'Mute Sound Effects'}
            >
              <span className="material-symbols-outlined text-lg">
                {isMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>

            {/* Level Selector Button */}
            <button
              onClick={() => setShowLevelMap(true)}
              className="btn-3d btn-3d-amber px-3.5 py-2 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Levels Map ({currentLevel.id}/10)</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK LEVEL NAVIGATION BAR */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {GAME_LEVELS.map((lvl) => {
            const isCompleted = completedLevels.includes(lvl.id);
            const isCurrent = lvl.id === currentLevel.id;
            const stars = levelStars[lvl.id] || 0;

            return (
              <button
                key={lvl.id}
                onClick={() => setCurrentLevelId(lvl.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-105'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span>Lvl {lvl.id}</span>
                {stars > 0 && <span className="text-[10px] text-amber-400">{'★'.repeat(stars)}</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setShowBadgesModal(true)}
            className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-amber-500 text-sm">military_tech</span>
            <span>Badges ({unlockedBadges.length}/{GAME_BADGES.length})</span>
          </button>

          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-xs font-bold hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-indigo-500 text-sm">leaderboard</span>
            <span>Leaderboard</span>
          </button>
        </div>
      </div>

      {/* CURRENT LEVEL CARD & GOAL DESCRIPTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold uppercase">
              {currentLevel.subtitle}
            </span>
            <span className="text-xs font-bold text-slate-500">
              Optimal Blocks: <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentLevel.optimalBlockCount}</strong>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentLevel.title}: <span className="text-indigo-600 dark:text-indigo-400">{currentLevel.conceptTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium leading-relaxed max-w-3xl">
            {currentLevel.conceptDescription}
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 max-w-xs w-full">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            <span>Level Hint</span>
          </div>
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mt-0.5 leading-snug">
            {currentLevel.hint}
          </p>
        </div>
      </div>

      {/* MAIN GAME LAYOUT: GRID CANVAS (LEFT) + TOOLBOX & WORKSPACE (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* GAME MAZE GRID BOARD (5 COLS ON LG) */}
        <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          {/* Status Bar */}
          <div
            className={`w-full p-2.5 rounded-2xl mb-4 text-xs font-extrabold text-center transition-all flex items-center justify-center gap-2 ${
              hasError
                ? 'bg-rose-950/90 text-rose-300 border border-rose-800 animate-shake'
                : isRunning
                ? 'bg-amber-950/90 text-amber-300 border border-amber-800'
                : 'bg-slate-900 text-indigo-300 border border-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {hasError ? 'error' : isRunning ? 'autorenew' : 'info'}
            </span>
            <span>{statusMessage}</span>
          </div>

          {/* Grid Canvas Wrapper */}
          <div className="relative w-full max-w-[360px] aspect-square bg-slate-900/90 rounded-2xl border-2 border-slate-800/80 p-2 shadow-inner flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div
              className="w-full h-full grid gap-1.5 relative"
              style={{
                gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${currentLevel.gridSize.rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: currentLevel.gridSize.rows }).map((_, r) =>
                Array.from({ length: currentLevel.gridSize.cols }).map((_, c) => {
                  const isObstacle = currentLevel.obstacles.some(
                    (obs) => obs.x === c && obs.y === r
                  );
                  const isGoal = currentLevel.goalPos.x === c && currentLevel.goalPos.y === r;
                  const isGem = currentLevel.gems?.some(
                    (g) => g.x === c && g.y === r && !collectedGems.some((cg) => cg.x === c && cg.y === r)
                  );
                  const isStart = currentLevel.startPos.x === c && currentLevel.startPos.y === r;

                  return (
                    <div
                      key={`cell_${r}_${c}`}
                      className={`relative rounded-xl flex items-center justify-center transition-all ${
                        isObstacle
                          ? 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 shadow-md'
                          : 'bg-slate-950/60 border border-slate-800/60'
                      }`}
                    >
                      {/* Grid Dot Coordinate Marker */}
                      <span className="text-[8px] font-mono font-bold text-slate-700/60 absolute bottom-0.5 right-1 pointer-events-none">
                        {c},{r}
                      </span>

                      {/* Obstacle Wall Texture */}
                      {isObstacle && (
                        <div className="flex items-center justify-center text-slate-500">
                          <span className="material-symbols-outlined text-lg opacity-60">widgets</span>
                        </div>
                      )}

                      {/* Goal Cell - Glowing Energy Portal */}
                      {isGoal && (
                        <div className="relative flex items-center justify-center w-full h-full">
                          <div className="absolute inset-1 rounded-xl bg-amber-400/20 animate-ping" />
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 border-2 border-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/40 animate-bounce">
                            <span className="material-symbols-outlined text-slate-950 font-black text-xl">
                              star
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Energy Gem Item */}
                      {isGem && !isGoal && (
                        <div className="relative flex items-center justify-center animate-pulse">
                          <span className="material-symbols-outlined text-rose-400 font-black text-xl drop-shadow-md">
                            diamond
                          </span>
                        </div>
                      )}

                      {/* Start Cell Indicator */}
                      {isStart && !isGoal && (
                        <span className="text-[9px] font-extrabold uppercase tracking-tighter text-indigo-400/50 absolute top-0.5 left-1 pointer-events-none">
                          START
                        </span>
                      )}
                    </div>
                  );
                })
              )}

              {/* SMOOTH ANIMATED MASCOT AVATAR ON TOP OF GRID */}
              <div
                className="absolute transition-all ease-out z-20 pointer-events-none flex items-center justify-center p-1"
                style={{
                  width: `${100 / currentLevel.gridSize.cols}%`,
                  height: `${100 / currentLevel.gridSize.rows}%`,
                  left: `${(mascotPos.x * 100) / currentLevel.gridSize.cols}%`,
                  top: `${(mascotPos.y * 100) / currentLevel.gridSize.rows}%`,
                  transitionDuration: `${execSpeed * 0.85}ms`,
                }}
              >
                <MascotAvatar direction={mascotDir} mood={mascotMood} size={38} />
              </div>
            </div>
          </div>

          {/* Execution Controls Bar */}
          <div className="w-full mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={runCode}
                disabled={isRunning || workspaceBlocks.length === 0}
                className={`btn-3d px-5 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg ${
                  isRunning
                    ? 'bg-slate-800 text-slate-500 border-slate-700'
                    : 'btn-3d-emerald shadow-emerald-900/40'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isRunning ? 'hourglass_top' : 'play_arrow'}
                </span>
                <span>{isRunning ? 'Running...' : 'Run Code ▶'}</span>
              </button>

              <button
                onClick={resetLevelState}
                disabled={isRunning}
                className="btn-3d btn-3d-indigo px-3.5 py-2.5 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Reset Grid State"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>

            {/* Speed Control Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase">Speed:</span>
              {[
                { label: '1x', speed: 450 },
                { label: '2x', speed: 250 },
                { label: '3x', speed: 120 },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => setExecSpeed(s.speed)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                    execSpeed === s.speed
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TOOLBOX & WORKSPACE (7 COLS ON LG) */}
        <div className="lg:col-span-7 space-y-4">
          {/* TOOLBOX PALETTE */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-indigo-600 text-base">widgets</span>
                <span>Command Block Toolbox (Tap to Add)</span>
              </h3>
              <span className="text-[11px] font-extrabold text-slate-500">
                Used: <strong className="text-indigo-600 dark:text-indigo-400">{totalWorkspaceBlocks}</strong> / {currentLevel.optimalBlockCount} Optimal
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Move Forward Block */}
              {currentLevel.allowedBlocks.includes('move_forward') && (
                <button
                  onClick={() => handleAddBlock('move_forward')}
                  disabled={isRunning}
                  className="btn-3d btn-3d-indigo px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  <span>Move Forward</span>
                </button>
              )}

              {/* Turn Left Block */}
              {currentLevel.allowedBlocks.includes('turn_left') && (
                <button
                  onClick={() => handleAddBlock('turn_left')}
                  disabled={isRunning}
                  className="btn-3d btn-3d-emerald px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">rotate_left</span>
                  <span>Turn Left ↺</span>
                </button>
              )}

              {/* Turn Right Block */}
              {currentLevel.allowedBlocks.includes('turn_right') && (
                <button
                  onClick={() => handleAddBlock('turn_right')}
                  disabled={isRunning}
                  className="btn-3d btn-3d-amber px-3.5 py-2 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">rotate_right</span>
                  <span>Turn Right ↻</span>
                </button>
              )}

              {/* Repeat Loop Block */}
              {currentLevel.allowedBlocks.includes('repeat') && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAddBlock('repeat')}
                    disabled={isRunning}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:opacity-90 active:scale-95 border-b-2 border-purple-800"
                  >
                    <span className="material-symbols-outlined text-sm">repeat</span>
                    <span>Repeat {activeLoopCount}x</span>
                  </button>

                  <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setActiveLoopCount((prev) => Math.max(2, prev - 1))}
                      className="px-2 py-0.5 text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                    >
                      -
                    </button>
                    <span className="text-[11px] font-black px-1">{activeLoopCount}</span>
                    <button
                      onClick={() => setActiveLoopCount((prev) => Math.min(8, prev + 1))}
                      className="px-2 py-0.5 text-xs font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* If Path Ahead Block */}
              {currentLevel.allowedBlocks.includes('if_path') && (
                <button
                  onClick={() => handleAddBlock('if_path')}
                  disabled={isRunning}
                  className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md hover:opacity-90 active:scale-95 border-b-2 border-amber-800"
                >
                  <span className="material-symbols-outlined text-sm">alt_route</span>
                  <span>If Path Ahead</span>
                </button>
              )}
            </div>
          </div>

          {/* WORKSPACE CANVAS BUILDER */}
          <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 border-2 border-slate-800 shadow-xl min-h-[360px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-400 text-base">code_blocks</span>
                    <span>Algorithm Workspace Sequence</span>
                  </h3>
                </div>

                {workspaceBlocks.length > 0 && (
                  <button
                    onClick={() => setWorkspaceBlocks([])}
                    disabled={isRunning}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Empty Workspace Dropzone */}
              {workspaceBlocks.length === 0 ? (
                <div className="py-12 px-4 rounded-2xl border-2 border-dashed border-slate-800 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-800 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
                    <span className="material-symbols-outlined">add_task</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-200">Workspace Empty</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Tap the command blocks above to build your algorithm! Frandy will execute them in order from top to bottom.
                  </p>
                </div>
              ) : (
                /* Block Sequence List */
                <div className="space-y-2">
                  {workspaceBlocks.map((blk, idx) => (
                    <WorkspaceBlockItem
                      key={blk.id}
                      block={blk}
                      index={idx}
                      total={workspaceBlocks.length}
                      activeBlockId={activeBlockId}
                      targetContainerId={targetContainerId}
                      setTargetContainerId={setTargetContainerId}
                      onRemove={handleRemoveBlock}
                      onMove={handleMoveBlock}
                      onUpdateLoop={handleUpdateLoopCount}
                      disabled={isRunning}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Workspace Advice */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-indigo-400">touch_app</span>
                <span>Use Move Up/Down buttons to reorder code sequence</span>
              </span>
              <span>{totalWorkspaceBlocks} Blocks Added</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL MAP MODAL */}
      {showLevelMap && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">map</span>
                  <span>Levels Roadmap Map</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Select any level to jump or replay for 3 stars!
                </p>
              </div>

              <button
                onClick={() => setShowLevelMap(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Level Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {GAME_LEVELS.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.id);
                const isCurrent = lvl.id === currentLevel.id;
                const stars = levelStars[lvl.id] || 0;

                return (
                  <div
                    key={lvl.id}
                    onClick={() => {
                      setCurrentLevelId(lvl.id);
                      setShowLevelMap(false);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-md ring-2 ring-indigo-400/30'
                        : isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                        {lvl.subtitle}
                      </span>
                      {stars > 0 && <span className="text-xs text-amber-400 font-black">{'★'.repeat(stars)}</span>}
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5">
                      Level {lvl.id}: {lvl.conceptTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {lvl.conceptDescription}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL WIN CONCEPT CELEBRATION MODAL */}
      {showWinModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-indigo-500 shadow-2xl text-center space-y-5 animate-scale-up relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

            {/* Trophy Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 text-4xl shadow-lg shadow-amber-500/40 animate-bounce">
              <span className="material-symbols-outlined font-black text-4xl">emoji_events</span>
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider">
                Level {currentLevel.id} Completed!
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                Awesome Algorithm! 🎉
              </h3>
              {/* Stars Earned */}
              <div className="flex items-center justify-center gap-2 text-3xl text-amber-400 my-2">
                {'★'.repeat(earnedStarsCurrentLevel)}
                {'☆'.repeat(3 - earnedStarsCurrentLevel)}
              </div>
            </div>

            {/* REAL PROGRAMMING CONCEPT EXPLANATION CARD */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/80 dark:to-purple-950/80 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 text-left space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">psychology</span>
                <span>Aapne Abhi Seekha: {currentLevel.conceptTitle}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentLevel.explanationHindi}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowWinModal(false);
                  resetLevelState();
                }}
                className="btn-3d btn-3d-indigo flex-1 py-3 text-xs font-black cursor-pointer"
              >
                Replay Level ↺
              </button>

              {currentLevel.id < GAME_LEVELS.length ? (
                <button
                  onClick={() => {
                    setShowWinModal(false);
                    setCurrentLevelId((prev) => Math.min(GAME_LEVELS.length, prev + 1));
                  }}
                  className="btn-3d btn-3d-emerald flex-1 py-3 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Next Level ➔</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowWinModal(false)}
                  className="btn-3d btn-3d-amber flex-1 py-3 text-xs font-black cursor-pointer"
                >
                  Claim Victory 🏆
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BADGES UNLOCKED MODAL */}
      {showBadgesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">military_tech</span>
                <span>Coding Badges & Achievements</span>
              </h3>

              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {GAME_BADGES.map((b) => {
                const isUnlocked = unlockedBadges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-800/80 border-indigo-300 dark:border-indigo-700 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${b.color} flex items-center justify-center text-white text-2xl shadow-md shrink-0`}
                    >
                      <span className="material-symbols-outlined">{b.icon}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {b.title}
                        </h4>
                        {isUnlocked ? (
                          <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            Lvl {b.requiredLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug font-medium">
                        {b.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD MODAL */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500">leaderboard</span>
                <span>Top Code Quest Learners</span>
              </h3>

              <button
                onClick={() => setShowLeaderboardModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {MOCK_LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        item.rank === 1
                          ? 'bg-amber-400 text-slate-950'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      #{item.rank}
                    </span>

                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-300 dark:border-slate-600"
                    />

                    <div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {item.studentId}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-amber-500 flex items-center gap-0.5 justify-end">
                      <span>⭐ {item.stars}</span>
                    </div>
                    <div className="text-[10px] font-bold text-purple-400">
                      {item.xp} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// WORKSPACE BLOCK ITEM SUB-COMPONENT
interface WorkspaceBlockItemProps {
  block: BlockInstance;
  index: number;
  total: number;
  activeBlockId: string | null;
  targetContainerId: string | null;
  setTargetContainerId: (id: string | null) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, dir: 'up' | 'down') => void;
  onUpdateLoop: (id: string, delta: number) => void;
  disabled?: boolean;
}

const WorkspaceBlockItem: React.FC<WorkspaceBlockItemProps> = ({
  block,
  index,
  total,
  activeBlockId,
  targetContainerId,
  setTargetContainerId,
  onRemove,
  onMove,
  onUpdateLoop,
  disabled,
}) => {
  const isActive = activeBlockId === block.id;
  const isTarget = targetContainerId === block.id;

  const getBlockBg = () => {
    switch (block.type) {
      case 'move_forward':
        return 'bg-indigo-900/90 border-indigo-700 text-indigo-100';
      case 'turn_left':
        return 'bg-emerald-900/90 border-emerald-700 text-emerald-100';
      case 'turn_right':
        return 'bg-amber-900/90 border-amber-700 text-amber-100';
      case 'repeat':
        return 'bg-purple-900/90 border-purple-700 text-purple-100';
      case 'if_path':
        return 'bg-rose-900/90 border-rose-700 text-rose-100';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-100';
    }
  };

  return (
    <div
      className={`p-3 rounded-2xl border-2 transition-all shadow-md ${getBlockBg()} ${
        isActive ? 'ring-4 ring-amber-400 bg-amber-500/20 scale-[1.02]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm font-black">
            {block.type === 'move_forward'
              ? 'arrow_upward'
              : block.type === 'turn_left'
              ? 'rotate_left'
              : block.type === 'turn_right'
              ? 'rotate_right'
              : block.type === 'repeat'
              ? 'repeat'
              : 'alt_route'}
          </span>

          <span className="text-xs font-black tracking-wide">{block.label}</span>

          {/* Loop Count Incrementor */}
          {block.type === 'repeat' && (
            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-purple-700/80 ml-2">
              <button
                onClick={() => onUpdateLoop(block.id, -1)}
                disabled={disabled}
                className="text-xs font-black hover:text-amber-400 px-1"
              >
                -
              </button>
              <span className="text-[11px] font-black text-amber-300">{block.count}x</span>
              <button
                onClick={() => onUpdateLoop(block.id, 1)}
                disabled={disabled}
                className="text-xs font-black hover:text-amber-400 px-1"
              >
                +
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          {/* Target Container Toggle */}
          {(block.type === 'repeat' || block.type === 'if_path') && (
            <button
              onClick={() => setTargetContainerId(isTarget ? null : block.id)}
              disabled={disabled}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                isTarget
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-950/60 text-slate-300 hover:text-white'
              }`}
            >
              {isTarget ? 'Target Active' : '+ Insert Inside'}
            </button>
          )}

          {/* Reorder Up */}
          <button
            onClick={() => onMove(block.id, 'up')}
            disabled={disabled || index === 0}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
            title="Move Up"
          >
            <span className="material-symbols-outlined text-xs">arrow_upward</span>
          </button>

          {/* Reorder Down */}
          <button
            onClick={() => onMove(block.id, 'down')}
            disabled={disabled || index === total - 1}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
            title="Move Down"
          >
            <span className="material-symbols-outlined text-xs">arrow_downward</span>
          </button>

          {/* Remove */}
          <button
            onClick={() => onRemove(block.id)}
            disabled={disabled}
            className="p-1 rounded-lg hover:bg-rose-950 text-rose-300 cursor-pointer"
            title="Delete Block"
          >
            <span className="material-symbols-outlined text-xs">close</span>
          </button>
        </div>
      </div>

      {/* Inner Children Zone for Loop / If Block */}
      {(block.type === 'repeat' || block.type === 'if_path') && (
        <div className="mt-2.5 pl-3 border-l-2 border-purple-400/60 space-y-2 pt-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-200/80 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">subheader</span>
            <span>Inner Loop Actions ({block.children?.length || 0})</span>
          </div>

          {block.children && block.children.length > 0 ? (
            block.children.map((child, cIdx) => (
              <WorkspaceBlockItem
                key={child.id}
                block={child}
                index={cIdx}
                total={block.children!.length}
                activeBlockId={activeBlockId}
                targetContainerId={targetContainerId}
                setTargetContainerId={setTargetContainerId}
                onRemove={onRemove}
                onMove={onMove}
                onUpdateLoop={onUpdateLoop}
                disabled={disabled}
              />
            ))
          ) : (
            <div className="py-2 px-3 bg-slate-950/60 rounded-xl border border-dashed border-purple-800/60 text-[11px] text-purple-300 text-center">
              Tap "+ Insert Inside" above then tap toolbox blocks to place commands inside this loop!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
