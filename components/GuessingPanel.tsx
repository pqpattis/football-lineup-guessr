'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { compareNames } from '@/utils/nameComparison';
import { NameGuess } from '@/types';

// The Row Component (Staggered Flip)
const GuessRow: React.FC<{ guess: NameGuess }> = ({ guess }) => (
  <div className="flex justify-start my-1 space-x-1">
    {guess.feedback.map((f, i) => (
      <motion.div
        key={i}
        initial={{ rotateX: 0 }}
        animate={{ rotateX: [0, 90, 0] }}
        transition={{ duration: 0.5, delay: i * 0.08, ease: "easeInOut" }}
        className="w-9 h-9 text-base flex items-center justify-center font-black text-white rounded-md shadow-sm uppercase"
        style={{
          backgroundColor: f.status === 'correct' ? '#10b981' :
                           f.status === 'present' ? '#eab308' : '#3f3f46',
          transformStyle: 'preserve-3d'
        }}
      >
        {f.letter}
      </motion.div>
    ))}
  </div>
);

export const GuessingPanel = () => {
  // Store state
  const activePositionId = useGameStore(s => s.activePositionId);
  const currentMatch = useGameStore(s => s.currentMatch);
  const guessesByPosition = useGameStore(s => s.guessesByPosition);
  const addGuess = useGameStore(s => s.addGuess);

  // Local input state
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Data for the current selection
  const positionState = activePositionId ? guessesByPosition[activePositionId] : null;
  const solutionPlayer = currentMatch?.lineup.find(p => p.positionId === activePositionId);
  const isSolved = positionState?.isSolved || false;

  // Auto-focus input when position changes
  useEffect(() => {
    setInputValue('');
    if (!isSolved && activePositionId) {
      // Use timeout to ensure the input is visible/enabled before focusing
      const focusTimeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => clearTimeout(focusTimeout);
    }
  }, [activePositionId, isSolved]);

  const requiredLength = solutionPlayer?.name.length || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure exactly the right amount of characters
    if (inputValue.length !== requiredLength) {
      return; 
    }

    if (!activePositionId || !solutionPlayer || isSolved || !inputValue.trim()) return;

    const result = compareNames(inputValue.trim().toUpperCase(), solutionPlayer.name);
    const newGuess: NameGuess = { guessName: inputValue.trim().toUpperCase(), feedback: result };
    const isSuccess = result.every(f => f.status === 'correct');

    addGuess(activePositionId, newGuess, isSuccess);
    setInputValue('');
  };

  // Empty state
  if (!activePositionId) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
        <div className="w-16 h-16 mb-4 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">#</span>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white">Select a player on the pitch</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">Position</span>
        <h2 className="text-4xl font-black italic text-white uppercase leading-none">{activePositionId}</h2>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="wait">
          {isSolved ? (
            /* Reveal state */
            <motion.div 
              key="solved"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center mb-6"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-full mb-4 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-6 h-6">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-1">{solutionPlayer?.name}</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded text-left">
                  <p className="text-[8px] text-white/40 uppercase">Nation</p>
                  <p className="text-xs font-bold text-white uppercase">{solutionPlayer?.nationality}</p>
                </div>
                <div className="bg-white/5 p-2 rounded text-left">
                  <p className="text-[8px] text-white/40 uppercase">Age</p>
                  <p className="text-xs font-bold text-white uppercase">{solutionPlayer?.age}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Guessing state */
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                    Enter Name
                  </label>
                  <span className={`text-[10px] font-mono ${inputValue.length === requiredLength ? 'text-emerald-400' : 'text-white/20'}`}>
                    {inputValue.length}/{requiredLength}
                  </span>
                </div>
                
                <input 
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    if (e.target.value.length <= requiredLength) {
                      setInputValue(e.target.value);
                    }
                  }}
                  maxLength={requiredLength}
                  className={`w-full bg-white/5 border rounded-xl p-4 text-white text-xl font-black uppercase tracking-[0.2em] focus:outline-none transition-all
                    ${inputValue.length === requiredLength
                      ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'border-white/20'}`}
                  placeholder={`${requiredLength} LETTERS...`}
                />
              </form>

              <div className="flex-1">
                <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-4">Attempt History</p>
                <div className="flex flex-col-reverse gap-2">
                  {positionState?.guesses.map((g, i) => (
                    <GuessRow key={i} guess={g} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};