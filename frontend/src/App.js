import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Gamepad2, 
  Search, 
  Settings, 
  Filter, 
  Monitor, 
  Moon, 
  Sun, 
  X,
  Cloud,
  ArrowDownAZ,
  ArrowUpAZ,
  ExternalLink,
  ImageOff,
  Calendar,
  Layers,
  Info,
  Rocket,
  Menu,
  Loader2,
  ChevronRight,
  Play,
  GamepadIcon
} from 'lucide-react';
import { fetchGames } from './api/gameApi';

// Platform Logo Components
const XboxLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="m24 12c0-.001 0-.001 0-.002 0-3.618-1.606-6.861-4.144-9.054l-.015-.013c-1.91 1.023-3.548 2.261-4.967 3.713l-.004.004c.044.046.087.085.131.132 3.719 4.012 7.106 9.73 6.546 12.471 1.53-1.985 2.452-4.508 2.452-7.246 0-.002 0-.004 0-.006z"/>
      <path d="m12.591 3.955c1.68-1.104 3.699-1.833 5.872-2.022l.048-.003c-1.837-1.21-4.09-1.929-6.511-1.929-2.171 0-4.207.579-5.962 1.591l.058-.031c.658.567 2.837.781 5.484 2.4.143.089.316.142.502.142.189 0 .365-.055.513-.149l-.004.002z"/>
      <path d="m9.166 6.778c.046-.049.093-.09.138-.138-1.17-1.134-2.446-2.174-3.806-3.1l-.099-.064c-.302-.221-.681-.354-1.091-.354-.146 0-.288.017-.425.049l.013-.002c-2.398 2.198-3.896 5.344-3.896 8.84 0 2.909 1.037 5.576 2.762 7.651l-.016-.020c-1.031-2.547 2.477-8.672 6.419-12.862z"/>
      <path d="m12.084 9.198c-3.962 3.503-9.477 8.73-8.632 11.218 2.174 2.213 5.198 3.584 8.542 3.584 3.493 0 6.637-1.496 8.826-3.883l.008-.009c.486-2.618-4.755-7.337-8.744-10.910z"/>
  </svg>
);

const GfnLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z"/>
  </svg>
);

// Pulsing Glow Styles
const PulsingGlowStyles = () => (
    <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-glow {
            0%, 100% { 
                box-shadow: 
                    0 0 5px rgba(99, 102, 241, 0.3), 
                    0 0 10px rgba(99, 102, 241, 0.15); 
            }
            50% { 
                box-shadow: 
                    0 0 10px rgba(129, 140, 248, 0.5), 
                    0 0 20px rgba(129, 140, 248, 0.3); 
            }
        }
        
        @keyframes modal-button-glow {
            0%, 100% { 
                box-shadow: 
                    0 0 0 1px rgba(99, 102, 241, 0.3),
                    0 0 8px rgba(99, 102, 241, 0.2);
            }
            50% { 
                box-shadow: 
                    0 0 0 1px rgba(129, 140, 248, 0.6),
                    0 0 12px rgba(129, 140, 248, 0.4);
            }
        }
        
        @keyframes subtle-shift {
          0%, 100% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(1px, 1px);
          }
          50% {
            transform: translate(0px, 2px);
          }
          75% {
            transform: translate(-1px, 1px);
          }
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes launch-pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          }
          70% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .is-visually-active {
            transform: scale(1.02) !important;
            z-index: 20; 
            border-color: #6366F1;
            animation: pulse-glow 2s infinite alternate ease-in-out;
        }
        
        .modal-button-focused {
            transform: scale(1.01) !important;
            z-index: 10;
            animation: modal-button-glow 1.5s infinite alternate ease-in-out;
            position: relative;
        }
        
        .subtle-shift {
          animation: subtle-shift 20s infinite ease-in-out;
        }
        
        .gradient-animation {
          animation: gradient-shift 15s ease infinite;
        }
        
        .float-animation {
          animation: float 6s infinite ease-in-out;
        }
        
        .launch-pulse {
          animation: launch-pulse 2s infinite;
        }
        
        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
    `}} />
);

// UPDATED Controller Guide - Only shows when gamepad is connected
const ControllerGuide = ({ darkMode, gamepadConnected, modalType }) => {
    if (!gamepadConnected) return null;
    
    const buttonClass = "w-6 h-6 rounded-lg flex items-center justify-center font-bold text-sm border";
    const buttonBorder = darkMode 
      ? 'border-white/40 text-white bg-gradient-to-br from-slate-800/80 to-slate-900/80 shadow-inner' 
      : 'border-gray-500 text-gray-800 bg-gradient-to-br from-white/80 to-gray-100/80 shadow-inner';
    
    const navButtonClass = "px-2 py-1 rounded bg-gradient-to-br";
    const navButtonBg = darkMode 
      ? 'from-slate-700/60 to-slate-800/60 border border-white/20 text-white/90' 
      : 'from-gray-100/60 to-gray-200/60 border border-gray-400/50 text-gray-800';
    
    // Determine which guide to show based on modal type
    const getModalInstructions = () => {
        if (!modalType) return null;
        
        if (modalType === 'game') {
            return (
                <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs font-medium mb-2 opacity-80">In Game Modal:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>A</span>
                            <span className="text-xs">Launch Game</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>X</span>
                            <span className="text-xs">Launch Game</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>Y</span>
                            <span className="text-xs">View Database</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>B</span>
                            <span className="text-xs">Close</span>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (modalType === 'settings') {
            return (
                <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="text-xs font-medium mb-2 opacity-80">In Settings:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>↑↓</span>
                            <span className="text-xs">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>A</span>
                            <span className="text-xs">Select</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>←→</span>
                            <span className="text-xs">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className={`${buttonClass} ${buttonBorder}`}>B</span>
                            <span className="text-xs">Close</span>
                        </div>
                    </div>
                </div>
            );
        }
        
        return null;
    };
    
    return (
        <div className={`fixed bottom-6 right-6 z-50 p-3 rounded-xl backdrop-blur-xl border ${darkMode 
          ? 'border-white/20 bg-slate-900/90 text-white shadow-lg' 
          : 'border-gray-300/70 bg-white/90 text-gray-900 shadow-lg'} transition-all duration-300`}>
            
            <div className="flex flex-col gap-2 text-xs relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className={`${buttonClass} ${buttonBorder}`}>
                            A
                        </span>
                        <span className="font-medium min-w-[50px]">Select</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${buttonClass} ${buttonBorder}`}>
                            X
                        </span>
                        <span className="font-medium min-w=[50px]">Launch</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className={`${buttonClass} ${buttonBorder}`}>
                           <Menu className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-medium min-w-[50px]">Menu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`${buttonClass} ${buttonBorder}`}>
                            Y
                        </span>
                        <span className="font-medium min-w-[50px]">Search</span>
                    </div>
                </div>
                
                {/* LB/RB Navigation Hint */}
                <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-center gap-1.5 text-xs opacity-80">
                    <span className={`${navButtonClass} ${navButtonBg}`}>LB</span>
                    <span className={`${navButtonClass} ${navButtonBg}`}>RB</span>
                    <span className="text-xs font-medium ml-1">Navigate tabs</span>
                </div>
                
                {/* Modal-specific instructions */}
                {getModalInstructions()}
            </div>
        </div>
    );
};

// Game Detail Modal with controller support - FIXED hooks order
const GameDetailModal = ({ game, onClose, onLaunch, darkMode, focusedButton, onButtonFocus }) => {
    // Move hooks to the top, before any conditional returns
    const modalContentClasses = darkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700' 
        : 'bg-gradient-to-br from-white to-gray-50 text-gray-900 border border-gray-200 shadow-2xl';

    // Function to create slug from game title
    const createSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .replace(/\s+/g, '-');
    };

    // Construct database URL
    const databaseUrl = game ? `https://clouddosage.com/games/${createSlug(game.title)}` : '';

    // Handle database button click
    const handleDatabaseClick = useCallback(() => {
        if (game && databaseUrl) {
            window.open(databaseUrl, '_blank', 'noopener,noreferrer');
        }
    }, [game, databaseUrl]);

    // Launch game handler
    const handleLaunchGame = useCallback(() => {
        if (!game) return;
        console.log('Launching game:', game.title, 'to:', game.url);
        if (game.url && game.url !== '#') {
            window.open(game.url, '_blank', 'noopener,noreferrer');
        }
        onClose();
    }, [game, onClose]);

    // Early return after all hooks
    if (!game) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 overflow-y-auto p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div 
                className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl p-4 md:p-6 transition-transform duration-300 transform scale-100 ${modalContentClasses} flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4 md:mb-6 flex-shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {game.title}
                        </h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} ${focusedButton === 'close' ? 'modal-button-focused' : ''}`}
                        onMouseEnter={() => onButtonFocus('close')}
                        onFocus={() => onButtonFocus('close')}
                        tabIndex={0}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative flex-grow overflow-y-auto pr-2">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="flex-shrink-0 mb-4 md:mb-0 rounded-xl overflow-hidden shadow-xl aspect-[2/3] w-full max-w-[120px] md:max-w-[150px] self-center md:self-start border-4 border-white/20">
                            <img 
                                src={game.imageUrl} 
                                alt={`${game.title} cover`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    const parent = e.target.parentNode;
                                    parent.innerHTML = `
                                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${game.color} p-4">
                                            <ImageOff class="w-8 md:w-10 h-8 md:h-10 text-white/50 mb-2" />
                                            <span class="text-white/70 text-xs md:text-sm text-center">${game.title}</span>
                                        </div>
                                    `;
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-4 md:mb-6 items-center">
                                <div className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-slate-700/80' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'}`}>
                                    <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                                    <span>{game.year}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-slate-700/80' : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border border-purple-200'}`}>
                                    <Layers className="w-3 md:w-4 h-3 md:h-4" />
                                    <span>{game.genre}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1 rounded-full ${game.service === 'xbox' ? 'bg-gradient-to-r from-[#107C10]/90 to-[#0e6e0e]/90' : 'bg-gradient-to-r from-[#76B900]/90 to-[#68a500]/90'} text-white shadow-md`}>
                                    {game.service === 'xbox' ? <XboxLogo className="w-3 md:w-4 h-3 md:h-4" /> : <GfnLogo className="w-3 md:w-4 h-3 md:h-4" />}
                                    <span>{game.service === 'xbox' ? 'Xbox Cloud' : 'GeForce NOW'}</span>
                                </div>
                                
                                {/* CloudDosage Database Button */}
                                <button
                                    onClick={handleDatabaseClick}
                                    className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${darkMode 
                                        ? 'bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-600 text-white shadow-md' 
                                        : 'bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-500 hover:to-orange-500 text-white shadow-md'} ${focusedButton === 'database' ? 'modal-button-focused' : ''}`}
                                    title="View on Cloud Dosage Database"
                                    onMouseEnter={() => onButtonFocus('database')}
                                    onFocus={() => onButtonFocus('database')}
                                    tabIndex={0}
                                >
                                    <svg 
                                        className="w-3 md:w-4 h-3 md:h-4" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        {/* Pill/Capsule Shape */}
                                        <path d="M8 5H16C18.7614 5 21 7.23858 21 10V14C21 16.7614 18.7614 19 16 19H8C5.23858 19 3 16.7614 3 14V10C3 7.23858 5.23858 5 8 5Z" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                        {/* Cloud Icon inside pill */}
                                        <path d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                        <path d="M15 12H12M15 12L13 14M15 12L13 10" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="hidden md:inline">Database</span>
                                </button>
                            </div>

                            <h3 className="text-base md:text-lg font-semibold mb-2 opacity-70">About the Game</h3>
                            <p className="text-xs md:text-sm leading-relaxed mb-6 md:mb-8 opacity-90">{game.description}</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <h4 className="text-xs md:text-sm font-semibold mb-1 opacity-70">Publisher</h4>
                                    <p className={`text-xs md:text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>{game.publisher}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs md:text-sm font-semibold mb-1 opacity-70">Release Year</h4>
                                    <p className={`text-xs md:text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>{game.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 pt-4 flex gap-4">
                    <button 
                        onClick={handleLaunchGame}
                        className={`w-full flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl text-base md:text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-[0.98] launch-pulse ${focusedButton === 'launch' ? 'modal-button-focused' : ''}`}
                        onMouseEnter={() => onButtonFocus('launch')}
                        onFocus={() => onButtonFocus('launch')}
                        tabIndex={0}
                        autoFocus
                    >
                        <Play className="w-4 md:w-5 h-4 md:h-5" />
                        Launch Now
                        <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Settings Modal with controller support - FIXED hooks order
const SettingsModal = ({ show, onClose, darkMode, setDarkMode, services, setServices, sortAsc, setSortAsc, focusedIndex, onFocusedIndexChange, isFullscreen, toggleFullscreen }) => {
    // All hooks must be at the top, even if we return early
    const modalClasses = darkMode 
        ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700' 
        : 'bg-gradient-to-br from-white to-gray-50 text-gray-900 border border-gray-200 shadow-2xl';

    // Settings items for navigation
    const settingsItems = [
        { type: 'theme', id: 'theme', label: 'Theme Toggle' },
        { type: 'filter', id: 'xbox', label: 'Xbox Filter' },
        { type: 'filter', id: 'gfn', label: 'GFN Filter' },
        { type: 'sort', id: 'asc', label: 'Sort Ascending' },
        { type: 'sort', id: 'desc', label: 'Sort Descending' },
        { type: 'fullscreen', id: 'fullscreen', label: 'Fullscreen Toggle' },
        { type: 'close', id: 'close', label: 'Close Button' }
    ];

    // Early return after all hooks
    if (!show) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 p-0 sm:p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div 
                className={`w-full max-w-full sm:max-w-md md:max-w-lg rounded-none sm:rounded-2xl p-4 md:p-6 transition-transform duration-300 transform scale-100 ${modalClasses} min-h-screen sm:min-h-0 sm:my-4 sm:max-h-[90vh] flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed header that doesn't scroll */}
                <div className="flex-shrink-0 flex justify-between items-center mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <Settings className="w-5 md:w-6 h-5 md:h-6" />
                        <span className="text-sm md:text-base lg:text-xl">CloudBox Settings</span>
                    </h2>
                    <button 
                        onClick={onClose} 
                        className={`p-2 rounded-full transition-all duration-200 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'} ${focusedIndex === 6 ? 'modal-button-focused' : ''}`}
                        onMouseEnter={() => onFocusedIndexChange(6)}
                        onFocus={() => onFocusedIndexChange(6)}
                        tabIndex={0}
                    >
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>
                
                {/* Scrollable content area */}
                <div className="flex-grow overflow-y-auto pr-1 md:pr-0 space-y-4 md:space-y-6 pb-4">
                    {/* Theme Section */}
                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-slate-800/80' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'}`}>
                        <h3 className="text-base md:text-lg font-semibold mb-2">Theme</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Toggle Dark Mode</span>
                            <button 
                                onClick={() => setDarkMode(!darkMode)}
                                className={`flex items-center justify-center px-3 py-2 md:px-4 md:py-2 rounded-full transition-all w-full sm:w-auto ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 shadow-sm'} ${focusedIndex === 0 ? 'modal-button-focused' : ''}`}
                                onMouseEnter={() => onFocusedIndexChange(0)}
                                onFocus={() => onFocusedIndexChange(0)}
                                tabIndex={0}
                            >
                                {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                                <span className="text-sm font-medium">{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-slate-800/80' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'}`}>
                        <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> 
                            <span>Filters</span>
                        </h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setServices(prev => ({ ...prev, xbox: !prev.xbox }))}
                                className={`flex items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-full font-semibold transition-all duration-200 text-sm ${services.xbox 
                                    ? 'bg-gradient-to-r from-[#107C10] to-[#0e6e0e] text-white shadow-md' 
                                    : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} ${focusedIndex === 1 ? 'modal-button-focused' : ''}`}
                                onMouseEnter={() => onFocusedIndexChange(1)}
                                onFocus={() => onFocusedIndexChange(1)}
                                tabIndex={0}
                            >
                                <XboxLogo className="w-4 h-4 mr-2" />
                                Xbox Cloud {services.xbox ? '(Enabled)' : '(Disabled)'}
                            </button>
                            <button
                                onClick={() => setServices(prev => ({ ...prev, gfn: !prev.gfn }))}
                                className={`flex items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-full font-semibold transition-all duration-200 text-sm ${services.gfn 
                                    ? 'bg-gradient-to-r from-[#76B900] to-[#68a500] text-white shadow-md' 
                                    : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} ${focusedIndex === 2 ? 'modal-button-focused' : ''}`}
                                onMouseEnter={() => onFocusedIndexChange(2)}
                                onFocus={() => onFocusedIndexChange(2)}
                                tabIndex={0}
                            >
                                <GfnLogo className="w-4 h-4 mr-2" />
                                GeForce NOW {services.gfn ? '(Enabled)' : '(Disabled)'}
                            </button>
                        </div>
                    </div>

                    {/* Sorting Section */}
                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-slate-800/80' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'}`}>
                        <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
                            <ArrowDownAZ className="w-4 h-4" /> 
                            <span>Sorting</span>
                        </h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSortAsc(true)}
                                className={`flex items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-full font-semibold transition-all duration-200 text-sm ${sortAsc
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                                    : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} ${focusedIndex === 3 ? 'modal-button-focused' : ''}`}
                                onMouseEnter={() => onFocusedIndexChange(3)}
                                onFocus={() => onFocusedIndexChange(3)}
                                tabIndex={0}
                            >
                                <ArrowUpAZ className="w-4 h-4 mr-2" />
                                Sort A-Z (Ascending)
                            </button>
                            <button
                                onClick={() => setSortAsc(false)}
                                className={`flex items-center justify-center px-3 py-3 md:px-4 md:py-3 rounded-full font-semibold transition-all duration-200 text-sm ${!sortAsc
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                                    : darkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} ${focusedIndex === 4 ? 'modal-button-focused' : ''}`}
                                onMouseEnter={() => onFocusedIndexChange(4)}
                                onFocus={() => onFocusedIndexChange(4)}
                                tabIndex={0}
                            >
                                <ArrowDownAZ className="w-4 h-4 mr-2" />
                                Sort Z-A (Descending)
                            </button>
                        </div>
                    </div>

                    {/* Fullscreen Section */}
                    <div className={`p-3 md:p-4 rounded-xl ${darkMode ? 'bg-slate-800/80' : 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100'}`}>
                        <h3 className="text-base md:text-lg font-semibold mb-2 flex items-center gap-2">
                            <Monitor className="w-4 h-4" /> 
                            <span>Display</span>
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                    Fullscreen Mode
                                </span>
                                <button 
                                    onClick={toggleFullscreen}
                                    className={`flex items-center justify-center px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm ${isFullscreen
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md hover:from-amber-700 hover:to-orange-700'
                                        : darkMode 
                                            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 shadow-sm'
                                            : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 hover:from-gray-300 hover:to-gray-400 shadow-sm'} ${focusedIndex === 5 ? 'modal-button-focused' : ''}`}
                                    onMouseEnter={() => onFocusedIndexChange(5)}
                                    onFocus={() => onFocusedIndexChange(5)}
                                    tabIndex={0}
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-medium">
                                        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                    </span>
                                </button>
                            </div>
                            {!isFullscreen && (
                                <p className="text-xs mt-1 opacity-70">
                                    Use F11 or the button above.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main App Component - No changes needed here
export default function App() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [services, setServices] = useState({ xbox: true, gfn: true });
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isGridFocused, setIsGridFocused] = useState(true);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  
  // Modal navigation states
  const [settingsFocusedIndex, setSettingsFocusedIndex] = useState(0);
  const [gameModalFocusedButton, setGameModalFocusedButton] = useState('launch');
  
  // Fullscreen state moved to App level
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs
  const gridRef = useRef(null);
  const searchInputRefDesktop = useRef(null);
  const searchInputRefMobile = useRef(null);
  const gamepadRef = useRef(null);
  const prevButtonsRef = useRef([]);
  
  // Refs for tracking current state
  const selectedGameRef = useRef(null);
  const filteredGamesRef = useRef([]);
  const focusedIndexRef = useRef(0);
  const showSettingsRef = useRef(false);
  const settingsFocusedIndexRef = useRef(0);
  const gameModalFocusedButtonRef = useRef('launch');
  const isFullscreenRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    selectedGameRef.current = selectedGame;
  }, [selectedGame]);

  useEffect(() => {
    filteredGamesRef.current = filteredGames;
  }, [filteredGames]);

  useEffect(() => {
    focusedIndexRef.current = focusedIndex;
  }, [focusedIndex]);

  useEffect(() => {
    showSettingsRef.current = showSettings;
  }, [showSettings]);

  useEffect(() => {
    settingsFocusedIndexRef.current = settingsFocusedIndex;
  }, [settingsFocusedIndex]);

  useEffect(() => {
    gameModalFocusedButtonRef.current = gameModalFocusedButton;
  }, [gameModalFocusedButton]);

  useEffect(() => {
    isFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  // Track available tabs for controller navigation
  const tabs = [
    { key: 'all', label: 'All Games', action: () => setServices({ xbox: true, gfn: true }) },
    { key: 'gfn', label: 'GFN', action: () => setServices({ xbox: false, gfn: true }) },
    { key: 'xbox', label: 'Xbox', action: () => setServices({ xbox: true, gfn: false }) }
  ];

  // Get current active tab index
  const getActiveTabIndex = () => {
    if (services.xbox && services.gfn) return 0; // All Games
    if (!services.xbox && services.gfn) return 1; // GFN
    if (services.xbox && !services.gfn) return 2; // Xbox
    return 0;
  };

  // Navigate tabs with controller
  const navigateTabs = useCallback((direction) => {
    const currentIndex = getActiveTabIndex();
    let newIndex;
    
    if (direction === 'left') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    }
    
    tabs[newIndex].action();
  }, [services, tabs]);

  // Fullscreen toggle function
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, []);

  // Check fullscreen status on mount and changes
  useEffect(() => {
    const checkFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);

    // Initial check
    checkFullscreen();

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
    };
  }, []);

  // Fetch games on component mount
  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        console.log('Loaded games:', data.length);
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGames();
  }, []);

  // Filter and sort games
  useEffect(() => {
    if (isLoading) return;

    console.log('Filtering games with services:', services);

    let result = games.filter(g => {
      const matchesService = (g.service === 'xbox' && services.xbox) || 
                            (g.service === 'gfn' && services.gfn);
      const matchesSearch = searchQuery ? 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.publisher && g.publisher.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      return matchesService && matchesSearch;
    });

    console.log('Filtered to', result.length, 'games');

    result.sort((a, b) => {
      return sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });

    setFilteredGames(result);
    
    if (result.length > 0) {
        setFocusedIndex(prev => Math.min(prev, result.length - 1));
    } else {
        setFocusedIndex(0);
    }
    
    if (selectedGame && !result.find(g => g.id === selectedGame.id)) {
        setSelectedGame(null);
    }
  }, [games, services, sortAsc, searchQuery, selectedGame, isLoading]);

  // Scroll into view
  useEffect(() => {
    if (isGridFocused && gridRef.current && filteredGames.length > 0) {
      const cards = gridRef.current.querySelectorAll('[data-game-card]');
      if (cards[focusedIndex]) {
        cards[focusedIndex].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  }, [focusedIndex, isGridFocused, filteredGames.length]);

  // Launch handler
  const handleLaunch = useCallback((game, directLaunch = false) => {
    if (!game) return;
    
    if (directLaunch) {
        console.log('Launching game:', game.title, 'to:', game.url);
        if (game.url && game.url !== '#') {
            window.open(game.url, '_blank', 'noopener,noreferrer');
        }
        setSelectedGame(null);
        return;
    }

    const currentSelectedGame = selectedGameRef.current;
    
    if (!currentSelectedGame || currentSelectedGame.id !== game.id) {
        setSelectedGame(game);
        return;
    }
  }, []);

  // Navigation handler - FIXED for modal navigation
  const handleNavigation = useCallback((direction) => {
    // Handle settings modal navigation
    if (showSettingsRef.current) {
      switch(direction) {
        case 'UP':
          setSettingsFocusedIndex(prev => prev > 0 ? prev - 1 : 6);
          break;
        case 'DOWN':
          setSettingsFocusedIndex(prev => prev < 6 ? prev + 1 : 0);
          break;
      }
      return;
    }
    
    // Handle game modal navigation
    if (selectedGameRef.current) {
      const currentButton = gameModalFocusedButtonRef.current;
      const buttons = ['launch', 'database', 'close'];
      const currentIndex = buttons.indexOf(currentButton);
      
      switch(direction) {
        case 'UP':
        case 'LEFT':
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
          setGameModalFocusedButton(buttons[prevIndex]);
          break;
        case 'DOWN':
        case 'RIGHT':
          const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
          setGameModalFocusedButton(buttons[nextIndex]);
          break;
      }
      return;
    }
    
    // Handle main grid navigation
    if (document.activeElement === searchInputRefDesktop.current ||
        document.activeElement === searchInputRefMobile.current) return;
    if (!isGridFocused) setIsGridFocused(true);

    const total = filteredGamesRef.current.length;
    if (total === 0) return;

    let gridWidth = 4;
    if (gridRef.current) {
        const style = window.getComputedStyle(gridRef.current);
        const columns = style.getPropertyValue('grid-template-columns').split(' ').length;
        if (columns > 0) gridWidth = columns;
    }
    
    setFocusedIndex(prev => {
      let next = prev;
      switch (direction) {
        case 'UP': next = prev - gridWidth; break;
        case 'DOWN': next = prev + gridWidth; break;
        case 'LEFT': next = prev - 1; break;
        case 'RIGHT': next = prev + 1; break;
        default: break;
      }
      
      if (next < 0) next = 0;
      if (next >= total) next = total - 1;
      return next;
    });
  }, [isGridFocused]);

  // Handle game modal button press
  const handleGameModalButtonPress = useCallback(() => {
    const currentButton = gameModalFocusedButtonRef.current;
    const currentSelectedGame = selectedGameRef.current;
    
    switch(currentButton) {
      case 'launch':
        console.log('Launching game:', currentSelectedGame?.title);
        if (currentSelectedGame?.url && currentSelectedGame.url !== '#') {
            window.open(currentSelectedGame.url, '_blank', 'noopener,noreferrer');
        }
        setSelectedGame(null);
        break;
      case 'database':
        if (currentSelectedGame) {
            const slug = currentSelectedGame.title
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-');
            const databaseUrl = `https://clouddosage.com/games/${slug}`;
            window.open(databaseUrl, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'close':
        setSelectedGame(null);
        break;
    }
  }, []);

  // Handle settings modal button press - FIXED for fullscreen
  const handleSettingsModalButtonPress = useCallback(() => {
    const index = settingsFocusedIndexRef.current;
    
    switch(index) {
      case 0: // Theme
        setDarkMode(!darkMode);
        break;
      case 1: // Xbox filter
        setServices(prev => ({ ...prev, xbox: !prev.xbox }));
        break;
      case 2: // GFN filter
        setServices(prev => ({ ...prev, gfn: !prev.gfn }));
        break;
      case 3: // Sort A-Z
        setSortAsc(true);
        break;
      case 4: // Sort Z-A
        setSortAsc(false);
        break;
      case 5: // Fullscreen - FIXED
        toggleFullscreen();
        break;
      case 6: // Close
        setShowSettings(false);
        break;
    }
  }, [darkMode, toggleFullscreen]);

  // Gamepad input handler - UPDATED for fullscreen
  const handleGamepadInput = useCallback((buttonIndex) => {
    // Check if typing in either search input
    const isTypingInSearch = document.activeElement === searchInputRefDesktop.current || 
                            document.activeElement === searchInputRefMobile.current;
    
    if (isTypingInSearch && buttonIndex !== 1) return;
    
    // Get current values from refs
    const currentSelectedGame = selectedGameRef.current;
    const currentShowSettings = showSettingsRef.current;
    const currentFilteredGames = filteredGamesRef.current;
    const currentFocusedIndex = focusedIndexRef.current;
    
    console.log(`Gamepad button ${buttonIndex} pressed. Focused index: ${currentFocusedIndex}, Total games: ${currentFilteredGames.length}`);
    
    // Get the current focused game from the refs
    const currentGameInFocus = currentFilteredGames[currentFocusedIndex];
    
    // Handle settings modal input
    if (currentShowSettings) {
      switch(buttonIndex) {
        case 0: // A button - Select
          handleSettingsModalButtonPress();
          break;
        case 1: // B button - Close
          setShowSettings(false);
          break;
        case 12: // D-pad up
          handleNavigation('UP');
          break;
        case 13: // D-pad down
          handleNavigation('DOWN');
          break;
      }
      return;
    }
    
    // Handle game modal input
    if (currentSelectedGame) {
      switch(buttonIndex) {
        case 0: // A button - Select focused button
          handleGameModalButtonPress();
          break;
        case 1: // B button - Close
          setSelectedGame(null);
          break;
        case 2: // X button - Launch game
          console.log('X button pressed in game modal');
          if (currentSelectedGame?.url && currentSelectedGame.url !== '#') {
              window.open(currentSelectedGame.url, '_blank', 'noopener,noreferrer');
          }
          setSelectedGame(null);
          break;
        case 3: // Y button - Database
          console.log('Y button pressed for database');
          const slug = currentSelectedGame.title
              .toLowerCase()
              .replace(/[^\w\s]/g, '')
              .replace(/\s+/g, '-');
          const databaseUrl = `https://clouddosage.com/games/${slug}`;
          window.open(databaseUrl, '_blank', 'noopener,noreferrer');
          break;
        case 12: // D-pad up
        case 14: // D-pad left
          handleNavigation('LEFT');
          break;
        case 13: // D-pad down
        case 15: // D-pad right
          handleNavigation('RIGHT');
          break;
      }
      return;
    }
    
    // Handle main grid input
    switch(buttonIndex) {
      case 0: // A button - Select/Open modal
        console.log('A button pressed. Current focused game:', currentGameInFocus?.title);
        if (currentGameInFocus) {
          console.log('Opening modal for:', currentGameInFocus.title);
          setSelectedGame(currentGameInFocus);
        }
        break;
        
      case 1: // B button - Close/Back
        console.log('B button pressed');
        if (isTypingInSearch) {
          if (document.activeElement) {
            document.activeElement.blur();
          }
          setIsGridFocused(true);
        }
        break;
        
      case 2: // X button - Direct launch
        console.log('X button pressed. Current focused game:', currentGameInFocus?.title);
        if (currentGameInFocus) {
          console.log('Direct launching:', currentGameInFocus.title);
          handleLaunch(currentGameInFocus, true);
        }
        break;
        
      case 3: // Y button - Search
        console.log('Y button pressed - trying to focus search');
        if (!currentSelectedGame && !currentShowSettings) {
          const isMobileView = window.innerWidth < 768;
          
          setTimeout(() => {
            if (isMobileView) {
              if (searchInputRefMobile.current) {
                searchInputRefMobile.current.focus();
                searchInputRefMobile.current.select();
                setIsGridFocused(false);
                console.log('Mobile search input focused');
              }
            } else {
              if (searchInputRefDesktop.current) {
                searchInputRefDesktop.current.focus();
                searchInputRefDesktop.current.select();
                setIsGridFocused(false);
                console.log('Desktop search input focused');
              }
            }
          }, 10);
        }
        break;
        
      case 4: // LB button - Navigate tabs left
        console.log('LB button pressed - navigate tabs left');
        if (!currentSelectedGame && !currentShowSettings && !isTypingInSearch) {
          navigateTabs('left');
        }
        break;
        
      case 5: // RB button - Navigate tabs right
        console.log('RB button pressed - navigate tabs right');
        if (!currentSelectedGame && !currentShowSettings && !isTypingInSearch) {
          navigateTabs('right');
        }
        break;
        
      case 9: // Start button - Opens settings
        console.log('Start button pressed');
        if (!currentSelectedGame && !isTypingInSearch) {
          setShowSettings(true);
        }
        break;
        
      case 12: // D-pad up
        if (!currentSelectedGame && !currentShowSettings) {
          handleNavigation('UP');
        }
        break;
        
      case 13: // D-pad down
        if (!currentSelectedGame && !currentShowSettings) {
          handleNavigation('DOWN');
        }
        break;
        
      case 14: // D-pad left
        if (!currentSelectedGame && !currentShowSettings) {
          handleNavigation('LEFT');
        }
        break;
        
      case 15: // D-pad right
        if (!currentSelectedGame && !currentShowSettings) {
          handleNavigation('RIGHT');
        }
        break;
    }
  }, [handleLaunch, handleNavigation, navigateTabs, handleGameModalButtonPress, handleSettingsModalButtonPress]);

  // Gamepad polling
  useEffect(() => {
    let animationFrameId;
    let lastJoystickUpdate = 0;
    let lastButtonPressTime = 0;
    const JOYSTICK_THROTTLE_MS = 200;
    const BUTTON_THROTTLE_MS = 300;
    const DEAD_ZONE = 0.7;
    
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];
      
      if (gamepad) {
        if (!gamepadConnected) {
          setGamepadConnected(true);
          console.log('Gamepad connected:', gamepad.id);
        }
        
        gamepadRef.current = gamepad;
        
        // Check buttons with throttling
        const buttons = gamepad.buttons;
        const prevButtons = prevButtonsRef.current;
        const now = Date.now();
        
        buttons.forEach((button, index) => {
          const pressed = button.pressed || button.value > 0.5;
          
          // Only trigger on button press (not release) with throttle
          if (pressed && (!prevButtons[index] || !prevButtons[index].pressed)) {
            if (now - lastButtonPressTime > BUTTON_THROTTLE_MS) {
              handleGamepadInput(index);
              lastButtonPressTime = now;
            }
          }
          
          // Update previous button state
          if (!prevButtons[index]) {
            prevButtons[index] = { pressed };
          } else {
            prevButtons[index].pressed = pressed;
          }
        });
        
        // Check axes for D-pad/joystick with throttling
        const axes = gamepad.axes;
        
        // Only process joystick if enough time has passed
        if (now - lastJoystickUpdate > JOYSTICK_THROTTLE_MS) {
          let joystickMoved = false;
          
          // Left/Right on axis 0
          if (axes[0] < -DEAD_ZONE) {
            handleNavigation('LEFT');
            joystickMoved = true;
          } else if (axes[0] > DEAD_ZONE) {
            handleNavigation('RIGHT');
            joystickMoved = true;
          }
          
          // Up/Down on axis 1
          if (axes[1] < -DEAD_ZONE) {
            handleNavigation('UP');
            joystickMoved = true;
          } else if (axes[1] > DEAD_ZONE) {
            handleNavigation('DOWN');
            joystickMoved = true;
          }
          
          if (joystickMoved) {
            lastJoystickUpdate = now;
          }
        }
        
      } else {
        if (gamepadConnected) {
          setGamepadConnected(false);
          gamepadRef.current = null;
          lastJoystickUpdate = 0;
          lastButtonPressTime = 0;
        }
      }
      
      animationFrameId = requestAnimationFrame(pollGamepad);
    };
    
    animationFrameId = requestAnimationFrame(pollGamepad);
    
    // Gamepad connection events
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad.id);
      setGamepadConnected(true);
      gamepadRef.current = e.gamepad;
    };
    
    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      setGamepadConnected(false);
      gamepadRef.current = null;
    };
    
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [gamepadConnected, handleNavigation, handleGamepadInput]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if we're typing in any search input
      const isTypingInSearch = document.activeElement === searchInputRefDesktop.current ||
                              document.activeElement === searchInputRefMobile.current;
      
      // If typing in search, only allow Escape to exit
      if (isTypingInSearch) {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (document.activeElement) {
            document.activeElement.blur();
          }
          setIsGridFocused(true);
        }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          return;
        }
        return;
      }

      // Handle Escape for closing modals
      if (e.key === 'Escape') {
        e.preventDefault();
        if (selectedGame) {
          setSelectedGame(null);
          return;
        } else if (showSettings) {
          setShowSettings(false);
          return;
        }
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter') {
        e.preventDefault();
        const gameInFocus = filteredGames[focusedIndex];
        
        if (showSettings) {
          handleSettingsModalButtonPress();
        } else if (selectedGame) {
          handleGameModalButtonPress();
        } else if (gameInFocus) {
          setSelectedGame(gameInFocus);
        }
        return;
      }

      // Handle arrow keys for navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        const direction = e.key.replace('Arrow', '').toUpperCase();
        handleNavigation(direction);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigation, showSettings, filteredGames, focusedIndex, selectedGame, handleGameModalButtonPress, handleSettingsModalButtonPress]);

  // Updated theme with gradient background
  const themeClasses = darkMode 
    ? "bg-gradient-to-br from-slate-900 to-slate-950 text-white" 
    : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900";
  
  const cardBase = "relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform aspect-[2/3] flex flex-col justify-end group cursor-pointer border-2 border-transparent hover:border-white/20";

  // Loading screen
  if (isLoading) {
    return (
      <div className={`w-full min-h-screen flex flex-col items-center justify-center font-sans ${themeClasses} transition-colors duration-300 overflow-hidden fade-in`}>
        <PulsingGlowStyles />
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin-slow" />
        <h2 className="text-xl font-semibold mt-4">Loading CloudBox Games...</h2>
        <p className="opacity-70 mt-2">Fetching games from the cloud</p>
      </div>
    );
  }

  // Main render
  return (
    <div className={`w-full min-h-screen font-sans ${themeClasses} transition-colors duration-300 overflow-x-hidden no-scrollbar fade-in`}>
      <PulsingGlowStyles />
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 gradient-animation ${darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`} 
          style={{backgroundSize: '400% 400%'}}>
        </div>
        
        {/* Subtle floating particles for dark mode */}
        {darkMode && (
          <>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full subtle-shift"
                style={{
                  width: `${Math.random() * 200 + 50}px`,
                  height: `${Math.random() * 200 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, rgba(99, 102, 241, ${0.02 + Math.random() * 0.03}) 0%, transparent 70%)`,
                  animationDuration: `${30 + Math.random() * 30}s`,
                  animationDelay: `${Math.random() * 10}s`,
                  opacity: 0.3
                }}
              />
            ))}
          </>
        )}
        
        {/* Subtle grid pattern for light mode */}
        {!darkMode && (
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                                linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        )}
      </div>
      
      {/* Header with responsive design */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-6 py-3 md:py-4 backdrop-blur-md ${darkMode ? 'bg-slate-900/90 border-b border-slate-800' : 'bg-white/90 border-b border-gray-200 shadow-sm'}`}>
        {/* Mobile: Hamburger menu for navigation */}
        <div className="md:hidden flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <Cloud className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CloudBox
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-200 shadow-sm'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left side: Logo and filter buttons */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg float-animation">
                <Cloud className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CloudBox
              </h1>
            </div>
            
            {/* Filter Buttons in same line */}
            <div className="flex gap-2">
              <button 
                onClick={() => setServices({ xbox: true, gfn: true })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${services.xbox && services.gfn 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                  : darkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
              >
                All Games
              </button>
              <button 
                onClick={() => setServices({ xbox: false, gfn: true })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${services.gfn && !services.xbox 
                  ? 'bg-gradient-to-r from-[#76B900] to-[#68a500] text-white shadow-md' 
                  : darkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
              >
                <GfnLogo className="w-3.5 h-3.5" />
                GFN
              </button>
              <button 
                onClick={() => setServices({ xbox: true, gfn: false })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${services.xbox && !services.gfn 
                  ? 'bg-gradient-to-r from-[#107C10] to-[#0e6e0e] text-white shadow-md' 
                  : darkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
              >
                <XboxLogo className="w-3.5 h-3.5" />
                Xbox
              </button>
            </div>
          </div>

          {/* Right side: Search and settings - DESKTOP VERSION */}
          <div className="flex items-center gap-4">
            <div className={`flex items-center px-3 py-1.5 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300 shadow-sm'}`}>
              <Search className={`w-4 h-4 mr-2 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
              <input 
                ref={searchInputRefDesktop}
                type="text" 
                placeholder="Search games..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsGridFocused(false)}
                onBlur={() => setIsGridFocused(true)}
                className={`bg-transparent border-none outline-none text-sm w-40 ${darkMode ? 'placeholder-slate-400' : 'placeholder-gray-500'}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className={`w-4 h-4 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`} />
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-200 shadow-sm'}`}
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile: Filter buttons and search */}
        <div className="md:hidden">
          {/* Mobile filter buttons */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setServices({ xbox: true, gfn: true })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${services.xbox && services.gfn 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                : darkMode 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
            >
              All Games
            </button>
            <button 
              onClick={() => setServices({ xbox: false, gfn: true })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${services.gfn && !services.xbox 
                ? 'bg-gradient-to-r from-[#76B900] to-[#68a500] text-white shadow-md' 
                : darkMode 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
            >
              <GfnLogo className="w-3 h-3" />
              GFN
            </button>
            <button 
              onClick={() => setServices({ xbox: true, gfn: false })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${services.xbox && !services.gfn 
                ? 'bg-gradient-to-r from-[#107C10] to-[#0e6e0e] text-white shadow-md' 
                : darkMode 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm border border-gray-300'}`}
            >
              <XboxLogo className="w-3 h-3" />
              Xbox
            </button>
          </div>
          
          {/* Mobile search - MOBILE VERSION */}
          <div className={`flex items-center px-3 py-1.5 rounded-full border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300 shadow-sm'}`}>
            <Search className={`w-4 h-4 mr-2 ${darkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <input 
              ref={searchInputRefMobile}
              type="text" 
              placeholder="Search games..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsGridFocused(false)}
              onBlur={() => setIsGridFocused(true)}
              className={`bg-transparent border-none outline-none text-sm flex-1 ${darkMode ? 'placeholder-slate-400' : 'placeholder-gray-500'}`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className={`w-4 h-4 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid - Adjust padding for mobile header height */}
      <main 
        className="px-3 md:px-6 pb-12 container max-w-7xl mx-auto transition-filter duration-300 pt-28 md:pt-24 no-scrollbar" 
        style={{ 
            filter: (selectedGame || showSettings) ? 'blur(2px)' : 'none',
            pointerEvents: (selectedGame || showSettings) ? 'none' : 'auto' 
        }}
      >
        {filteredGames.length === 0 ? (
          <div className="text-center mt-20 opacity-50 flex flex-col items-center">
            <Gamepad2 className={`w-16 h-16 mb-4 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} />
            <p className="text-xl">No games found with the current filters</p>
            <p className="text-sm opacity-70 mt-2">Try changing your search or enabling more services</p>
          </div>
        ) : (
          <div 
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6 transition-all duration-300"
          >
            {filteredGames.map((game, index) => {
              const isVisuallyActive = index === focusedIndex && !selectedGame && !showSettings;
              const dimClass = (selectedGame || showSettings) ? 'opacity-60' : '';
              const activeClasses = isVisuallyActive ? 'is-visually-active' : 'opacity-90 hover:opacity-100';
              const badgeClasses = game.service === 'xbox' 
                ? 'bg-gradient-to-r from-[#107C10] to-[#0e6e0e] text-white' 
                : 'bg-gradient-to-r from-[#76B900] to-[#68a500] text-white';

              return (
                <div 
                  key={game.id}
                  data-game-card
                  tabIndex={-1}
                  onClick={() => {
                    if (showSettings) return;
                    setFocusedIndex(index);
                    setSelectedGame(game);
                  }}
                  onMouseEnter={() => {
                    if (!showSettings) {
                      setFocusedIndex(index);
                      setIsGridFocused(false);
                    }
                  }}
                  className={`${cardBase} ${activeClasses} ${dimClass} ${darkMode ? '' : 'shadow-md hover:shadow-lg'}`}
                >
                  {/* Background blur */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${game.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'blur(10px)',
                      transform: 'scale(1.1)'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Main image */}
                  <img 
                    src={game.imageUrl} 
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      const parent = e.target.parentNode;
                      const serviceColor = game.service === 'xbox' ? '#0078D4' : '#107C10';
                      parent.innerHTML = `
                        <div class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${game.color} p-4">
                          <span class="text-white font-bold text-sm md:text-lg text-center px-2">${game.title}</span>
                          <span class="text-white/70 text-xs md:text-sm mt-1 md:mt-2">${game.service === 'xbox' ? 'Xbox Cloud' : 'GeForce NOW'}</span>
                        </div>
                      `;
                    }}
                  />

                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-x-0 bottom-0"
                    style={{
                      height: '50%',
                      background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 0%, transparent 100%)'
                    }}
                  />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                    <h3 className="text-sm md:text-xl font-bold leading-tight text-white drop-shadow-[0_2px_8px rgba(0,0,0,0.9)] line-clamp-2">
                      {game.title}
                    </h3>
                    <div className="flex items-center justify-between mt-1 md:mt-2">
                      <span className="text-xs md:text-sm text-white/80">{game.year}</span>
                    </div>
                  </div>

                  {/* Platform badge */}
                  <div className={`absolute top-1 md:top-2 left-1 md:left-2 p-1 rounded-full shadow-lg ${badgeClasses}`}>
                    {game.service === 'xbox' 
                      ? <XboxLogo className="w-3 h-3 md:w-4 md:h-4" /> 
                      : <GfnLogo className="w-3 h-3 md:w-4 md:h-4" />
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      {/* UPDATED Controller Guide - Shows modal-specific instructions */}
      {!selectedGame && !showSettings ? (
          <ControllerGuide darkMode={darkMode} gamepadConnected={gamepadConnected} />
      ) : selectedGame ? (
          <ControllerGuide darkMode={darkMode} gamepadConnected={gamepadConnected} modalType="game" />
      ) : (
          <ControllerGuide darkMode={darkMode} gamepadConnected={gamepadConnected} modalType="settings" />
      )}

      {/* Modals */}
      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        services={services}
        setServices={setServices}
        sortAsc={sortAsc}
        setSortAsc={setSortAsc}
        focusedIndex={settingsFocusedIndex}
        onFocusedIndexChange={setSettingsFocusedIndex}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      <GameDetailModal 
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onLaunch={handleLaunch}
        darkMode={darkMode}
        focusedButton={gameModalFocusedButton}
        onButtonFocus={setGameModalFocusedButton}
      />
    </div>
  );
}